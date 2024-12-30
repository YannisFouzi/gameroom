import { Question } from "@/data/questions";

type DifficultyButtonsProps = {
  onSelectDifficulty: (difficulty: 1 | 3 | 5 | 8) => void;
  questions: Question[];
  isVisible: boolean;
};

export default function DifficultyButtons({
  onSelectDifficulty,
  questions,
  isVisible,
}: DifficultyButtonsProps) {
  if (!isVisible) return null;

  return (
    <div className="flex flex-col gap-4 items-center">
      <h3 className="text-xl font-semibold mb-2">Choisissez la difficulté :</h3>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onSelectDifficulty(1)}
          className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600"
        >
          1 point
        </button>
        <button
          onClick={() => onSelectDifficulty(3)}
          className="bg-yellow-500 text-white py-3 px-6 rounded-lg hover:bg-yellow-600"
        >
          3 points
        </button>
        <button
          onClick={() => onSelectDifficulty(5)}
          className="bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600"
        >
          5 points
        </button>
        <button
          onClick={() => onSelectDifficulty(8)}
          className="bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600"
        >
          8 points
        </button>
      </div>
    </div>
  );
}
