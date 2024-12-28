import { generateUUID } from "@/lib/utils";
import { Celebrity, Room, RoomStatus, Team } from "@/types/room";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDb } from "./config";

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

export const roomService = {
  async createRoom(hostId: string) {
    const db = getDb();
    const roomRef = await addDoc(collection(db, "rooms"), {
      hostId,
      status: "waiting" as RoomStatus,
      currentGame: 0,
      teams: {},
      settings: {
        maxTeams: 10,
        isPublic: true,
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return roomRef.id;
  },

  async startGame(roomId: string) {
    const db = getDb();
    const teamIds = Object.keys((await this.getRoom(roomId)).teams);

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
    const room = await this.getRoom(roomId);
    const normalizedGuess = guess.toLowerCase().trim();

    // Trouver la célébrité correspondante
    const celebrity = Object.values(room.gameData?.celebrities || {}).find(
      (c) => !c.foundBy && c.validAnswers.includes(normalizedGuess)
    );

    if (celebrity) {
      // Réponse correcte
      await updateDoc(doc(db, "rooms", roomId), {
        [`gameData.celebrities.${celebrity.id}.foundBy`]: teamId,
        "gameData.currentTeamIndex":
          (room.gameData!.currentTeamIndex + 1) %
          room.gameData!.remainingTeams.length,
        updatedAt: serverTimestamp(),
      });
      return true;
    } else {
      // Réponse incorrecte - éliminer l'équipe
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

  async addTeam(
    roomId: string,
    teamData: {
      name: string;
      members: { name: string }[];
      avatar: string;
    }
  ) {
    const db = getDb();
    const teamId = generateUUID();
    const deviceId = generateUUID();

    const team: Omit<Team, "lastSeen"> & { lastSeen: any } = {
      id: teamId,
      name: teamData.name,
      members: teamData.members.map((member) => ({
        name: member.name,
        score: 0,
      })),
      avatar: teamData.avatar,
      score: 0,
      isOnline: true,
      lastSeen: serverTimestamp(),
      deviceId,
    };

    await updateDoc(doc(db, "rooms", roomId), {
      [`teams.${teamId}`]: team,
      updatedAt: serverTimestamp(),
    });

    return { teamId, deviceId };
  },

  async updateTeamScore(roomId: string, teamId: string, score: number) {
    const db = getDb();
    await updateDoc(doc(db, "rooms", roomId), {
      [`teams.${teamId}.score`]: score,
      updatedAt: serverTimestamp(),
    });
  },

  async updateRoomStatus(roomId: string, status: RoomStatus) {
    const db = getDb();
    await updateDoc(doc(db, "rooms", roomId), {
      status,
      updatedAt: serverTimestamp(),
    });
  },

  async getRoom(roomId: string) {
    const db = getDb();
    const roomSnap = await getDoc(doc(db, "rooms", roomId));
    if (!roomSnap.exists()) {
      throw new Error("Room not found");
    }
    return roomSnap.data() as Room;
  },
};
