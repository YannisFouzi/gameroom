import { JokerType } from "@/types/millionaire";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../config";
import { baseRoomService } from "./baseRoomService";

export const jokerService = {
  async useJoker(roomId: string, teamId: string, jokerType: JokerType) {
    const room = await baseRoomService.getRoom(roomId);
    const category = room.gameData?.currentCategory;

    if (!category) return;

    await updateDoc(doc(db, "rooms", roomId), {
      [`gameData.jokers.${teamId}.${category}.${jokerType}`]: true,
      updatedAt: serverTimestamp(),
    });
  },

  async setPhoneCallModalState(roomId: string, isOpen: boolean) {
    await updateDoc(doc(db, "rooms", roomId), {
      "gameData.phoneCallModalOpen": isOpen,
      updatedAt: serverTimestamp(),
    });
  },

  async setHiddenAnswers(roomId: string, hiddenAnswers: number[]) {
    await updateDoc(doc(db, "rooms", roomId), {
      "gameData.hiddenAnswers": hiddenAnswers,
      updatedAt: serverTimestamp(),
    });
  },

  async setDoubleAnswerActive(roomId: string, isActive: boolean) {
    await updateDoc(doc(db, "rooms", roomId), {
      "gameData.doubleAnswerActive": isActive,
      updatedAt: serverTimestamp(),
    });
  },
};
