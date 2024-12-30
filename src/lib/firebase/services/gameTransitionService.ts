import { AnswerState } from "@/types/millionaire";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../config";
import { baseRoomService } from "./baseRoomService";

export const gameTransitionService = {
  async startNextGame(roomId: string) {
    const room = await baseRoomService.getRoom(roomId);

    if (!room.gameData?.remainingTeams?.length) {
      throw new Error("No winning team found");
    }

    const winningTeamId = room.gameData.remainingTeams[0];
    const winningTeam = room.teams[winningTeamId];

    if (!winningTeam) {
      throw new Error("Winning team not found");
    }

    const allTeamIds = Object.keys(room.teams);
    const reorderedTeams = [
      winningTeamId,
      ...allTeamIds.filter((id) => id !== winningTeamId),
    ];

    await updateDoc(doc(db, "rooms", roomId), {
      currentGame: 2,
      gamePhase: "millionaire-rules",
      gameData: {
        currentTeamIndex: 0,
        remainingTeams: reorderedTeams,
        startingTeam: winningTeamId,
        winningTeamName: winningTeam.name,
        questions: [],
        currentQuestion: 0,
      },
      updatedAt: serverTimestamp(),
    });
  },

  async updateAnswerState(
    roomId: string,
    selectedAnswer: string | null,
    answerState: AnswerState,
    selectedAnswers: number[] = []
  ) {
    await updateDoc(doc(db, "rooms", roomId), {
      "gameData.selectedAnswer": selectedAnswer,
      "gameData.answerState": answerState,
      "gameData.selectedAnswers": selectedAnswers,
      updatedAt: serverTimestamp(),
    });
  },

  async startEvaluationGame(roomId: string) {
    const room = await baseRoomService.getRoom(roomId);

    // Initialiser les scores si nécessaire
    const scores = room.gameData?.scores || {};
    if (Object.keys(scores).length === 0) {
      // Créer un objet scores avec 0 pour chaque équipe
      Object.keys(room.teams).forEach((teamId) => {
        scores[teamId] = 0;
      });
    }

    // Trouver l'équipe gagnante basée sur les scores
    const sortedTeams = Object.entries(room.teams)
      .map(([teamId, team]) => ({
        teamId,
        name: team.name,
        score: scores[teamId] || 0,
      }))
      .sort((a, b) => b.score - a.score);

    const winningTeam = sortedTeams[0];

    await updateDoc(doc(db, "rooms", roomId), {
      gamePhase: "evaluation-rules",
      gameData: {
        scores,
        winningTeamName: winningTeam.name,
        winningTeamId: winningTeam.teamId,
        currentTeamId: winningTeam.teamId,
      },
      updatedAt: serverTimestamp(),
    });
  },

  async switchTeam(roomId: string) {
    const roomRef = doc(db, "rooms", roomId);
    const roomDoc = await getDoc(roomRef);
    const currentTeamId = roomDoc.data()?.gameData?.currentTeamId;
    const teams = Object.keys(roomDoc.data()?.teams || {});

    // Trouver l'index de l'équipe suivante
    const currentIndex = teams.indexOf(currentTeamId);
    const nextIndex = (currentIndex + 1) % teams.length;
    const nextTeamId = teams[nextIndex];

    // Changer uniquement l'équipe courante
    await updateDoc(roomRef, {
      "gameData.currentTeamId": nextTeamId,
    });
  },
};
