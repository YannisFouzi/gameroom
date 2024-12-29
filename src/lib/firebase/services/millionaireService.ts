import { MillionaireCategory } from "@/types/millionaire";
import {
  arrayUnion,
  doc,
  increment,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config";
import { baseRoomService } from "./baseRoomService";

export const millionaireService = {
  async startMillionaireGame(roomId: string) {
    const room = await baseRoomService.getRoom(roomId);

    if (!room.gameData) return;

    const initialJokers = Object.fromEntries(
      room.gameData.remainingTeams.map((teamId) => [
        teamId,
        { phoneCall: false, fiftyFifty: false },
      ])
    );

    await updateDoc(doc(db, "rooms", roomId), {
      gamePhase: "millionaire-playing",
      "gameData.currentQuestionIndex": 0,
      "gameData.usedCategories": [],
      "gameData.scores": {},
      "gameData.currentCategory": null,
      "gameData.selectedAnswer": null,
      "gameData.answerState": null,
      "gameData.selectedAnswers": [],
      "gameData.jokers": initialJokers,
      updatedAt: serverTimestamp(),
    });
  },

  calculateSecurePoints(questionIndex: number): number {
    if (questionIndex < 5) return 0;
    if (questionIndex < 10) return 5;
    return 10;
  },

  async selectMillionaireCategory(
    roomId: string,
    category: MillionaireCategory
  ) {
    await updateDoc(doc(db, "rooms", roomId), {
      "gameData.currentCategory": category,
      "gameData.currentQuestionIndex": 0,
      "gameData.usedCategories": arrayUnion(category),
      updatedAt: serverTimestamp(),
    });
  },

  async submitMillionaireAnswer(
    roomId: string,
    isCorrect: boolean,
    currentQuestionIndex: number,
    points: number
  ) {
    const room = await baseRoomService.getRoom(roomId);
    const currentTeamIndex = room.gameData?.currentTeamIndex || 0;
    const currentTeam = room.gameData?.remainingTeams[currentTeamIndex];

    if (!currentTeam || !room.gameData?.remainingTeams) return;

    if (!isCorrect) {
      const securePoints = this.calculateSecurePoints(currentQuestionIndex);
      const nextTeamIndex =
        (currentTeamIndex + 1) % room.gameData.remainingTeams.length;

      await updateDoc(doc(db, "rooms", roomId), {
        [`gameData.scores.${currentTeam}`]: increment(securePoints),
        "gameData.currentTeamIndex": nextTeamIndex,
        "gameData.currentCategory": null,
        updatedAt: serverTimestamp(),
      });
    }
  },

  async moveToNextQuestion(roomId: string, nextQuestionIndex: number) {
    await updateDoc(doc(db, "rooms", roomId), {
      "gameData.currentQuestionIndex": nextQuestionIndex,
      "gameData.selectedAnswer": null,
      "gameData.answerState": null,
      "gameData.selectedAnswers": [],
      "gameData.hiddenAnswers": [],
      "gameData.doubleAnswerActive": false,
      updatedAt: serverTimestamp(),
    });
  },

  async moveToNextTeam(roomId: string, nextTeamIndex: number) {
    await updateDoc(doc(db, "rooms", roomId), {
      "gameData.currentTeamIndex": nextTeamIndex,
      "gameData.currentCategory": null,
      "gameData.selectedAnswer": null,
      "gameData.answerState": null,
      "gameData.selectedAnswers": [],
      "gameData.hiddenAnswers": [],
      "gameData.doubleAnswerActive": false,
      updatedAt: serverTimestamp(),
    });
  },

  async quitWithPoints(roomId: string, points: number) {
    const room = await baseRoomService.getRoom(roomId);
    const currentTeamIndex = room.gameData?.currentTeamIndex || 0;
    const currentTeam = room.gameData?.remainingTeams[currentTeamIndex];

    if (!currentTeam || !room.gameData?.remainingTeams) return;

    const nextTeamIndex =
      (currentTeamIndex + 1) % room.gameData.remainingTeams.length;

    await updateDoc(doc(db, "rooms", roomId), {
      [`gameData.scores.${currentTeam}`]: increment(points),
      "gameData.currentTeamIndex": nextTeamIndex,
      "gameData.currentCategory": null,
      updatedAt: serverTimestamp(),
    });
  },
};
