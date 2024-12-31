import { Theme, WheelData } from "@/types/wheel";

export const wheelData: WheelData[] = [
  {
    option: "Sport",
    style: { backgroundColor: "#FF6B6B", textColor: "white" },
  },
  {
    option: "Années 80",
    style: { backgroundColor: "#4ECDC4", textColor: "white" },
  },
  {
    option: "Télévision",
    style: { backgroundColor: "#45B7D1", textColor: "white" },
  },
  {
    option: "Histoire / Géo",
    style: { backgroundColor: "#96CEB4", textColor: "white" },
  },
];

export const subCategories: Record<Theme, string[]> = {
  Sport: [
    "Cyclisme",
    "Football",
    "Jeux Olympiques",
    "Ski",
    "Rugby",
    "Natation",
  ],
  "Années 80": [
    "Chanteurs",
    "Modes de vie",
    "Films",
    "Musiques",
    "Mode et style vestimentaire",
    "Albums",
  ],
  Télévision: [
    "Séries françaises de l'époque",
    "Séries françaises actuelles",
    "Jeux de l'époque",
    "Jeux actuels",
    "Séries américaines",
    "Stars des années 80",
  ],
  "Histoire et Géographie": [
    "Amérique du Sud",
    "Première Guerre mondiale",
    "Guerre froide",
    "Campagnes napoléoniennes",
    "Rois de France",
    "Afrique",
  ],
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
