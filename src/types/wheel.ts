import { Timestamp } from "firebase/firestore";

export type Theme = "Sport" | "Années 80" | "Télé / Ciné" | "Histoire / Géo";

export type WheelData = {
  option: string;
  style: {
    backgroundColor: string;
    textColor: string;
  };
};

export interface WheelState {
  isSpinning: boolean;
  prizeNumber?: number;
  selectedTheme: Theme | null;
  subCategory: string | null;
  usedSubCategories: Partial<Record<Theme, string[]>>;
  showQuestion: boolean;
  questionAnswered: boolean;
  selectedDifficulty: 2 | 4 | 7 | 10 | null;
  scores: Record<string, number>;
  gameFinished: boolean;
  timerStartedAt: Timestamp | null;
  isTimerActive: boolean;
  isVraiButtonVisible: boolean;
  showSpecialVideo?: boolean;
  specialVideoId?: string;
  waitingForVideo?: boolean;
}
