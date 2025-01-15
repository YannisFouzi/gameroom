import { Question } from "@/data/questions";

type DifficultyButtonsProps = {
  onSelectDifficulty: (difficulty: 2 | 4 | 7 | 10) => void;
  questions: Question[];
  isVisible: boolean;
  onStartTimer: () => void;
};

export default function DifficultyButtons({
  onSelectDifficulty,
  questions,
  isVisible,
  onStartTimer,
}: DifficultyButtonsProps) {
  if (!isVisible) return null;

  const handleDifficultySelect = (difficulty: 2 | 4 | 7 | 10) => {
    onSelectDifficulty(difficulty);
    onStartTimer();
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <h3 className="text-2xl font-bold mb-4 text-white text-center">
        Dire à l'équipe adverse quelle difficulté elle veut :
      </h3>
      <div className="grid grid-cols-2 gap-6 w-full max-w-md">
        <button
          onClick={() => handleDifficultySelect(2)}
          className="relative overflow-hidden group bg-gradient-to-br from-green-400 to-green-600 
          text-white text-2xl font-bold py-6 px-8 rounded-xl shadow-lg 
          transform transition-all duration-200 hover:scale-105 hover:shadow-xl
          active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
        >
          <span className="relative z-10">2</span>
        </button>
        <button
          onClick={() => handleDifficultySelect(4)}
          className="relative overflow-hidden group bg-gradient-to-br from-yellow-400 to-yellow-600 
          text-white text-2xl font-bold py-6 px-8 rounded-xl shadow-lg 
          transform transition-all duration-200 hover:scale-105 hover:shadow-xl
          active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
        >
          <span className="relative z-10">4</span>
        </button>
        <button
          onClick={() => handleDifficultySelect(7)}
          className="relative overflow-hidden group bg-gradient-to-br from-orange-400 to-orange-600 
          text-white text-2xl font-bold py-6 px-8 rounded-xl shadow-lg 
          transform transition-all duration-200 hover:scale-105 hover:shadow-xl
          active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50"
        >
          <span className="relative z-10">7</span>
        </button>
        <button
          onClick={() => handleDifficultySelect(10)}
          className="relative overflow-hidden group bg-gradient-to-br from-red-400 to-red-600 
          text-white text-2xl font-bold py-6 px-8 rounded-xl shadow-lg 
          transform transition-all duration-200 hover:scale-105 hover:shadow-xl
          active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
        >
          <span className="relative z-10">10</span>
        </button>
      </div>
    </div>
  );
}
