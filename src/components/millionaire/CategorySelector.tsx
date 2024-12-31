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
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold text-white mb-2">
            C'est votre tour !
          </h3>
          <p className="text-xl text-white/80">Choisissez une catégorie</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {(Object.keys(millionaireQuestions) as MillionaireCategory[]).map(
          (category) => {
            const categoryInfo = categories.find((c) => c.id === category);
            const isUsed = usedCategories.includes(category);

            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                disabled={isUsed}
                className={`p-8 rounded-xl text-center transition-all duration-200 relative overflow-hidden ${
                  isUsed
                    ? "bg-gradient-to-br from-gray-700 to-gray-800 cursor-not-allowed border-2 border-gray-600"
                    : "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 border-2 border-blue-400 shadow-lg hover:shadow-xl"
                }`}
              >
                {isUsed && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                    <span className="text-2xl text-white/90 font-bold">
                      Déjà utilisée
                    </span>
                  </div>
                )}
                <div
                  className={`text-5xl mb-4 ${isUsed ? "text-gray-400" : ""}`}
                >
                  {categoryInfo?.icon}
                </div>
                <h3
                  className={`text-xl font-bold ${
                    isUsed ? "text-gray-400" : "text-white"
                  }`}
                >
                  {categoryInfo?.name}
                </h3>
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}
