import { Question } from "@/data/questions";
import { motion } from "framer-motion";

type QuestionDisplayProps = {
  question: Question;
  isVisible: boolean;
  onAnswer: (isCorrect: boolean) => void;
  onQuestionAnswered?: () => void;
};

export default function QuestionDisplay({
  question,
  isVisible,
  onAnswer,
}: QuestionDisplayProps) {
  if (!isVisible) return null;

  const handleAnswer = (isCorrect: boolean) => {
    onAnswer(isCorrect);
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-col gap-4 items-center p-6 bg-white rounded-lg shadow-lg"
    >
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
          onClick={() => handleAnswer(true)}
          className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600"
        >
          OK
        </button>
        <button
          onClick={() => handleAnswer(false)}
          className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600"
        >
          NUL
        </button>
      </div>
    </motion.div>
  );
}
