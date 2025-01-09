import { useAudio } from "@/hooks/useAudio";
import { MillionaireCategory } from "@/types/millionaire";
import { motion } from "framer-motion";

type CategorySelectorProps = {
  onSelectCategory: (category: MillionaireCategory) => void;
  usedCategories: MillionaireCategory[];
};

export default function CategorySelector({
  onSelectCategory,
  usedCategories,
}: CategorySelectorProps) {
  const { play: playSelect } = useAudio("/sound/millionnaire/sounds_play.mp3");

  const handleCategorySelect = (category: MillionaireCategory) => {
    playSelect();
    onSelectCategory(category);
  };

  const categories = [
    {
      id: "histoire" as MillionaireCategory,
      name: "Histoire",
      icon: "🏛️",
    },
    {
      id: "sport" as MillionaireCategory,
      name: "Sport",
      icon: "⚽",
    },
    {
      id: "annees80" as MillionaireCategory,
      name: "Années 80",
      icon: "🎵",
    },
    {
      id: "television" as MillionaireCategory,
      name: "Télévision",
      icon: "📺",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {categories.map((category) => (
        <motion.button
          key={category.id}
          onClick={() => handleCategorySelect(category.id)}
          disabled={usedCategories.includes(category.id)}
          whileHover={{
            scale: usedCategories.includes(category.id) ? 1 : 1.05,
          }}
          whileTap={{ scale: usedCategories.includes(category.id) ? 1 : 0.95 }}
          className={`p-6 rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${
            usedCategories.includes(category.id)
              ? "bg-gray-700/50 cursor-not-allowed"
              : "bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
          }`}
        >
          <span className="text-4xl">{category.icon}</span>
          <span className="text-xl font-bold text-white">{category.name}</span>
        </motion.button>
      ))}
    </div>
  );
}
