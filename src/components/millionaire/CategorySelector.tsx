import { MillionaireCategory } from "@/types/millionaire";
import { motion } from "framer-motion";

type CategorySelectorProps = {
  onSelectCategory: (category: MillionaireCategory) => void;
  usedCategories: MillionaireCategory[];
  isCurrentTeam: boolean;
  isHost: boolean;
};

export default function CategorySelector({
  onSelectCategory,
  usedCategories,
  isCurrentTeam,
  isHost,
}: CategorySelectorProps) {
  const handleCategorySelect = async (category: MillionaireCategory) => {
    if (!isCurrentTeam) return;
    onSelectCategory(category);
  };

  if (!isCurrentTeam) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-600">
          En attente de la sélection de l'équipe active...
        </p>
      </div>
    );
  }

  const categories = [
    {
      id: "histoire" as MillionaireCategory,
      name: "Histoire / Géo",
      icon: "🏛️",
      colors:
        "from-amber-500 via-orange-600 to-orange-700 border-orange-400/30",
      gradient: "bg-[linear-gradient(90deg,#f59e0b,#ea580c,#f59e0b)]",
    },
    {
      id: "sport" as MillionaireCategory,
      name: "Sport",
      icon: "⚽",
      colors: "from-emerald-500 via-green-600 to-green-700 border-green-400/30",
      gradient: "bg-[linear-gradient(90deg,#10b981,#059669,#10b981)]",
    },
    {
      id: "annees80" as MillionaireCategory,
      name: "Années 80",
      icon: "🕺",
      colors:
        "from-fuchsia-500 via-purple-600 to-purple-700 border-purple-400/30",
      gradient: "bg-[linear-gradient(90deg,#d946ef,#9333ea,#d946ef)]",
    },
    {
      id: "television" as MillionaireCategory,
      name: "Télé / Ciné",
      icon: "📺",
      colors: "from-rose-500 via-red-600 to-red-700 border-red-400/30",
      gradient: "bg-[linear-gradient(90deg,#f43f5e,#dc2626,#f43f5e)]",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-6 p-4">
      {categories.map((category, index) => (
        <motion.button
          key={category.id}
          onClick={() => handleCategorySelect(category.id)}
          disabled={usedCategories.includes(category.id) || !isCurrentTeam}
          initial={{
            opacity: 0,
            y: 20,
            backgroundPosition: "0% 50%",
          }}
          animate={{
            opacity: 1,
            y: 0,
            backgroundPosition: ["0% 50%", "200% 50%"],
          }}
          transition={{
            opacity: { duration: 0.3, delay: index * 0.1 },
            y: { duration: 0.3, delay: index * 0.1 },
            backgroundPosition: {
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            },
          }}
          whileHover={{
            scale: usedCategories.includes(category.id) ? 1 : 1.05,
            y: -5,
            transition: {
              duration: 0.2,
              ease: "easeInOut",
            },
          }}
          whileTap={{
            scale: usedCategories.includes(category.id) ? 1 : 0.95,
            y: 0,
          }}
          className={`
            p-8 rounded-2xl flex flex-col items-center justify-center gap-3
            shadow-lg border-2 transition-all duration-300
            bg-[size:200%_100%]
            ${
              usedCategories.includes(category.id)
                ? "bg-gray-800/80 border-gray-700 cursor-not-allowed opacity-60"
                : `${category.gradient} hover:shadow-xl hover:border-opacity-50`
            }
          `}
        >
          <motion.span
            className="text-5xl mb-2 filter drop-shadow-md"
            whileHover={{
              rotate: [0, -10, 10, -10, 0],
              transition: { duration: 0.5 },
            }}
          >
            {category.icon}
          </motion.span>
          <span className="text-xl font-bold text-white tracking-wide drop-shadow-md">
            {category.name}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
