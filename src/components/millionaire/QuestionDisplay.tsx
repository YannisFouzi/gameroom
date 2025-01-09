import { useAudio } from "@/hooks/useAudio";
import { JokerType, MillionaireQuestion } from "@/types/millionaire";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Jokers from "./Jokers";

type QuestionDisplayProps = {
  question: MillionaireQuestion;
  onAnswer: (answerIndex: number) => void;
  onNextQuestion: (nextIndex: number) => void;
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
  phoneCallModalOpen: boolean;
  onPhoneCallModalChange: (isOpen: boolean) => void;
  hiddenAnswers: number[];
  onSetHiddenAnswers: (answers: number[]) => void;
  doubleAnswerActive: boolean;
  onSetDoubleAnswerActive: (isActive: boolean) => void;
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
  phoneCallModalOpen,
  onPhoneCallModalChange,
  hiddenAnswers,
  onSetHiddenAnswers,
  doubleAnswerActive,
  onSetDoubleAnswerActive,
}: QuestionDisplayProps) {
  const [showValidateButton, setShowValidateButton] = useState(false);
  const [usedJokersForQuestion, setUsedJokersForQuestion] = useState<
    JokerType[]
  >([]);
  const { play: playCorrect } = useAudio(
    "/sound/millionnaire/sounds_correct.mp3"
  );

  useEffect(() => {
    setShowValidateButton(false);
    onSetHiddenAnswers([]);
    onSetDoubleAnswerActive(false);
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
      if (doubleAnswerActive) {
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
    if (!doubleAnswerActive) {
      // Logique normale
      const isCorrect = selectedAnswer === question.correctAnswer;
      onUpdateAnswerState(
        selectedAnswer,
        isCorrect ? "correct" : "incorrect",
        selectedAnswers
      );
      // Jouer le son si la réponse est correcte
      if (isCorrect) {
        playCorrect();
      }
    } else {
      // Logique pour le joker double réponse
      const hasCorrectAnswer = selectedAnswers.includes(question.correctAnswer);
      onUpdateAnswerState(
        null,
        hasCorrectAnswer ? "correct" : "incorrect",
        selectedAnswers
      );
      // Jouer le son si la réponse est correcte
      if (hasCorrectAnswer) {
        playCorrect();
      }
    }
  };

  const handleQuit = () => {
    if (doubleAnswerActive) {
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
      doubleAnswerActive,
    });

    // Si le joker Double réponse est actif
    if (doubleAnswerActive) {
      if (answerState === "correct" || answerState === "incorrect") {
        if (index === question.correctAnswer) {
          return "bg-green-500 text-white";
        }
        if (selectedAnswers.includes(index)) {
          return index === question.correctAnswer
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white";
        }
        return "bg-gray-50 text-black";
      }

      if (selectedAnswers.includes(index)) {
        return "bg-orange-500 text-white";
      }
      return "bg-blue-50 hover:bg-blue-100 text-black";
    }

    // Comportement normal
    if (answerState === "selected" && index === selectedAnswer) {
      return "bg-orange-500 text-white";
    }
    if (answerState === "correct" && index === selectedAnswer) {
      return "bg-green-500 text-white";
    }
    if (answerState === "incorrect") {
      if (index === selectedAnswer) return "bg-red-500 text-white";
      if (index === question.correctAnswer) return "bg-green-500 text-white";
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
    onSetHiddenAnswers(shuffled.slice(0, 2));
    onUseFiftyFifty();
  };

  const handleUseDoubleAnswer = () => {
    onSetDoubleAnswerActive(true);
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
      {doubleAnswerActive && !isHost && isCurrentTeam && (
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
        isHost={isHost}
        phoneCallModalOpen={phoneCallModalOpen}
        onPhoneCallModalChange={onPhoneCallModalChange}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-6 p-6 rounded-xl overflow-hidden min-h-[120px] flex items-center justify-center w-full max-w-5xl mx-auto"
      >
        {/* Background animé */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700">
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 3,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        </div>

        {/* Contenu de la question */}
        <div className="relative text-center w-full">
          <p className="text-2xl text-white/90">{question.text}</p>
        </div>
      </motion.div>

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
              className={`p-6 rounded-xl flex items-center justify-center transition-all duration-200 border-2 shadow-lg ${
                // Double réponse - Affichage des résultats
                doubleAnswerActive &&
                (answerState === "correct" || answerState === "incorrect")
                  ? selectedAnswers.includes(index)
                    ? index === question.correctAnswer
                      ? "bg-gradient-to-br from-emerald-500 to-green-600 border-emerald-400 text-white" // Bonne réponse sélectionnée
                      : "bg-gradient-to-br from-rose-500 to-red-600 border-rose-400 text-white" // Mauvaise réponse sélectionnée
                    : "bg-white/80 border-gray-200" // Réponses non sélectionnées
                  : // État sélectionné normal (pendant la sélection)
                  (answerState === "selected" && index === selectedAnswer) ||
                    (doubleAnswerActive && selectedAnswers.includes(index))
                  ? "bg-gradient-to-br from-orange-500 to-orange-600 border-orange-400 text-white"
                  : // État correct
                  answerState === "correct" && index === selectedAnswer
                  ? "bg-gradient-to-br from-emerald-500 to-green-600 border-emerald-400 text-white"
                  : // État incorrect
                  answerState === "incorrect"
                  ? index === selectedAnswer
                    ? "bg-gradient-to-br from-rose-500 to-red-600 border-rose-400 text-white"
                    : index === question.correctAnswer
                    ? "bg-gradient-to-br from-emerald-500 to-green-600 border-emerald-400 text-white"
                    : "bg-white/80 border-gray-200"
                  : // État normal - même style pour tous
                    "bg-gradient-to-br from-blue-500 to-blue-600 border-blue-400 text-white"
              }`}
            >
              <span className="font-medium text-lg">
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

      {answerState === "correct" && !isHost && (
        <div className="space-y-4">
          {questionIndex === 14 ? (
            // Si c'est la dernière question (15ème)
            <button
              onClick={onQuitWithPoints}
              className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600"
            >
              🏆 Victoire : quitter avec {currentPoints} points
            </button>
          ) : (
            // Pour toutes les autres questions
            <>
              <button
                onClick={() => onNextQuestion(questionIndex + 1)}
                className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600"
              >
                Question suivante
              </button>
              <button
                onClick={onQuitWithPoints}
                className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600"
              >
                Quitter avec {currentPoints} points
              </button>
            </>
          )}
        </div>
      )}

      {answerState === "incorrect" && !isHost && (
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
