import { millionaireQuestions } from "@/data/millionaireQuestions";
import { MillionaireCategory } from "@/types/millionaire";

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
      {(Object.keys(millionaireQuestions) as MillionaireCategory[]).map(
        (category) => {
          const categoryInfo = categories.find((c) => c.id === category);
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              disabled={usedCategories.includes(category)}
              className={`p-6 rounded-lg text-center ${
                usedCategories.includes(category)
                  ? "bg-gray-100 cursor-not-allowed text-gray-500"
                  : "bg-blue-50 hover:bg-blue-100 text-black"
              }`}
            >
              <div className="text-4xl mb-2">{categoryInfo?.icon}</div>
              <h3 className="text-lg font-medium">{categoryInfo?.name}</h3>
            </button>
          );
        }
      )}
    </div>
  );
}
