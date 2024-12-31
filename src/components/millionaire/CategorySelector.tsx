import { millionaireQuestions } from "@/data/millionaireQuestions";
import { MillionaireCategory } from "@/types/millionaire";

type CategorySelectorProps = {
  onSelectCategory: (category: MillionaireCategory) => void;
  usedCategories: MillionaireCategory[];
  isHost: boolean;
  isCurrentTeam: boolean;
};

export default function CategorySelector({
  usedCategories,
  onSelectCategory,
  isCurrentTeam,
  isHost,
}: CategorySelectorProps) {
  const categories = [
    {
      id: "histoire" as MillionaireCategory,
      name: "Histoire & Géographie",
      icon: "🌍",
    },
    { id: "sport" as MillionaireCategory, name: "Sport", icon: "⚽" },
    { id: "annees80" as MillionaireCategory, name: "Années 80", icon: "🕹️" },
    { id: "television" as MillionaireCategory, name: "Télévision", icon: "📺" },
  ];

  if (!isCurrentTeam) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {isCurrentTeam && (
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">
            C'est votre tour !
          </h3>
          <p className="text-xl text-white/80">Choisissez une catégorie</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
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
    </div>
  );
}
