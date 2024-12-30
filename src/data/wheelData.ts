import { Theme, WheelData } from "@/types/wheel";

export const wheelData: WheelData[] = [
  {
    option: "Politique",
    style: { backgroundColor: "#FF6B6B", textColor: "white" },
  },
  {
    option: "Informatique",
    style: { backgroundColor: "#4ECDC4", textColor: "white" },
  },
  {
    option: "Histoire",
    style: { backgroundColor: "#45B7D1", textColor: "white" },
  },
  {
    option: "Animaux",
    style: { backgroundColor: "#96CEB4", textColor: "white" },
  },
  {
    option: "Marque",
    style: { backgroundColor: "#D4A5A5", textColor: "white" },
  },
];

export const subCategories: Record<Theme, string[]> = {
  Politique: ["Macron", "Sarkozy", "Hollande"],
  Informatique: ["Excel", "Photoshop", "Spotify"],
  Histoire: ["Napoléon", "Seconde Guerre Mondiale", "Guerre Froide"],
  Animaux: ["Dauphin", "Singe", "Chien"],
  Marque: ["Asus", "Google", "Microsoft"],
};

export const getRandomSubCategory = (theme: Theme): string => {
  const options = subCategories[theme];
  return options[Math.floor(Math.random() * options.length)];
};
