import { GameType } from "@/types/room";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "./config";
import {
  baseRoomService,
  gameTransitionService,
  jokerService,
  millionaireService,
  ratDeStarService,
} from "./services";

// Service de compatibilité pour la transition
export const roomService = {
  ...baseRoomService,
  ...ratDeStarService,
  ...millionaireService,
  ...jokerService,
  ...gameTransitionService,

  async updateGameType(roomId: string, gameType: GameType) {
    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, {
      gameType: gameType,
    });
  },

  async startUndercoverGame(roomId: string) {
    await updateDoc(doc(db, "rooms", roomId), {
      gamePhase: "undercover-playing",
      updatedAt: serverTimestamp(),
    });
  },
};
