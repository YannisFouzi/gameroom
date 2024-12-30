import { Celebrity, Team } from "@/types/room";
import { motion } from "framer-motion";

type ResultsPhaseProps = {
  celebrities: Record<string, Celebrity>;
  teams: Record<string, Team>;
  remainingTeams: string[];
  isHost: boolean;
  onNextGame: () => void;
  teamId: string | null;
};

export function ResultsPhase({
  celebrities,
  teams,
  remainingTeams,
  isHost,
  onNextGame,
  teamId,
}: ResultsPhaseProps) {
  const winningTeam = teams[remainingTeams[0]];
  const currentTeam = teamId ? teams[teamId] : null;
  const isWinner = teamId === remainingTeams[0];

  if (isHost) {
    return (
      <div className="container mx-auto p-4">
        <div className="mb-12 text-center">
          <div className="inline-block bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-white mb-4">
              🏆 Équipe Gagnante 🏆
            </h2>
            <div className="flex items-center justify-center gap-4">
              <img
                src={winningTeam.avatar}
                alt={winningTeam.name}
                className="w-24 h-auto object-contain"
              />
              <div>
                <div className="text-2xl font-bold text-white">
                  {winningTeam.name}
                </div>
                <div className="text-lg text-yellow-100">
                  {winningTeam.members.map((member) => member.name).join(", ")}
                </div>
              </div>
            </div>
            <div className="mt-4 text-lg text-yellow-100">
              Cette équipe commencera le prochain jeu en premier !
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Object.entries(celebrities).map(([id, celebrity]) => (
            <div key={id} className="flex flex-col items-center space-y-2">
              <div className="flex items-center justify-center">
                <img
                  src={celebrity.imageUrl}
                  alt={celebrity.name}
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: "200px" }}
                />
              </div>
              {celebrity.foundBy && (
                <div className="text-lg font-medium text-green-500">
                  Trouvé par {teams[celebrity.foundBy]?.name}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={onNextGame}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-xl font-bold text-xl shadow-lg hover:opacity-90 transition-all"
          >
            Passer au jeu suivant →
          </button>
        </div>
      </div>
    );
  }

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
          {isWinner ? (
            <>
              <h2 className="text-3xl font-bold text-white mb-4">
                🏆 Félicitations ! Vous avez gagné ! 🏆
              </h2>
              <p className="text-xl text-white/80">
                Vous commencerez le prochain jeu en premier ! 🎲
              </p>
            </>
          ) : (
            <h2 className="text-3xl font-bold text-white">
              Game Over ! L'équipe {winningTeam.name} a gagné !
            </h2>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <h3 className="text-2xl font-bold text-white">
            Vos célébrités trouvées :
          </h3>
          <div className="space-y-2">
            {Object.values(celebrities)
              .filter((celebrity) => celebrity.foundBy === teamId)
              .map((celebrity) => (
                <div
                  key={celebrity.id}
                  className="text-xl text-white/80 font-medium"
                >
                  {celebrity.name}
                </div>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
