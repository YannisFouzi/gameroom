export type MillionaireCategory =
  | "histoire"
  | "musique"
  | "annees80"
  | "mystere";

export type MillionaireQuestion = {
  id: string;
  text: string;
  answers: string[];
  correctAnswer: number; // Index de la bonne réponse
  points: number;
  category: MillionaireCategory;
};

export type JokerType = "phoneCall" | "fiftyFifty";

export type TeamJokers = {
  phoneCall: boolean;
  fiftyFifty: boolean;
};

export type MillionaireGameData = {
  currentTeamIndex: number;
  remainingTeams: string[];
  startingTeam: string;
  currentCategory?: MillionaireCategory;
  currentQuestionIndex: number;
  usedCategories: MillionaireCategory[];
  scores: Record<string, number>; // teamId -> score
  jokers: Record<string, TeamJokers>; // teamId -> jokers status
};
