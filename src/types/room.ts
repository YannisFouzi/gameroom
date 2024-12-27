import { Timestamp } from "firebase/firestore";

export type GameType = "undercover" | "millionaire" | "other";

export type RoomStatus = "waiting" | "selecting" | "playing" | "finished";

export type Player = {
  id: string;
  playerId?: string;
  name: string;
  avatar: string;
  score: number;
  teamId?: string;
  isOnline: boolean;
  lastSeen: Timestamp;
};

export type Team = {
  id: string;
  name: string;
  score: number;
  players: string[];
};

export type Room = {
  id: string;
  hostId: string;
  gameType: GameType | null;
  status: RoomStatus;
  players: Record<string, Player>;
  teams?: Record<string, Team>;
  settings: {
    gameMode: "team" | "individual";
    maxPlayers: number;
    isPublic: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
};
