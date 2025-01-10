import { Team } from "@/types/room";
import {
  UndercoverGameData,
  UndercoverPlayer,
  UndercoverRole,
} from "@/types/undercover";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../config";
import { baseRoomService } from "./baseRoomService";

const WORDS_BY_ROUND = [
  { civil: "asterix", undercover: "obelix" },
  { civil: "om", undercover: "marseille" },
  { civil: "linux", undercover: "windows" },
];

function assignRoles(teams: Record<string, Team>): UndercoverPlayer[] {
  const players: UndercoverPlayer[] = [];

  Object.entries(teams).forEach(([teamId, team]) => {
    const teamSize = team.members.length;
    let roles: UndercoverRole[] = [];

    // Définir les rôles selon la taille de l'équipe
    if (teamSize === 2) {
      roles = ["civil", "undercover"];
    } else if (teamSize === 3) {
      roles = ["civil", "civil", "undercover"];
    } else if (teamSize === 4) {
      roles = ["civil", "civil", "undercover", "mrwhite"];
    }

    // Mélanger les rôles
    roles.sort(() => Math.random() - 0.5);

    // Assigner les rôles aux joueurs
    team.members.forEach((member, index) => {
      players.push({
        memberId: member.name, // Utiliser le nom comme ID temporaire
        teamId,
        name: member.name,
        role: roles[index],
        isEliminated: false,
      });
    });
  });

  return players;
}

export const undercoverService = {
  async initializeGame(roomId: string, round: number = 0) {
    const room = await baseRoomService.getRoom(roomId);
    const players = assignRoles(room.teams);

    // 1. Grouper les joueurs par équipe
    const playersByTeam: Record<string, UndercoverPlayer[]> = {};
    players.forEach((player) => {
      if (!playersByTeam[player.teamId]) {
        playersByTeam[player.teamId] = [];
      }
      playersByTeam[player.teamId].push(player);
    });

    // 2. Mélanger les joueurs de chaque équipe
    Object.values(playersByTeam).forEach((teamPlayers) => {
      teamPlayers.sort(() => Math.random() - 0.5);
    });

    // 3. Créer l'ordre alterné
    const teamIds = Object.keys(playersByTeam);
    const maxPlayers = Math.max(
      ...Object.values(playersByTeam).map((p) => p.length)
    );
    const playOrder: string[] = [];

    // Alterner entre les équipes
    for (let i = 0; i < maxPlayers; i++) {
      teamIds.forEach((teamId) => {
        const player = playersByTeam[teamId][i];
        if (player) {
          playOrder.push(player.memberId);
        }
      });
    }

    const initialGameData: UndercoverGameData = {
      currentPhase: "distribution",
      players,
      playOrder,
      currentPlayerIndex: 0,
      currentPlayerIndexByTeam: Object.keys(room.teams).reduce(
        (acc, teamId) => ({
          ...acc,
          [teamId]: 0,
        }),
        {}
      ),
      currentRound: round,
      eliminatedPlayers: [],
      words: WORDS_BY_ROUND[round],
      teamsReady: [],
      votes: {},
    };

    await updateDoc(doc(db, "rooms", roomId), {
      "gameData.undercover": initialGameData,
      updatedAt: serverTimestamp(),
    });
  },

  async nextPlayer(roomId: string, teamId: string) {
    const room = await baseRoomService.getRoom(roomId);
    const gameData = room.gameData?.undercover as UndercoverGameData;

    // Obtenir les joueurs de cette équipe
    const teamPlayers = gameData.players.filter((p) => p.teamId === teamId);
    const currentIndex = gameData.currentPlayerIndexByTeam[teamId];
    const nextIndex = currentIndex + 1;
    const teamHasFinished = nextIndex >= teamPlayers.length;

    // Mettre à jour l'index de l'équipe
    const updatedIndexes = {
      ...gameData.currentPlayerIndexByTeam,
      [teamId]: teamHasFinished ? -1 : nextIndex, // Mettre -1 quand l'équipe a fini
    };

    // Vérifier si toutes les équipes ont fini
    const allTeamsFinished = Object.entries(updatedIndexes).every(
      ([tid, index]) =>
        index === -1 ||
        index >= gameData.players.filter((p) => p.teamId === tid).length - 1
    );

    await updateDoc(doc(db, "rooms", roomId), {
      "gameData.undercover.currentPlayerIndexByTeam": updatedIndexes,
      ...(allTeamsFinished && {
        "gameData.undercover.currentPhase": "playing",
      }),
      updatedAt: serverTimestamp(),
    });
  },

  async assignWordToCurrentPlayer(roomId: string, teamId: string) {
    const room = await baseRoomService.getRoom(roomId);
    const gameData = room.gameData?.undercover as UndercoverGameData;

    // Trouver le joueur actuel de cette équipe
    const teamPlayers = gameData.players.filter((p) => p.teamId === teamId);
    const currentIndex = gameData.currentPlayerIndexByTeam[teamId];
    const currentPlayer = teamPlayers[currentIndex];

    // Assigner le mot selon le rôle
    let word = null;
    if (currentPlayer.role === "civil") {
      word = gameData.words.civil;
    } else if (currentPlayer.role === "undercover") {
      word = gameData.words.undercover;
    }

    // Trouver l'index global du joueur dans la liste complète
    const globalPlayerIndex = gameData.players.findIndex(
      (p) => p.memberId === currentPlayer.memberId
    );

    // Mettre à jour le mot du joueur
    const updatedPlayers = gameData.players.map((p, index) => {
      if (index === globalPlayerIndex) {
        // Utiliser l'index global
        return { ...p, word };
      }
      return p;
    });

    await updateDoc(doc(db, "rooms", roomId), {
      "gameData.undercover.players": updatedPlayers,
      updatedAt: serverTimestamp(),
    });
  },

  async teamReady(roomId: string, teamId: string) {
    const room = await baseRoomService.getRoom(roomId);
    const gameData = room.gameData?.undercover as UndercoverGameData;

    const updatedTeamsReady = [...gameData.teamsReady, teamId];
    const allTeamsReady =
      updatedTeamsReady.length === Object.keys(room.teams).length;

    await updateDoc(doc(db, "rooms", roomId), {
      "gameData.undercover.teamsReady": updatedTeamsReady,
      "gameData.undercover.currentPhase": allTeamsReady ? "voting" : "results",
      updatedAt: serverTimestamp(),
    });
  },

  async submitVote(roomId: string, teamId: string, votedPlayerId: string) {
    const room = await baseRoomService.getRoom(roomId);
    const gameData = room.gameData?.undercover as UndercoverGameData;

    const updatedVotes = {
      ...gameData.votes,
      [teamId]: votedPlayerId,
    };

    const allTeamsVoted =
      Object.keys(updatedVotes).length === Object.keys(room.teams).length;

    if (allTeamsVoted) {
      // Compter les votes
      const voteCount: Record<string, number> = {};
      Object.values(updatedVotes).forEach((playerId) => {
        voteCount[playerId] = (voteCount[playerId] || 0) + 1;
      });

      // Trouver le(s) joueur(s) le(s) plus voté(s)
      const maxVotes = Math.max(...Object.values(voteCount));
      const eliminatedPlayerIds = Object.entries(voteCount)
        .filter(([, count]) => count === maxVotes)
        .map(([playerId]) => playerId);

      // Mettre à jour les joueurs éliminés
      const updatedPlayers = gameData.players.map((player) => ({
        ...player,
        isEliminated:
          player.isEliminated || eliminatedPlayerIds.includes(player.memberId),
      }));

      // Ajouter les joueurs éliminés à la liste
      const newEliminatedPlayers = updatedPlayers.filter((p) =>
        eliminatedPlayerIds.includes(p.memberId)
      );

      await updateDoc(doc(db, "rooms", roomId), {
        "gameData.undercover.players": updatedPlayers,
        "gameData.undercover.eliminatedPlayers": [
          ...gameData.eliminatedPlayers,
          ...newEliminatedPlayers,
        ],
        "gameData.undercover.currentPhase": "results",
        "gameData.undercover.votes": {},
        "gameData.undercover.teamsReady": [],
        updatedAt: serverTimestamp(),
      });
    } else {
      // Juste enregistrer le vote
      await updateDoc(doc(db, "rooms", roomId), {
        "gameData.undercover.votes": updatedVotes,
        updatedAt: serverTimestamp(),
      });
    }
  },

  async checkGameEnd(roomId: string) {
    const room = await baseRoomService.getRoom(roomId);
    const gameData = room.gameData?.undercover as UndercoverGameData;

    const activePlayers = gameData.players.filter((p) => !p.isEliminated);
    const civilsCount = activePlayers.filter((p) => p.role === "civil").length;
    const impostorsCount = activePlayers.filter(
      (p) => p.role === "undercover" || p.role === "mrwhite"
    ).length;

    let gameOver = false;
    let civilsWin = false;

    // Les civils gagnent si tous les imposteurs sont éliminés
    if (impostorsCount === 0) {
      gameOver = true;
      civilsWin = true;
    }
    // Les imposteurs gagnent s'il ne reste qu'un civil
    else if (civilsCount <= 1) {
      gameOver = true;
      civilsWin = false;
    }

    if (gameOver) {
      await updateDoc(doc(db, "rooms", roomId), {
        gamePhase: "undercover-results",
        "gameData.undercover.gameOver": true,
        "gameData.undercover.civilsWin": civilsWin,
        updatedAt: serverTimestamp(),
      });
      return true;
    }
    return false;
  },

  async startNextRound(roomId: string) {
    const room = await baseRoomService.getRoom(roomId);
    const gameData = room.gameData?.undercover as UndercoverGameData;
    const nextRound = gameData.currentRound + 1;

    if (nextRound >= WORDS_BY_ROUND.length) {
      // Fin du jeu si plus de mots disponibles
      await updateDoc(doc(db, "rooms", roomId), {
        gamePhase: "undercover-results",
        updatedAt: serverTimestamp(),
      });
      return;
    }

    // Créer un nouvel ordre aléatoire pour les joueurs non éliminés
    const activePlayers = gameData.players
      .filter((p) => !p.isEliminated)
      .map((p) => p.memberId)
      .sort(() => Math.random() - 0.5);

    await updateDoc(doc(db, "rooms", roomId), {
      "gameData.undercover": {
        ...gameData,
        currentRound: nextRound,
        words: WORDS_BY_ROUND[nextRound],
        currentPhase: "distribution",
        currentPlayerIndex: 0,
        playOrder: activePlayers,
        votes: {},
        teamsReady: [],
      },
      updatedAt: serverTimestamp(),
    });
  },

  async teamReadyForNextGame(roomId: string, teamId: string) {
    const room = await baseRoomService.getRoom(roomId);
    const gameData = room.gameData?.undercover as UndercoverGameData;

    const updatedTeamsReady = [...(gameData.teamsReady || []), teamId];
    const allTeamsReady =
      updatedTeamsReady.length === Object.keys(room.teams).length;

    if (allTeamsReady) {
      // Initialiser une nouvelle partie avec les mots suivants
      await this.initializeGame(roomId, (gameData.currentRound || 0) + 1);

      // Changer directement la phase du jeu
      await updateDoc(doc(db, "rooms", roomId), {
        gamePhase: "undercover-playing",
        updatedAt: serverTimestamp(),
      });
    } else {
      // Juste enregistrer l'équipe comme prête
      await updateDoc(doc(db, "rooms", roomId), {
        "gameData.undercover.teamsReady": updatedTeamsReady,
        updatedAt: serverTimestamp(),
      });
    }
  },

  // Autres méthodes à venir...
};
