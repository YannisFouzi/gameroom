export type UndercoverRole = "civil" | "undercover" | "mrwhite";

export type UndercoverPlayer = {
  memberId: string;
  teamId: string;
  name: string;
  role: UndercoverRole;
  word?: string;
  isEliminated: boolean;
};

export type UndercoverGameData = {
  currentPhase: "distribution" | "playing" | "voting" | "results";
  players: UndercoverPlayer[];
  playOrder: string[];
  currentPlayerIndex: number;
  currentPlayerIndexByTeam: Record<string, number>;
  currentRound: number;
  eliminatedPlayers: UndercoverPlayer[];
  words: {
    civil: string;
    undercover: string;
  };
  teamsReady: string[];
  votes: Record<string, string>;
  gameOver?: boolean;
  winningTeamId?: string;
};
