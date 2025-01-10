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
  playOrder: string[]; // memberId[]
  currentPlayerIndex: number;
  currentRound: number;
  eliminatedPlayers: UndercoverPlayer[];
  words: {
    civil: string;
    undercover: string;
  };
  teamsReady: string[]; // teamIds qui ont appuyé sur "Passer aux votes"
  votes: Record<string, string>; // teamId -> memberId voté
  gameOver?: boolean;
  civilsWin?: boolean;
};
