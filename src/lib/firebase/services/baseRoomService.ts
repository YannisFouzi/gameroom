import { generateUUID } from "@/lib/utils";
import { Room, RoomStatus, Team } from "@/types/room";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config";

export const baseRoomService = {
  async createRoom(hostId: string) {
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

  async getRoom(roomId: string) {
    const roomSnap = await getDoc(doc(db, "rooms", roomId));
    if (!roomSnap.exists()) {
      throw new Error("Room not found");
    }
    return roomSnap.data() as Room;
  },

  async updateRoomStatus(roomId: string, status: RoomStatus) {
    await updateDoc(doc(db, "rooms", roomId), {
      status,
      updatedAt: serverTimestamp(),
    });
  },

  async addTeam(
    roomId: string,
    teamData: {
      name: string;
      members: { name: string }[];
      avatar: string;
    }
  ) {
    const teamId = generateUUID();
    const deviceId = generateUUID();

    const team: Omit<Team, "lastSeen"> & { lastSeen: any } = {
      id: teamId,
      name: teamData.name,
      members: teamData.members.map((member) => ({
        name: member.name,
        score: 0,
      })),
      players: [],
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
    await updateDoc(doc(db, "rooms", roomId), {
      [`teams.${teamId}.score`]: score,
      updatedAt: serverTimestamp(),
    });
  },
};
