import { AnswerState } from "@/types/millionaire";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../config";
import { baseRoomService } from "./baseRoomService";

export const gameTransitionService = {
  async startNextGame(roomId: string) {
    const room = await baseRoomService.getRoom(roomId);

    if (!room.gameData?.scores) {
      throw new Error("No scores found");
    }

    // Trouver l'équipe gagnante (celle avec le plus haut score)
    const winningTeamEntry = Object.entries(room.gameData.scores).sort(
      ([, scoreA], [, scoreB]) => scoreB - scoreA
    )[0];

    if (!winningTeamEntry) {
      throw new Error("No winning team found");
    }

    const [winningTeamId] = winningTeamEntry;
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
      currentGame: 3,
      gamePhase: "evaluation-rules",
      gameData: {
        currentTeamIndex: 0,
        remainingTeams: reorderedTeams,
        startingTeam: winningTeamId,
        winningTeamName: winningTeam.name,
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
};
