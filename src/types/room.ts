import { Timestamp } from "firebase/firestore";

export type GameType = "undercover" | "millionaire" | "other";

export type RoomStatus = "waiting" | "selecting" | "playing" | "finished";

export type TeamMember = {
  name: string;
  score: number;
};

export type Team = {
  id: string;
  name: string;
  members: TeamMember[];
  avatar: string;
  score: number;
  isOnline: boolean;
  lastSeen: Timestamp;
  deviceId: string;
};

export type Room = {
  id: string;
  hostId: string;
  gameType: GameType | null;
  status: RoomStatus;
  teams: Record<string, Team>;
  settings: {
    maxTeams: number;
    isPublic: boolean;
    gameMode: "team" | "individual";
  };
  createdAt: Date;
  updatedAt: Date;
};
