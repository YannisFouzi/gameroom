export type Theme =
  | "Politique"
  | "Informatique"
  | "Histoire"
  | "Animaux"
  | "Marque";

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
  selectedDifficulty: 1 | 3 | 5 | 8 | null;
  scores: Record<string, number>;
  gameFinished: boolean;
};
