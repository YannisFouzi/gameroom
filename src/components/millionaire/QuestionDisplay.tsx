import { JokerType, MillionaireQuestion } from "@/types/millionaire";
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
    doubleAnswer: boolean;
  };
  onUsePhoneCall: () => void;
  onUseFiftyFifty: () => void;
  onUseDoubleAnswer: () => void;
  selectedAnswer: number | null;
  answerState: "selected" | "correct" | "incorrect" | null;
  selectedAnswers: number[];
  onUpdateAnswerState: (
    selectedAnswer: number | null,
    answerState: "selected" | "correct" | "incorrect" | null,
    selectedAnswers: number[]
  ) => void;
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
  onUseDoubleAnswer,
  selectedAnswer,
  answerState,
  selectedAnswers,
  onUpdateAnswerState,
}: QuestionDisplayProps) {
  const [showValidateButton, setShowValidateButton] = useState(false);
  const [hiddenAnswers, setHiddenAnswers] = useState<number[]>([]);
  const [isDoubleAnswerActive, setIsDoubleAnswerActive] = useState(false);
  const [usedJokersForQuestion, setUsedJokersForQuestion] = useState<
    JokerType[]
  >([]);

  useEffect(() => {
    setShowValidateButton(false);
    setHiddenAnswers([]);
    setIsDoubleAnswerActive(false);
    setUsedJokersForQuestion([]);
  }, [questionIndex]);

  useEffect(() => {
    if (
      answerState === "selected" &&
      (selectedAnswer !== null || selectedAnswers.length > 0)
    ) {
      setShowValidateButton(true);
    } else {
      setShowValidateButton(false);
    }
  }, [answerState, selectedAnswer, selectedAnswers]);

  const handleAnswerClick = (index: number) => {
    console.log("Click on answer", index); // Debug

    if (
      !isHost &&
      isCurrentTeam &&
      answerState !== "correct" &&
      answerState !== "incorrect"
    ) {
      if (isDoubleAnswerActive) {
        // Gérer la sélection multiple
        if (selectedAnswers.includes(index)) {
          // Si la réponse est déjà sélectionnée, on la retire
          const newSelectedAnswers = selectedAnswers.filter((i) => i !== index);
          onUpdateAnswerState(null, "selected", newSelectedAnswers);
        } else {
          // Si on a déjà 2 réponses sélectionnées
          if (selectedAnswers.length === 2) {
            // On retire la première réponse (la plus ancienne) et on ajoute la nouvelle
            const newSelectedAnswers = [selectedAnswers[1], index];
            onUpdateAnswerState(null, "selected", newSelectedAnswers);
          } else {
            // Sinon on ajoute simplement la nouvelle réponse
            const newSelectedAnswers = [...selectedAnswers, index];
            onUpdateAnswerState(null, "selected", newSelectedAnswers);
          }
        }
        setShowValidateButton(selectedAnswers.length > 0);
      } else {
        console.log("Updating answer state", index); // Debug
        onUpdateAnswerState(index, "selected", []);
        setShowValidateButton(true);
      }
    }
  };

  const handleValidate = () => {
    if (!isDoubleAnswerActive) {
      // Logique normale
      const isCorrect = selectedAnswer === question.correctAnswer;
      onUpdateAnswerState(
        selectedAnswer,
        isCorrect ? "correct" : "incorrect",
        selectedAnswers
      );
    } else {
      // Logique pour le joker double réponse
      const hasCorrectAnswer = selectedAnswers.includes(question.correctAnswer);
      onUpdateAnswerState(
        null,
        hasCorrectAnswer ? "correct" : "incorrect",
        selectedAnswers
      );
    }
  };

  const handleQuit = () => {
    if (isDoubleAnswerActive) {
      onAnswer(selectedAnswers[0]);
    } else {
      onAnswer(selectedAnswer!);
    }
    onQuit();
  };

  const getAnswerStyle = (index: number) => {
    console.log("getAnswerStyle", {
      index,
      selectedAnswer,
      answerState,
      isDoubleAnswerActive,
    });

    // Si le joker Double réponse est actif
    if (isDoubleAnswerActive) {
      if (answerState === "correct" || answerState === "incorrect") {
        if (index === question.correctAnswer) {
          return "bg-green-100 text-black";
        }
        if (selectedAnswers.includes(index)) {
          return index === question.correctAnswer
            ? "bg-green-100 text-black"
            : "bg-red-100 text-black";
        }
        return "bg-gray-50 text-black";
      }

      if (selectedAnswers.includes(index)) {
        return "bg-orange-100 text-black";
      }
      return "bg-blue-50 hover:bg-blue-100 text-black";
    }

    // Comportement normal
    if (answerState === "selected" && index === selectedAnswer) {
      return "bg-orange-100 text-black";
    }
    if (answerState === "correct" && index === selectedAnswer) {
      return "bg-green-100 text-black";
    }
    if (answerState === "incorrect") {
      if (index === selectedAnswer) return "bg-red-100 text-black";
      if (index === question.correctAnswer) return "bg-green-100 text-black";
    }
    if (isHost || !isCurrentTeam) return "bg-gray-50 text-black cursor-default";
    return selectedAnswer === null
      ? "bg-blue-50 hover:bg-blue-100 text-black"
      : "bg-gray-50 text-black";
  };

  const handleUseFiftyFifty = () => {
    const wrongAnswers = question.answers
      .map((_, index) => index)
      .filter((index) => index !== question.correctAnswer);

    const shuffled = wrongAnswers.sort(() => Math.random() - 0.5);
    setHiddenAnswers(shuffled.slice(0, 2));
    onUseFiftyFifty();
  };

  const handleUseDoubleAnswer = () => {
    setIsDoubleAnswerActive(true);
    onUseDoubleAnswer();
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
      {isDoubleAnswerActive && (
        <div className="mb-4 text-center text-sm text-gray-600">
          Sélectionnez jusqu'à 2 réponses ({2 - selectedAnswers.length} restante
          {2 - selectedAnswers.length > 1 ? "s" : ""})
        </div>
      )}

      <Jokers
        jokers={jokers}
        onUsePhoneCall={onUsePhoneCall}
        onUseFiftyFifty={handleUseFiftyFifty}
        onUseDoubleAnswer={handleUseDoubleAnswer}
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

      {showValidateButton && !isHost && isCurrentTeam && (
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
