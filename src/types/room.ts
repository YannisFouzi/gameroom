import { Timestamp } from "firebase/firestore";
import { MillionaireGameData } from "./millionaire";

export type RoomStatus = "waiting" | "playing" | "finished";

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

export type Celebrity = {
  id: string;
  name: string;
  validAnswers: string[];
  imageUrl: string;
  foundBy?: string;
};

export type GamePhase =
  | "explanation"
  | "memorization"
  | "guessing"
  | "results"
  | "millionaire-rules"
  | "millionaire-playing";

export type GameData = {
  celebrities?: Record<string, Celebrity>;
  remainingTeams: string[];
  currentTeamIndex: number;
  startTime?: number;
  startingTeam?: string;
  winningTeamName?: string;
} & Partial<MillionaireGameData>;

export type Room = {
  id: string;
  hostId: string;
  currentGame: number;
  gamePhase?: GamePhase;
  gameData?: GameData;
  status: RoomStatus;
  teams: Record<string, Team>;
  settings: {
    maxTeams: number;
    isPublic: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
};
