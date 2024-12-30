import { Question } from "@/data/questions";

type QuestionDisplayProps = {
  question: Question;
  isVisible: boolean;
  onAnswer: (isCorrect: boolean) => void;
};

export default function QuestionDisplay({
  question,
  isVisible,
  onAnswer,
}: QuestionDisplayProps) {
  if (!isVisible) return null;

  return (
    <div className="flex flex-col gap-4 items-center p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold mb-2">
          Question ({question.difficulty} points)
        </h3>
        <p className="text-lg">{question.text}</p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-4 w-full">
        <p className="font-semibold">Réponse :</p>
        <p>{question.answer}</p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => onAnswer(true)}
          className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600"
        >
          OK
        </button>
        <button
          onClick={() => onAnswer(false)}
          className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600"
        >
          NUL
        </button>
      </div>
    </div>
  );
}
