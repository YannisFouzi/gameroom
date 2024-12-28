import { generateUUID } from "@/lib/utils";
import { GameType, RoomStatus, Team } from "@/types/room";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDb } from "./config";

export const roomService = {
  async createRoom(hostId: string) {
    const db = getDb();
    const roomRef = await addDoc(collection(db, "rooms"), {
      hostId,
      status: "waiting" as RoomStatus,
      gameType: null,
      teams: {},
      settings: {
        maxTeams: 10,
        isPublic: true,
        gameMode: "individual",
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return roomRef.id;
  },

  async addTeam(
    roomId: string,
    teamData: {
      members: { name: string }[];
      avatar: string;
    }
  ) {
    const db = getDb();
    const teamId = generateUUID();
    const deviceId = generateUUID();

    const team: Omit<Team, "lastSeen"> & { lastSeen: any } = {
      id: teamId,
      name:
        teamData.members.length === 1
          ? teamData.members[0].name
          : `Équipe ${teamData.members[0].name}`,
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

  async updateGameMode(roomId: string, gameMode: "team" | "individual") {
    const db = getDb();
    await updateDoc(doc(db, "rooms", roomId), {
      "settings.gameMode": gameMode,
      updatedAt: serverTimestamp(),
    });
  },

  async updateGameType(roomId: string, gameType: GameType) {
    const db = getDb();
    await updateDoc(doc(db, "rooms", roomId), {
      gameType,
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
};
