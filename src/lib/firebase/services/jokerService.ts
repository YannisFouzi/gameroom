import { JokerType } from "@/types/millionaire";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDb } from "../config";

export const jokerService = {
  async useJoker(roomId: string, teamId: string, jokerType: JokerType) {
    const db = getDb();
    await updateDoc(doc(db, "rooms", roomId), {
      [`gameData.jokers.${teamId}.${jokerType}`]: true,
      updatedAt: serverTimestamp(),
    });
  },

  async setPhoneCallModalState(roomId: string, isOpen: boolean) {
    const db = getDb();
    await updateDoc(doc(db, "rooms", roomId), {
      "gameData.phoneCallModalOpen": isOpen,
      updatedAt: serverTimestamp(),
    });
  },

  async setHiddenAnswers(roomId: string, hiddenAnswers: number[]) {
    const db = getDb();
    await updateDoc(doc(db, "rooms", roomId), {
      "gameData.hiddenAnswers": hiddenAnswers,
      updatedAt: serverTimestamp(),
    });
  },

  async setDoubleAnswerActive(roomId: string, isActive: boolean) {
    const db = getDb();
    await updateDoc(doc(db, "rooms", roomId), {
      "gameData.doubleAnswerActive": isActive,
      updatedAt: serverTimestamp(),
    });
  },
};
