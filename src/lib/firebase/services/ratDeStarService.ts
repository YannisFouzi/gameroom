import { Celebrity } from "@/types/room";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDb } from "../config";
import { baseRoomService } from "./baseRoomService";

const CELEBRITIES: Record<string, Celebrity> = {
  sarkozy: {
    id: "sarkozy",
    name: "Nicolas Sarkozy",
    validAnswers: ["sarkozy", "nicolas sarkozy"],
    imageUrl: "/ratDeStar/Nicolas_Sarkozy.png",
  },
  zidane: {
    id: "zidane",
    name: "Zinedine Zidane",
    validAnswers: ["zidane", "zinedine zidane"],
    imageUrl: "/ratDeStar/Zinedine_Zidane.png",
  },
};

export const ratDeStarService = {
  async startGame(roomId: string) {
    const db = getDb();
    const teamIds = Object.keys((await baseRoomService.getRoom(roomId)).teams);

    await updateDoc(doc(db, "rooms", roomId), {
      status: "playing",
      currentGame: 1,
      gamePhase: "explanation",
      gameData: {
        celebrities: CELEBRITIES,
        remainingTeams: teamIds,
        currentTeamIndex: 0,
      },
      updatedAt: serverTimestamp(),
    });
  },

  async startMemorizationPhase(roomId: string) {
    const db = getDb();
    const now = Date.now();

    await updateDoc(doc(db, "rooms", roomId), {
      gamePhase: "memorization",
      "gameData.startTime": now,
      updatedAt: serverTimestamp(),
    });
  },

  async startGuessingPhase(roomId: string) {
    const db = getDb();
    await updateDoc(doc(db, "rooms", roomId), {
      gamePhase: "guessing",
      updatedAt: serverTimestamp(),
    });
  },

  async submitGuess(roomId: string, teamId: string, guess: string) {
    const db = getDb();
    const room = await baseRoomService.getRoom(roomId);
    const normalizedGuess = guess.toLowerCase().trim();

    const celebrity = Object.values(room.gameData?.celebrities || {}).find(
      (c) => !c.foundBy && c.validAnswers.includes(normalizedGuess)
    );

    if (celebrity) {
      await updateDoc(doc(db, "rooms", roomId), {
        [`gameData.celebrities.${celebrity.id}.foundBy`]: teamId,
        "gameData.currentTeamIndex":
          (room.gameData!.currentTeamIndex + 1) %
          room.gameData!.remainingTeams.length,
        updatedAt: serverTimestamp(),
      });
      return true;
    } else {
      const remainingTeams = room.gameData!.remainingTeams.filter(
        (id) => id !== teamId
      );

      await updateDoc(doc(db, "rooms", roomId), {
        "gameData.remainingTeams": remainingTeams,
        "gameData.currentTeamIndex": 0,
        gamePhase: remainingTeams.length === 1 ? "results" : "guessing",
        updatedAt: serverTimestamp(),
      });
      return false;
    }
  },
};
