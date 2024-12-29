import { MillionaireQuestion } from "@/types/millionaire";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type QuestionDisplayProps = {
  question: MillionaireQuestion;
  onAnswer: (answerIndex: number) => void;
  isHost: boolean;
  isCurrentTeam: boolean;
  questionIndex: number;
};

export default function QuestionDisplay({
  question,
  onAnswer,
  isHost,
  isCurrentTeam,
  questionIndex,
}: QuestionDisplayProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  useEffect(() => {
    setSelectedAnswer(null);
  }, [questionIndex]);

  if (!isHost && !isCurrentTeam) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-600">
          En attente de la réponse de l'équipe active...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="text-xl font-bold mb-2">{question.text}</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {question.answers.map((answer, index) => (
          <motion.button
            key={index}
            onClick={() => {
              if (!isHost && isCurrentTeam) {
                setSelectedAnswer(index);
                onAnswer(index);
              }
            }}
            disabled={selectedAnswer !== null || isHost || !isCurrentTeam}
            whileHover={{ scale: isHost || !isCurrentTeam ? 1 : 1.02 }}
            whileTap={{ scale: isHost || !isCurrentTeam ? 1 : 0.98 }}
            className={`p-4 rounded-lg text-left ${
              isHost || !isCurrentTeam
                ? "bg-gray-50 cursor-default"
                : selectedAnswer === null
                ? "bg-blue-50 hover:bg-blue-100"
                : selectedAnswer === index
                ? "bg-yellow-100"
                : "bg-gray-50"
            }`}
          >
            <span className="font-medium">
              {String.fromCharCode(65 + index)}. {answer}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
