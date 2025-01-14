import { questions } from "@/data/questions";
import { Team } from "@/types/room";
import { Theme, WheelState } from "@/types/wheel";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import DifficultyButtons from "./DifficultyButtons";
import QuestionDisplay from "./QuestionDisplay";
import Timer from "./Timer";

type PlayerWheelProps = {
  isCurrentTeam: boolean;
  onSpinWheel: () => void;
  selectedTheme: Theme | null;
  subCategory: string | null;
  isSpinning: boolean;
  onSelectDifficulty: (difficulty: 2 | 4 | 7 | 10) => void;
  onAnswerQuestion: (isCorrect: boolean) => void;
  showQuestion: boolean;
  selectedDifficulty: 2 | 4 | 7 | 10 | null;
  questionAnswered: boolean;
  currentTeam: Team | null;
  scores: Record<string, number>;
  teams: Record<string, Team>;
  isTimerActive: boolean;
  onTimeUp: () => void;
  onStartTimer: () => void;
  onHideVraiButton: () => void;
  wheelState: WheelState | null;
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
  questionAnswered,
  currentTeam,
  scores,
  teams,
  isTimerActive,
  onTimeUp,
  onStartTimer,
  onHideVraiButton,
  wheelState,
}: PlayerWheelProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isCurrentTeam && selectedDifficulty) {
      const audio = new Audio(`/sound/wheel/${selectedDifficulty}.mp3`);
      audioRef.current = audio;
      audio.play();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [selectedDifficulty, isCurrentTeam]);

  if (!isCurrentTeam && !subCategory) {
    return (
      <div className="flex flex-col items-center space-y-8 p-8">
        {currentTeam && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <motion.div
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <img
                src={currentTeam.avatar}
                alt={currentTeam.name}
                className="w-24 h-24 mx-auto"
              />
            </motion.div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-white">
                {currentTeam.name}
              </h1>
              <div className="space-y-2">
                {currentTeam.members.map((member, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-xl text-white/80"
                  >
                    {member.name}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <p className="text-xl text-white/80">
          En attente du tour de l'autre équipe...
        </p>
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
        <>
          {currentTeam && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-8 mb-12"
            >
              <motion.div
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <img
                  src={currentTeam.avatar}
                  alt={currentTeam.name}
                  className="w-24 h-24 mx-auto"
                />
              </motion.div>

              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-white">
                  {currentTeam.name}
                </h1>
                <div className="space-y-2">
                  {currentTeam.members.map((member, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-xl text-white/80"
                    >
                      {member.name}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <h2 className="text-2xl font-bold mb-6 text-white">
            C'est votre tour !
          </h2>
          {!selectedTheme ? (
            <button
              onClick={onSpinWheel}
              disabled={isSpinning}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-xl text-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50"
            >
              {isSpinning ? "La roue tourne..." : "Tourner la roue"}
            </button>
          ) : (
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 text-white">
                Votre catégorie :
              </h3>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                <p className="text-2xl font-bold text-white">
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
            <h3 className="text-xl font-semibold mb-2 text-white">
              Catégorie :
            </h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-blue-800">
                {selectedTheme} - {subCategory}
              </p>
            </div>
          </div>

          {currentQuestions && !showQuestion && !questionAnswered && (
            <DifficultyButtons
              questions={currentQuestions}
              onSelectDifficulty={onSelectDifficulty}
              isVisible={!selectedDifficulty}
              onStartTimer={onStartTimer}
            />
          )}

          {selectedQuestion && (
            <QuestionDisplay
              question={selectedQuestion}
              isVisible={showQuestion}
              onAnswer={onAnswerQuestion}
              isVraiButtonVisible={wheelState?.isVraiButtonVisible ?? true}
            />
          )}
        </>
      )}

      {selectedDifficulty && (
        <Timer
          duration={40}
          onTimeUp={onHideVraiButton}
          isActive={isTimerActive}
        />
      )}
    </motion.div>
  );
}
