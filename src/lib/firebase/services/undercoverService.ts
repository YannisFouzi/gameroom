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
  async initializeGame(roomId: string) {
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
      playOrder, // Ordre alterné
      currentPlayerIndex: 0,
      currentRound: 0,
      eliminatedPlayers: [],
      words: WORDS_BY_ROUND[0],
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

    const nextIndex = gameData.currentPlayerIndex + 1;
    const allPlayersHaveSeenWord = nextIndex >= gameData.players.length;

    if (allPlayersHaveSeenWord) {
      // Si tous les joueurs ont vu leur mot, passer à la phase de jeu
      await updateDoc(doc(db, "rooms", roomId), {
        "gameData.undercover.currentPhase": "playing",
        "gameData.undercover.currentPlayerIndex": 0,
        updatedAt: serverTimestamp(),
      });
    } else {
      // Sinon, passer au joueur suivant
      await updateDoc(doc(db, "rooms", roomId), {
        "gameData.undercover.currentPlayerIndex": nextIndex,
        updatedAt: serverTimestamp(),
      });
    }
  },

  async assignWordToCurrentPlayer(roomId: string, teamId: string) {
    const room = await baseRoomService.getRoom(roomId);
    const gameData = room.gameData?.undercover as UndercoverGameData;
    const currentPlayer = gameData.players[gameData.currentPlayerIndex];

    // Assigner le mot selon le rôle
    let word = null;
    if (currentPlayer.role === "civil") {
      word = gameData.words.civil;
    } else if (currentPlayer.role === "undercover") {
      word = gameData.words.undercover;
    }
    // Mr White n'a pas de mot, mais on met null au lieu de undefined

    // Mettre à jour le mot du joueur
    const updatedPlayers = gameData.players.map((p, index) => {
      if (index === gameData.currentPlayerIndex) {
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

  // Autres méthodes à venir...
};
