import { subCategories } from "@/data/wheelData";
import { db } from "@/lib/firebase/config";
import { Theme } from "@/types/wheel";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const wheelService = {
  async startSpin(roomId: string, prizeNumber: number) {
    const roomRef = doc(db, "rooms", roomId);
    const roomDoc = await getDoc(roomRef);
    const currentWheelState = roomDoc.data()?.gameData?.wheelState;
    const currentUsedSubCategories = currentWheelState?.usedSubCategories || {};
    const currentScores = currentWheelState?.scores || {};

    await updateDoc(roomRef, {
      "gameData.wheelState": {
        isSpinning: true,
        prizeNumber,
        selectedTheme: null,
        subCategory: null,
        usedSubCategories: currentUsedSubCategories,
        showQuestion: false,
        questionAnswered: false,
        selectedDifficulty: null,
        scores: currentScores,
      },
    });
  },

  async stopSpin(
    roomId: string,
    theme: Theme,
    subCategory: string,
    usedSubCategories: Partial<Record<Theme, string[]>>
  ) {
    const roomRef = doc(db, "rooms", roomId);
    const roomDoc = await getDoc(roomRef);
    const currentScores = roomDoc.data()?.gameData?.wheelState?.scores || {};
    const allOptions = subCategories[theme];
    const used = usedSubCategories[theme] || [];
    let updatedUsedSubCategories;

    if (used.length >= allOptions.length - 1) {
      updatedUsedSubCategories = {
        ...usedSubCategories,
        [theme]: [subCategory],
      };
    } else {
      updatedUsedSubCategories = {
        ...usedSubCategories,
        [theme]: [...used, subCategory],
      };
    }

    await updateDoc(roomRef, {
      "gameData.wheelState": {
        isSpinning: false,
        selectedTheme: theme,
        subCategory,
        usedSubCategories: updatedUsedSubCategories,
        showQuestion: false,
        questionAnswered: false,
        selectedDifficulty: null,
        scores: currentScores,
      },
    });
  },

  async selectDifficulty(roomId: string, difficulty: 2 | 4 | 7 | 10) {
    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, {
      "gameData.wheelState.selectedDifficulty": difficulty,
      "gameData.wheelState.showQuestion": true,
    });
  },

  async answerQuestion(
    roomId: string,
    isCorrect: boolean,
    teamId: string,
    difficulty: 2 | 4 | 7 | 10
  ) {
    const roomRef = doc(db, "rooms", roomId);
    const roomDoc = await getDoc(roomRef);
    const currentScores = roomDoc.data()?.gameData?.wheelState?.scores || {};

    let updatedScores = { ...currentScores };
    if (isCorrect) {
      updatedScores[teamId] = (updatedScores[teamId] || 0) + difficulty;

      // Vérifier si l'équipe a gagné
      if (updatedScores[teamId] >= 25) {
        await updateDoc(roomRef, {
          gamePhase: "wheel-results",
          "gameData.winningTeamId": teamId,
          "gameData.wheelState": {
            ...roomDoc.data()?.gameData?.wheelState,
            scores: updatedScores,
            gameFinished: true,
          },
        });
        return;
      }
    }

    await updateDoc(roomRef, {
      "gameData.wheelState": {
        ...roomDoc.data()?.gameData?.wheelState,
        questionAnswered: true,
        showQuestion: false,
        selectedDifficulty: null,
        selectedTheme: null,
        subCategory: null,
        isSpinning: false,
        scores: updatedScores,
      },
    });
  },
};
