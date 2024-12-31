import { Question } from "@/data/questions";

type DifficultyButtonsProps = {
  onSelectDifficulty: (difficulty: 2 | 4 | 7 | 10) => void;
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
      <h3 className="text-xl font-semibold mb-2">
        Dire à l'équipe adverse quelle difficulté elle veut :
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onSelectDifficulty(2)}
          className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600"
        >
          2
        </button>
        <button
          onClick={() => onSelectDifficulty(4)}
          className="bg-yellow-500 text-white py-3 px-6 rounded-lg hover:bg-yellow-600"
        >
          4
        </button>
        <button
          onClick={() => onSelectDifficulty(7)}
          className="bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600"
        >
          7
        </button>
        <button
          onClick={() => onSelectDifficulty(10)}
          className="bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600"
        >
          10
        </button>
      </div>
    </div>
  );
}
