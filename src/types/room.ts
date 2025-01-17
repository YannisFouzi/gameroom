import { Timestamp } from "firebase/firestore";
import { MillionaireGameData } from "./millionaire";
import { UndercoverGameData } from "./undercover";
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
  wrongAnswer?: string;
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
  | "wheel-results"
  | "undercover-rules"
  | "undercover-playing"
  | "undercover-results"
  | "final-scores"
  | "rat-de-star"
  | "rat-de-star-rules"
  | null;

export type GameData = {
  celebrities?: Record<string, Celebrity>;
  remainingTeams: string[];
  currentTeamIndex: number;
  startTime?: number;
  lastFoundCelebrity: string | null;
  lastWrongCelebrity: string | null;
  startingTeam?: string;
  winningTeamName?: string;
  winningTeamId?: string;
  wheelState?: WheelState;
  currentTeamId?: string;
  scores?: {
    millionaire?: Record<string, number>;
    evaluation?: Record<string, number>;
    total?: Record<string, number>;
  };
  undercover?: UndercoverGameData;
  timer?: {
    startedAt: number;
    duration: number;
    isPaused: boolean;
    remainingTime: number;
  };
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

export interface Room {
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
  timerStartedAt: Timestamp | null;
  isTimerActive: boolean;
}

export type GameType = "Undercover" | "millionaire";

export type GameScores = {
  millionaire?: Record<string, number>;
  evaluation?: Record<string, number>;
  undercover?: Record<string, number>;
};
