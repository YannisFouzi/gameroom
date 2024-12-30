export type Theme =
  | "Politique"
  | "Informatique"
  | "Histoire"
  | "Animaux"
  | "Marque";

export type SubCategory = {
  theme: Theme;
  options: string[];
};

export type WheelData = {
  option: string;
  style: {
    backgroundColor: string;
    textColor: string;
  };
};
