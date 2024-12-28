import { Timestamp } from "firebase/firestore";

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
  foundBy?: string; // teamId de l'équipe qui l'a trouvée
};

export type GamePhase = "explanation" | "memorization" | "guessing" | "results";

export type Room = {
  id: string;
  hostId: string;
  currentGame: number;
  gamePhase?: GamePhase;
  gameData?: {
    celebrities: Record<string, Celebrity>;
    remainingTeams: string[];
    currentTeamIndex: number;
    startTime?: number;
  };
  status: RoomStatus;
  teams: Record<string, Team>;
  settings: {
    maxTeams: number;
    isPublic: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
};
