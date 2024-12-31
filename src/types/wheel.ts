export type Theme =
  | "Sport"
  | "Années 80"
  | "Télévision"
  | "Histoire et Géographie";

export type WheelData = {
  option: string;
  style: {
    backgroundColor: string;
    textColor: string;
  };
};

export type WheelState = {
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
};
