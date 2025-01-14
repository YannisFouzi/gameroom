import { Timestamp } from "firebase/firestore";

export type MillionaireCategory =
  | "histoire"
  | "sport"
  | "annees80"
  | "television";

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
  [category: string]: {
    phoneCall: boolean;
    fiftyFifty: boolean;
    doubleAnswer: boolean;
  };
};

export type AnswerState = "selected" | "correct" | "incorrect" | null;

export interface MillionaireGameData {
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
  phoneCallModalOpen: boolean; // Nouvel état pour la modal
  hiddenAnswers: number[]; // Ajouter ce champ pour les réponses masquées par le 50:50
  doubleAnswerActive: boolean;
  isBlinking: boolean;
  timer?: {
    startTime: Timestamp;
    duration: number;
    isPaused: boolean;
  };
}
