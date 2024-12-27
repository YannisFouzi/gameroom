import { GameType, Room, Team } from "@/types/room";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDb } from "./config";

export const roomService = {
  async createRoom(hostId: string): Promise<string> {
    const db = getDb();
    const roomsRef = collection(db, "rooms");
    const newRoomRef = doc(roomsRef);

    const newRoom: Omit<Room, "id"> = {
      hostId,
      gameType: null,
      status: "waiting",
      players: {},
      settings: {
        gameMode: "individual",
        maxPlayers: 10,
        isPublic: true,
      },
      createdAt: serverTimestamp() as unknown as Date,
      updatedAt: serverTimestamp() as unknown as Date,
    };

    await setDoc(newRoomRef, newRoom);
    return newRoomRef.id;
  },

  async addPlayer(roomId: string, player: { name: string; avatar: string }) {
    const db = getDb();
    const playerData = {
      id: crypto.randomUUID(),
      name: player.name,
      avatar: player.avatar,
      score: 0,
      isOnline: true,
      lastSeen: serverTimestamp(),
    };

    await updateDoc(doc(db, "rooms", roomId), {
      [`players.${playerData.id}`]: playerData,
      updatedAt: serverTimestamp(),
    });

    return playerData.id;
  },

  async updateGameMode(roomId: string, gameMode: "team" | "individual") {
    const db = getDb();
    await updateDoc(doc(db, "rooms", roomId), {
      "settings.gameMode": gameMode,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteRoom(roomId: string) {
    const db = getDb();
    await deleteDoc(doc(db, "rooms", roomId));
  },

  async getRoom(roomId: string) {
    const db = getDb();
    const docRef = doc(db, "rooms", roomId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Room not found");
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Room;
  },

  async updatePlayerScore(roomId: string, playerId: string, newScore: number) {
    const db = getDb();
    await updateDoc(doc(db, "rooms", roomId), {
      [`players.${playerId}.score`]: newScore,
      updatedAt: serverTimestamp(),
    });
  },

  async removePlayer(roomId: string, playerId: string) {
    const db = getDb();
    const roomRef = doc(db, "rooms", roomId);
    const room = await getDoc(roomRef);

    if (!room.exists()) {
      throw new Error("Room not found");
    }

    const data = room.data();
    const players = { ...data.players };
    delete players[playerId];

    await updateDoc(roomRef, {
      players,
      updatedAt: serverTimestamp(),
    });
  },

  async updateRoomStatus(
    roomId: string,
    status: "waiting" | "playing" | "finished"
  ) {
    const db = getDb();
    await updateDoc(doc(db, "rooms", roomId), {
      status,
      updatedAt: serverTimestamp(),
    });
  },

  async createTeam(roomId: string, team: Omit<Team, "id">) {
    const db = getDb();
    const teamId = crypto.randomUUID();
    await updateDoc(doc(db, "rooms", roomId), {
      [`teams.${teamId}`]: { id: teamId, ...team },
      updatedAt: serverTimestamp(),
    });
    return teamId;
  },

  async assignPlayerToTeam(roomId: string, playerId: string, teamId: string) {
    const db = getDb();
    const roomRef = doc(db, "rooms", roomId);
    const room = await getDoc(roomRef);

    if (!room.exists()) {
      throw new Error("Room not found");
    }

    const data = room.data() as Room;
    const teams = { ...(data.teams || {}) };

    // Retirer le joueur de son équipe actuelle s'il en a une
    Object.keys(teams).forEach((tid: string) => {
      teams[tid].players = teams[tid].players.filter(
        (pid: string) => pid !== playerId
      );
    });

    // Ajouter le joueur à la nouvelle équipe
    teams[teamId].players.push(playerId);

    await updateDoc(roomRef, {
      teams,
      [`players.${playerId}.teamId`]: teamId,
      updatedAt: serverTimestamp(),
    });
  },

  async updateTeamScore(roomId: string, teamId: string, newScore: number) {
    const db = getDb();
    await updateDoc(doc(db, "rooms", roomId), {
      [`teams.${teamId}.score`]: newScore,
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
};
