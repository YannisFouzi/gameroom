import { Room } from "@/types/room";
import { motion } from "framer-motion";
import { useState } from "react";

type GuessingPhaseProps = {
  isCurrentTeam: boolean;
  onSubmit: (guess: string) => Promise<boolean>;
  room: Room;
  teamId: string | null;
};

export function GuessingPhase({
  isCurrentTeam,
  onSubmit,
  room,
  teamId,
}: GuessingPhaseProps) {
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const currentTeam = teamId ? room.teams[teamId] : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim()) {
      try {
        const isCorrect = await onSubmit(guess);
        setFeedback({
          type: isCorrect ? "success" : "error",
          message: isCorrect
            ? "Bonne réponse ! Continuez !"
            : "Mauvaise réponse... Votre équipe est éliminée.",
        });
        setGuess("");

        setTimeout(() => {
          setFeedback(null);
        }, 3000);
      } catch (error) {
        console.error("Erreur lors de la soumission:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="max-w-md mx-auto text-center space-y-12">
        {currentTeam && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="space-y-4">
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

              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent">
                {currentTeam.name}
              </h1>
            </div>

            <div className="space-y-3">
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
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
        >
          {isCurrentTeam ? (
            <>
              <h2 className="text-3xl font-bold mb-6 text-white">
                C'est à vous !
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
                  placeholder="Nom de la célébrité"
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
                >
                  Valider
                </button>
              </form>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-4 rounded-lg text-center ${
                    feedback.type === "success"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-red-500/20 text-red-300"
                  }`}
                >
                  {feedback.message}
                </motion.div>
              )}
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-4 text-white">En attente</h2>
              <p className="text-xl text-white/80">
                L'équipe active est en train de jouer...
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
