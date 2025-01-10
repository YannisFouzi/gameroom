import { Question } from "@/data/questions";
import { motion } from "framer-motion";

type QuestionDisplayProps = {
  question: Question;
  isVisible: boolean;
  onAnswer: (isCorrect: boolean) => void;
  isVraiButtonVisible: boolean;
};

export default function QuestionDisplay({
  question,
  isVisible,
  onAnswer,
  isVraiButtonVisible,
}: QuestionDisplayProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-col gap-4 items-center p-6 bg-white rounded-lg shadow-lg"
    >
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold mb-2 text-gray-900">
          Question ({question.difficulty} points)
        </h3>
        <p className="text-lg text-gray-900">{question.text}</p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-4 w-full">
        <p className="font-semibold text-gray-900">Réponse :</p>
        <p className="text-gray-900">{question.answer}</p>
      </div>

      <div className="flex gap-4">
        {isVraiButtonVisible && (
          <button
            onClick={() => onAnswer(true)}
            className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600"
          >
            VRAI
          </button>
        )}
        <button
          onClick={() => onAnswer(false)}
          className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600"
        >
          FAUX
        </button>
      </div>
    </motion.div>
  );
}
