import { subCategories } from "@/data/wheelData";
import { db } from "@/lib/firebase/config";
import { Theme } from "@/types/wheel";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const wheelService = {
  async startSpin(roomId: string, prizeNumber: number) {
    const roomRef = doc(db, "rooms", roomId);
    const roomDoc = await getDoc(roomRef);
    const currentUsedSubCategories =
      roomDoc.data()?.gameData?.wheelState?.usedSubCategories || {};

    await updateDoc(roomRef, {
      "gameData.wheelState": {
        isSpinning: true,
        prizeNumber,
        selectedTheme: null,
        subCategory: null,
        usedSubCategories: currentUsedSubCategories,
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
      },
    });
  },
};
