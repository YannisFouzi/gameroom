export type RateYourselfTheme =
  | "histoire"
  | "animaux"
  | "marque"
  | "sport"
  | "cinema";

export type RateYourselfSubTheme = {
  histoire: "napoleon" | "secondeGuerreMondiale" | "guerreFroide";
  animaux: "dauphin" | "singe" | "chien";
  marque: "asus" | "google" | "microsoft";
  sport: "football" | "tennis" | "basketball";
  cinema: "acteurs" | "realisateurs" | "films";
};

export type RateYourselfQuestion = {
  id: string;
  text: string;
  answer: string;
  difficulty: number;
};

export type RateYourselfGameData = {
  positions: Record<string, number>; // teamId -> position sur le plateau
  currentTheme: RateYourselfTheme | null;
  selectedDifficulty: number | null; // 1-5
  currentQuestion: RateYourselfQuestion | null;
  answerState: "correct" | "incorrect" | null;
};
