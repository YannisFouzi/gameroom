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

export type JokerType = "phoneCall" | "fiftyFifty" | "doubleAnswer";

export type TeamJokers = {
  phoneCall: boolean;
  fiftyFifty: boolean;
  doubleAnswer: boolean;
};

export type AnswerState = "selected" | "correct" | "incorrect" | null;

export type MillionaireGameData = {
  currentTeamIndex: number;
  remainingTeams: string[];
  startingTeam: string;
  currentCategory?: MillionaireCategory;
  currentQuestionIndex: number;
  usedCategories: MillionaireCategory[];
  scores: Record<string, number>; // teamId -> score
  jokers: Record<string, TeamJokers>; // teamId -> jokers status
  selectedAnswer: string | null;
  answerState: AnswerState;
  selectedAnswers: number[]; // Pour le joker double réponse
};
