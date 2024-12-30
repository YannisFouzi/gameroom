import { questions } from "@/data/questions";
import { Theme } from "@/types/wheel";
import { motion } from "framer-motion";
import DifficultyButtons from "./DifficultyButtons";
import QuestionDisplay from "./QuestionDisplay";

type PlayerWheelProps = {
  isCurrentTeam: boolean;
  onSpinWheel: () => void;
  selectedTheme: Theme | null;
  subCategory: string | null;
  isSpinning: boolean;
  onSelectDifficulty: (difficulty: 1 | 3 | 5 | 8) => void;
  onAnswerQuestion: (isCorrect: boolean) => void;
  showQuestion: boolean;
  selectedDifficulty: 1 | 3 | 5 | 8 | null;
};

export default function PlayerWheel({
  isCurrentTeam,
  onSpinWheel,
  selectedTheme,
  subCategory,
  isSpinning,
  onSelectDifficulty,
  onAnswerQuestion,
  showQuestion,
  selectedDifficulty,
}: PlayerWheelProps) {
  if (!isCurrentTeam && !subCategory) {
    return (
      <div className="text-center p-8">
        <p className="text-xl">En attente du tour de l'autre équipe...</p>
      </div>
    );
  }

  // Récupérer les questions pour la catégorie actuelle
  const currentQuestions =
    selectedTheme && subCategory ? questions[selectedTheme][subCategory] : null;
  const selectedQuestion = currentQuestions?.find(
    (q) => q.difficulty === selectedDifficulty
  );

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-col items-center justify-center p-8"
    >
      {isCurrentTeam ? (
        // Vue de l'équipe qui joue
        <>
          <h2 className="text-2xl font-bold mb-6">C'est votre tour !</h2>
          {!selectedTheme ? (
            <button
              onClick={onSpinWheel}
              disabled={isSpinning}
              className="bg-blue-600 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {isSpinning ? "La roue tourne..." : "Tourner la roue"}
            </button>
          ) : (
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Votre catégorie :</h3>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-2xl font-bold text-blue-800">
                  {selectedTheme} - {subCategory}
                </p>
              </div>
            </div>
          )}
        </>
      ) : (
        // Vue de l'équipe qui pose les questions
        <>
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">Catégorie à poser :</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-blue-800">
                {selectedTheme} - {subCategory}
              </p>
            </div>
          </div>

          {currentQuestions && !showQuestion && (
            <DifficultyButtons
              questions={currentQuestions}
              onSelectDifficulty={onSelectDifficulty}
              isVisible={!selectedDifficulty}
            />
          )}

          {selectedQuestion && (
            <QuestionDisplay
              question={selectedQuestion}
              isVisible={showQuestion}
              onAnswer={onAnswerQuestion}
            />
          )}
        </>
      )}
    </motion.div>
  );
}
