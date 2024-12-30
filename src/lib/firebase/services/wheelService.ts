import { db } from "@/lib/firebase/config";
import { Theme } from "@/types/wheel";
import { doc, updateDoc } from "firebase/firestore";

export const wheelService = {
  async startSpin(roomId: string, prizeNumber: number) {
    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, {
      "gameData.wheelState": {
        isSpinning: true,
        prizeNumber,
        selectedTheme: null,
        subCategory: null,
      },
    });
  },

  async stopSpin(roomId: string, theme: Theme, subCategory: string) {
    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, {
      "gameData.wheelState": {
        isSpinning: false,
        selectedTheme: theme,
        subCategory,
      },
    });
  },
};
