import { MillionaireQuestion } from "@/types/millionaire";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Jokers from "./Jokers";

type QuestionDisplayProps = {
  question: MillionaireQuestion;
  onAnswer: (answerIndex: number) => void;
  onNextQuestion: () => void;
  onQuit: () => void;
  onQuitWithPoints: () => void;
  currentPoints: number;
  isHost: boolean;
  isCurrentTeam: boolean;
  questionIndex: number;
  jokers: {
    phoneCall: boolean;
    fiftyFifty: boolean;
  };
  onUsePhoneCall: () => void;
  onUseFiftyFifty: () => void;
};

type AnswerState = "selected" | "correct" | "incorrect" | null;

export default function QuestionDisplay({
  question,
  onAnswer,
  onNextQuestion,
  onQuit,
  onQuitWithPoints,
  currentPoints,
  isHost,
  isCurrentTeam,
  questionIndex,
  jokers,
  onUsePhoneCall,
  onUseFiftyFifty,
}: QuestionDisplayProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>(null);
  const [showValidateButton, setShowValidateButton] = useState(false);
  const [hiddenAnswers, setHiddenAnswers] = useState<number[]>([]);

  useEffect(() => {
    setSelectedAnswer(null);
    setAnswerState(null);
    setShowValidateButton(false);
  }, [questionIndex]);

  const handleAnswerClick = (index: number) => {
    if (
      !isHost &&
      isCurrentTeam &&
      answerState !== "correct" &&
      answerState !== "incorrect"
    ) {
      setSelectedAnswer(index);
      setShowValidateButton(true);
      setAnswerState("selected");
    }
  };

  const handleValidate = () => {
    const isCorrect = selectedAnswer === question.correctAnswer;
    setAnswerState(isCorrect ? "correct" : "incorrect");
    setShowValidateButton(false);
  };

  const handleQuit = () => {
    onAnswer(selectedAnswer!);
    onQuit();
  };

  const getAnswerStyle = (index: number) => {
    if (answerState === "selected" && index === selectedAnswer) {
      return "bg-orange-100";
    }
    if (answerState === "correct" && index === selectedAnswer) {
      return "bg-green-100";
    }
    if (answerState === "incorrect") {
      if (index === selectedAnswer) return "bg-red-100";
      if (index === question.correctAnswer) return "bg-green-100";
    }
    if (isHost || !isCurrentTeam) return "bg-gray-50 cursor-default";
    return selectedAnswer === null
      ? "bg-blue-50 hover:bg-blue-100"
      : "bg-gray-50";
  };

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
      <Jokers
        jokers={jokers}
        onUsePhoneCall={onUsePhoneCall}
        onUseFiftyFifty={() => {
          const wrongAnswers = question.answers
            .map((_, index) => index)
            .filter((index) => index !== question.correctAnswer);

          // Mélanger et prendre 2 réponses fausses aléatoirement
          const shuffled = wrongAnswers.sort(() => Math.random() - 0.5);
          setHiddenAnswers(shuffled.slice(0, 2));
          onUseFiftyFifty();
        }}
        disabled={!isCurrentTeam || isHost}
      />

      <div className="mb-6">
        <div className="text-xl font-bold mb-2">{question.text}</div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {question.answers.map((answer, index) =>
          hiddenAnswers.includes(index) ? null : (
            <motion.button
              key={index}
              onClick={() => handleAnswerClick(index)}
              disabled={
                isHost ||
                !isCurrentTeam ||
                answerState === "correct" ||
                answerState === "incorrect"
              }
              whileHover={{ scale: isHost || !isCurrentTeam ? 1 : 1.02 }}
              whileTap={{ scale: isHost || !isCurrentTeam ? 1 : 0.98 }}
              className={`p-4 rounded-lg text-left transition-colors ${getAnswerStyle(
                index
              )}`}
            >
              <span className="font-medium">
                {String.fromCharCode(65 + index)}. {answer}
              </span>
            </motion.button>
          )
        )}
      </div>

      {showValidateButton && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleValidate}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700"
        >
          Valider
        </motion.button>
      )}

      {answerState === "correct" && (
        <div className="space-y-4">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onNextQuestion}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700"
          >
            Question suivante
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onQuitWithPoints}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700"
          >
            Quitter avec {currentPoints} points
          </motion.button>
        </div>
      )}

      {answerState === "incorrect" && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleQuit}
          className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700"
        >
          Quitter
        </motion.button>
      )}
    </div>
  );
}
