import { Theme, WheelData } from "@/types/wheel";

export const wheelData: WheelData[] = [
  {
    option: "Sport",
    style: { backgroundColor: "#FF4444", textColor: "white" },
  },
  {
    option: "Années 80",
    style: { backgroundColor: "#4CAF50", textColor: "white" },
  },
  {
    option: "Télé / Ciné",
    style: { backgroundColor: "#2196F3", textColor: "white" },
  },
  {
    option: "Histoire / Géo",
    style: { backgroundColor: "#9C27B0", textColor: "white" },
  },
];

export const subCategories: Record<Theme, string[]> = {
  Sport: [
    "Cyclisme",
    "Football",
    "Jeux Olympiques",
    "Ski français",
    "Formule 1",
    "Natation",
  ],
  "Années 80": [
    "Chanteurs",
    "Acteurs et actrices",
    "Films",
    "Musiques",
    "Chanteuses",
    "Albums",
  ],
  "Télé / Ciné": [
    "Séries télé",
    "Émissions françaises de l'époque",
    "Film classique français",
    "Le film Les Bronzés font du ski",
    "Le film Les Bronzés",
    "Séries américaines",
  ],
  "Histoire / Géo": [
    "L'Afrique",
    "Les Rois de la Renaissance",
    "Les Rois Français au Moyen Âge",
    "Les Guerres Napoléoniennes",
    "L'Asie",
    "Guerre froide",
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
