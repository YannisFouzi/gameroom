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

    // Sauvegarder les scores du millionaire
    const millionaireScores = room.gameData?.scores || {};

    const sortedScores = Object.entries(millionaireScores).sort(
      ([, a], [, b]) => (b as number) - (a as number)
    );

    await updateDoc(doc(db, "rooms", roomId), {
      gamePhase: "evaluation-rules",
      gameData: {
        scores: {
          millionaire: millionaireScores,
          evaluation: {},
          total: millionaireScores,
        },
        winningTeamName: room.teams[sortedScores[0][0]]?.name,
        winningTeamId: sortedScores[0][0],
        currentTeamId: sortedScores[0][0],
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

  async startUndercoverGame(roomId: string) {
    const room = await baseRoomService.getRoom(roomId);

    await updateDoc(doc(db, "rooms", roomId), {
      gamePhase: "undercover-rules",
      gameData: {
        currentTeamId: room.gameData?.winningTeamId,
      },
      updatedAt: serverTimestamp(),
    });
  },
};
