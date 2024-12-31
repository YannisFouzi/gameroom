import { MillionaireCategory } from "@/types/millionaire";
import { Room } from "@/types/room";
import {
  arrayUnion,
  doc,
  increment,
  runTransaction,
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

    if (isCorrect) {
      // Si c'est la dernière question (index 14 = question 15)
      if (currentQuestionIndex === 14) {
        // Ajouter les points et rediriger vers les résultats
        await updateDoc(doc(db, "rooms", roomId), {
          [`gameData.scores.${currentTeam}`]: increment(points),
          gamePhase: "millionaire-results", // Redirection vers les résultats
          updatedAt: serverTimestamp(),
        });
        return;
      }
    }

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
      "gameData.currentQuestionIndex": 0,
      "gameData.selectedAnswer": null,
      "gameData.answerState": null,
      "gameData.selectedAnswers": [],
      "gameData.hiddenAnswers": [],
      "gameData.doubleAnswerActive": false,
      updatedAt: serverTimestamp(),
    });
  },

  async quitWithPoints(roomId: string, points: number) {
    const roomRef = doc(db, "rooms", roomId);

    await runTransaction(db, async (transaction) => {
      const roomDoc = await transaction.get(roomRef);
      if (!roomDoc.exists()) return;

      const room = roomDoc.data() as Room;
      if (!room.gameData) return;

      const currentTeam =
        room.gameData.remainingTeams[room.gameData.currentTeamIndex];
      const nextTeamIndex =
        (room.gameData.currentTeamIndex + 1) %
        room.gameData.remainingTeams.length;

      // Mettre à jour le score
      const currentScore = (room.gameData.scores || {})[currentTeam] || 0;
      const newScores = {
        ...(room.gameData.scores || {}),
        [currentTeam]: currentScore + points,
      };

      // Réinitialiser les états pour l'équipe suivante
      transaction.update(roomRef, {
        "gameData.scores": newScores,
        "gameData.currentTeamIndex": nextTeamIndex,
        "gameData.currentCategory": null,
        "gameData.currentQuestionIndex": 0,
        "gameData.answerState": null, // Réinitialisation
        "gameData.selectedAnswer": null, // Réinitialisation
        "gameData.selectedAnswers": [], // Réinitialisation
      });
    });
  },
};
