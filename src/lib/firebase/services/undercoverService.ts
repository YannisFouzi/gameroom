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
  async initializeGame(roomId: string, round: number = 1) {
    const room = await baseRoomService.getRoom(roomId);
    if (!room) return;

    // Initialiser les scores si nécessaire
    const initialScores = room.gameData?.scores || {
      millionaire: {},
      evaluation: {},
      undercover: {},
    };

    await updateDoc(doc(db, "rooms", roomId), {
      "gameData.scores": initialScores,
      updatedAt: serverTimestamp(),
    });

    // Assigner les rôles aux joueurs
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

    // Récupérer les scores existants
    const undercoverScores = room.gameData?.undercover?.scores || {};
    const teamScores: Record<string, number> = {};
    Object.keys(room.teams).forEach((teamId) => {
      teamScores[teamId] = undercoverScores[teamId] || 0;
    });

    const gameData: UndercoverGameData = {
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
      words: WORDS_BY_ROUND[round - 1], // Utiliser les mots du round actuel
      teamsReady: [],
      votes: {},
      scores: teamScores,
      gameOver: false,
      isLastGame: round === WORDS_BY_ROUND.length, // Vrai si c'est le dernier round
    };

    await updateDoc(doc(db, "rooms", roomId), {
      "gameData.undercover": gameData,
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
    const teamHasFinished = nextIndex > teamPlayers.length - 1;

    // Mettre à jour l'index de l'équipe
    const updatedIndexes = {
      ...gameData.currentPlayerIndexByTeam,
      [teamId]: teamHasFinished ? -1 : nextIndex,
    };

    // Vérifier si toutes les équipes ont fini
    const allTeamsFinished = Object.entries(updatedIndexes).every(
      ([tid, index]) => index === -1
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

    if (allTeamsReady) {
      // Passer à la phase de vote et réinitialiser les votes
      await updateDoc(doc(db, "rooms", roomId), {
        "gameData.undercover.teamsReady": [],
        "gameData.undercover.currentPhase": "voting",
        "gameData.undercover.votes": {}, // Réinitialiser les votes
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

  async submitVote(roomId: string, teamId: string, votedPlayerId: string) {
    const room = await baseRoomService.getRoom(roomId);
    const gameData = room.gameData?.undercover as UndercoverGameData;

    // Mettre à jour les votes
    const updatedVotes = { ...gameData.votes, [teamId]: votedPlayerId };
    const allTeamsVoted =
      Object.keys(room.teams).length === Object.keys(updatedVotes).length;

    if (allTeamsVoted) {
      // Compter les votes
      const voteCount: Record<string, number> = {};
      Object.values(updatedVotes).forEach((id) => {
        voteCount[id] = (voteCount[id] || 0) + 1;
      });

      // Trouver le nombre maximum de votes
      const maxVotes = Math.max(...Object.values(voteCount));

      // Trouver tous les joueurs avec le maximum de votes
      const eliminatedIds = Object.entries(voteCount)
        .filter(([, count]) => count === maxVotes)
        .map(([playerId]) => playerId);

      // Trouver les joueurs correspondants
      const eliminatedPlayers = gameData.players.filter((p) =>
        eliminatedIds.includes(p.memberId)
      );

      // Mettre à jour les scores pour chaque joueur éliminé
      const updatedScores = { ...gameData.scores };
      eliminatedPlayers.forEach((player) => {
        if (player.role === "undercover") {
          Object.entries(updatedVotes).forEach(([votingTeamId, votedId]) => {
            if (votedId === player.memberId) {
              updatedScores[votingTeamId] =
                (updatedScores[votingTeamId] || 0) + 5;
            }
          });
        } else if (player.role === "mrwhite") {
          Object.entries(updatedVotes).forEach(([votingTeamId, votedId]) => {
            if (votedId === player.memberId) {
              updatedScores[votingTeamId] =
                (updatedScores[votingTeamId] || 0) + 3;
            }
          });
        }
      });

      // Mettre à jour les joueurs éliminés et les scores
      await updateDoc(doc(db, "rooms", roomId), {
        "gameData.undercover.votes": updatedVotes,
        "gameData.undercover.scores": updatedScores,
        "gameData.undercover.eliminatedPlayers": [
          ...gameData.eliminatedPlayers,
          ...eliminatedPlayers,
        ],
        "gameData.undercover.players": gameData.players.map((p) =>
          eliminatedIds.includes(p.memberId) ? { ...p, isEliminated: true } : p
        ),
        "gameData.undercover.currentPhase": "results",
        updatedAt: serverTimestamp(),
      });
    } else {
      // Juste mettre à jour les votes
      await updateDoc(doc(db, "rooms", roomId), {
        "gameData.undercover.votes": updatedVotes,
        updatedAt: serverTimestamp(),
      });
    }
  },

  async checkGameEnd(roomId: string) {
    const room = await baseRoomService.getRoom(roomId);
    const gameData = room.gameData?.undercover as UndercoverGameData;

    // Vérifier les imposteurs par équipe
    for (const teamId of Object.keys(room.teams)) {
      const teamPlayers = gameData.players.filter((p) => p.teamId === teamId);
      const activeImpostors = teamPlayers.filter(
        (p) =>
          !p.isEliminated && (p.role === "undercover" || p.role === "mrwhite")
      );

      // Si une équipe n'a plus d'imposteurs, l'autre équipe gagne
      if (activeImpostors.length === 0) {
        const winningTeamId = Object.keys(room.teams).find(
          (id) => id !== teamId
        );

        await updateDoc(doc(db, "rooms", roomId), {
          gamePhase: "undercover-results",
          "gameData.undercover.gameOver": true,
          "gameData.undercover.winningTeamId": winningTeamId,
          updatedAt: serverTimestamp(),
        });
        return true;
      }
    }
    return false;
  },

  async startNextRound(roomId: string) {
    const room = await baseRoomService.getRoom(roomId);
    const gameData = room.gameData?.undercover as UndercoverGameData;
    const nextRound = gameData.currentRound + 1;

    // Vérifier si c'est la dernière partie
    const isLastGame = nextRound >= WORDS_BY_ROUND.length;

    if (isLastGame) {
      // Fin du jeu si plus de mots disponibles
      await updateDoc(doc(db, "rooms", roomId), {
        gamePhase: "undercover-results",
        "gameData.undercover.isLastGame": true,
        "gameData.undercover.gameOver": true,
        "gameData.scores": {
          ...room.gameData?.scores,
          undercover: gameData.scores,
        },
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
        isLastGame: nextRound === WORDS_BY_ROUND.length - 1,
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
      const nextRound = (gameData.currentRound || 1) + 1;

      if (nextRound > WORDS_BY_ROUND.length) {
        // Fin du jeu Undercover, passer au jeu suivant
        await updateDoc(doc(db, "rooms", roomId), {
          gamePhase: "undercover-results",
          "gameData.undercover.gameOver": true,
          "gameData.undercover.isLastGame": true,
          "gameData.scores": {
            ...room.gameData?.scores,
            undercover: gameData.scores,
          },
          updatedAt: serverTimestamp(),
        });
      } else {
        // Initialiser la partie suivante avec le prochain round
        await this.initializeGame(roomId, nextRound);
        await updateDoc(doc(db, "rooms", roomId), {
          gamePhase: "undercover-playing",
          updatedAt: serverTimestamp(),
        });
      }
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
