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

export const getRandomSubCategory = (
  theme: Theme,
  usedSubCategories: Partial<Record<Theme, string[]>> = {}
): string => {
  const allOptions = subCategories[theme];
  const used = usedSubCategories[theme] || [];

  console.log("getRandomSubCategory:", {
    theme,
    allOptions,
    used,
    usedLength: used.length,
    allOptionsLength: allOptions.length,
    isResetting: used.length >= allOptions.length - 1,
  });

  if (used.length >= allOptions.length - 1) {
    const lastUsed = used[used.length - 1];
    const availableOptions = allOptions.filter((opt) => opt !== lastUsed);
    console.log("Resetting subcategories:", {
      lastUsed,
      availableOptions,
    });
    return availableOptions[
      Math.floor(Math.random() * availableOptions.length)
    ];
  }

  const availableOptions = allOptions.filter((opt) => !used.includes(opt));
  console.log("Normal selection:", {
    availableOptions,
  });
  return availableOptions[Math.floor(Math.random() * availableOptions.length)];
};
