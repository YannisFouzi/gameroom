import { MillionaireCategory } from "@/types/millionaire";
import { motion } from "framer-motion";

type CategorySelectorProps = {
  usedCategories: MillionaireCategory[];
  onSelectCategory: (category: MillionaireCategory) => void;
  isCurrentTeam: boolean;
};

export default function CategorySelector({
  usedCategories,
  onSelectCategory,
  isCurrentTeam,
}: CategorySelectorProps) {
  const categories = [
    {
      id: "histoire" as MillionaireCategory,
      name: "Histoire & Géographie",
      icon: "🌍",
    },
    { id: "musique" as MillionaireCategory, name: "Musique", icon: "🎵" },
    { id: "annees80" as MillionaireCategory, name: "Années 80", icon: "🕹️" },
    { id: "mystere" as MillionaireCategory, name: "Mystère", icon: "❓" },
  ];

  if (!isCurrentTeam) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-600">
          En attente de la sélection de la catégorie...
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
      {categories.map((category) => (
        <motion.button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          disabled={usedCategories.includes(category.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`p-6 rounded-lg text-center ${
            usedCategories.includes(category.id)
              ? "bg-gray-100 cursor-not-allowed"
              : "bg-blue-50 hover:bg-blue-100"
          }`}
        >
          <div className="text-4xl mb-2">{category.icon}</div>
          <h3 className="text-lg font-medium">{category.name}</h3>
        </motion.button>
      ))}
    </div>
  );
}
