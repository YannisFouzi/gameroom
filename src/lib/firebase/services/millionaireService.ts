import { MillionaireCategory } from "@/types/millionaire";
import { Room } from "@/types/room";
import {
  arrayUnion,
  doc,
  getDoc,
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
    const room = await baseRoomService.getRoom(roomId);
    const currentTeam =
      room.gameData?.remainingTeams[room.gameData.currentTeamIndex];

    if (!currentTeam) return;

    await updateDoc(doc(db, "rooms", roomId), {
      "gameData.currentCategory": category,
      "gameData.currentQuestionIndex": 0,
      "gameData.usedCategories": arrayUnion(category),
      [`gameData.jokers.${currentTeam}.${category}`]: {
        phoneCall: false,
        fiftyFifty: false,
        doubleAnswer: false,
      },
      updatedAt: serverTimestamp(),
    });
  },

  async submitMillionaireAnswer(
    roomId: string,
    isCorrect: boolean,
    questionIndex: number,
    points: number
  ) {
    const roomRef = doc(db, "rooms", roomId);

    await runTransaction(db, async (transaction) => {
      const roomDoc = await transaction.get(roomRef);
      if (!roomDoc.exists()) return;

      const room = roomDoc.data() as Room;
      if (!room.gameData) return;

      const currentTeam =
        room.gameData.remainingTeams[room.gameData.currentTeamIndex];

      if (isCorrect) {
        // Initialiser la structure des scores si elle n'existe pas
        const currentScores = room.gameData.scores || {};
        const millionaireScores = currentScores.millionaire || {};

        // Mettre à jour le score
        const currentScore = millionaireScores[currentTeam] || 0;
        const newMillionaireScores = {
          ...millionaireScores,
          [currentTeam]: currentScore + points,
        };

        // Mettre à jour avec la bonne structure
        transaction.update(roomRef, {
          "gameData.scores": {
            ...currentScores,
            millionaire: newMillionaireScores,
          },
        });
      }
    });
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

      // Initialiser la structure des scores si elle n'existe pas
      const currentScores = room.gameData.scores || {};
      const millionaireScores = currentScores.millionaire || {};

      // Mettre à jour le score
      const currentScore = millionaireScores[currentTeam] || 0;
      const newMillionaireScores = {
        ...millionaireScores,
        [currentTeam]: currentScore + points,
      };

      // Mettre à jour avec la bonne structure
      transaction.update(roomRef, {
        "gameData.scores": {
          ...currentScores,
          millionaire: newMillionaireScores,
        },
        "gameData.currentTeamIndex":
          (room.gameData.currentTeamIndex + 1) %
          room.gameData.remainingTeams.length,
        "gameData.currentCategory": null,
        "gameData.currentQuestionIndex": 0,
        "gameData.answerState": null,
        "gameData.selectedAnswer": null,
        "gameData.selectedAnswers": [],
      });
    });
  },

  determineAndSetWinner: async (roomId: string) => {
    const roomRef = doc(db, "rooms", roomId);
    const roomSnap = await getDoc(roomRef);
    const room = roomSnap.data();

    if (!room?.gameData?.scores?.millionaire) return;

    const scores = room.gameData.scores.millionaire;
    const maxScore = Math.max(
      ...Object.values(scores as Record<string, number>)
    );

    const topTeams = Object.entries(scores)
      .filter(([_, score]) => score === maxScore)
      .map(([teamId]) => teamId);

    const winningTeamId = topTeams[Math.floor(Math.random() * topTeams.length)];

    const winner = {
      teamId: winningTeamId,
      score: maxScore,
      tiebreaker: topTeams.length > 1,
    };

    // Stocker le gagnant
    await updateDoc(roomRef, {
      "gameData.winner": winner,
      "gameData.startingTeam": winningTeamId, // Important pour le jeu suivant
    });

    return winner;
  },
};

export const timerService = {
  async startTimer(roomId: string) {
    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, {
      "gameData.timer": {
        startTime: Date.now(),
        duration: 60,
        isPaused: false,
      },
    });
  },

  async pauseTimer(roomId: string) {
    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, {
      "gameData.timer.isPaused": true,
    });
  },
};
