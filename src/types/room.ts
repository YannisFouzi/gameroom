import { Timestamp } from "firebase/firestore";
import { MillionaireGameData } from "./millionaire";
import { WheelState } from "./wheel";

export type RoomStatus = "waiting" | "playing" | "finished";

export type TeamMember = {
  name: string;
  score: number;
};

export type Team = {
  id: string;
  name: string;
  members: TeamMember[];
  players: string[];
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
  | "waiting"
  | "playing"
  | "explanation"
  | "memorization"
  | "guessing"
  | "results"
  | "millionaire-rules"
  | "millionaire-playing"
  | "millionaire-results"
  | "evaluation-rules"
  | "evaluation-playing"
  | "wheel"
  | "wheel-results";

export type GameData = {
  celebrities?: Record<string, Celebrity>;
  remainingTeams: string[];
  currentTeamIndex: number;
  startTime?: number;
  lastFoundCelebrity?: string;
  startingTeam?: string;
  winningTeamName?: string;
  winningTeamId?: string;
  wheelState?: WheelState;
  currentTeamId?: string;
} & {
  [K in keyof MillionaireGameData]?: MillionaireGameData[K];
};

export type Player = {
  id?: string;
  name: string;
  avatar: string;
  teamId?: string;
  isOnline?: boolean;
  lastSeen?: Timestamp;
};

export type Room = {
  id: string;
  hostId: string;
  currentGame: number;
  gamePhase?: GamePhase;
  gameData?: GameData;
  status: RoomStatus;
  players: Record<string, Player>;
  teams: Record<string, Team>;
  settings: {
    maxTeams: number;
    maxPlayers: number;
    isPublic: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
};

export type GameType = "undercover" | "millionaire";
