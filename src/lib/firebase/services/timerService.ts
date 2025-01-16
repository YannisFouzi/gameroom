import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export type TimerService = {
  startTimer: (roomId: string) => Promise<void>;
  updateTimer: (roomId: string, currentTime: number) => Promise<void>;
  pauseTimer: (roomId: string) => Promise<void>;
  freezeTimer: (roomId: string, currentTime: number) => Promise<void>;
};

export const timerService: TimerService = {
  startTimer: async (roomId: string) => {
    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, {
      "gameData.timer": {
        currentTime: 60,
        isRunning: true,
      },
    });
  },

  updateTimer: async (roomId: string, currentTime: number) => {
    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, {
      "gameData.timer.currentTime": currentTime,
    });

    if (currentTime <= 0) {
      await updateDoc(roomRef, {
        "gameData.timer.isRunning": false,
      });
    }
  },

  pauseTimer: async (roomId: string) => {
    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, {
      "gameData.timer.isRunning": false,
    });
  },

  freezeTimer: async (roomId: string, currentTime: number) => {
    const roomRef = doc(db, "rooms", roomId);
    await updateDoc(roomRef, {
      "gameData.timer": {
        currentTime: currentTime,
        isRunning: false,
      },
    });
  },
};
