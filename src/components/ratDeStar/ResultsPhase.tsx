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
  const currentTeam = teamId ? teams[teamId] : null;

  if (!isHost) {
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
            {teamId === remainingTeams[0] ? (
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
                Game Over ! L'équipe {teams[remainingTeams[0]]?.name} a gagné !
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

  return (
    <div className="h-screen flex flex-col p-2">
      <div className="text-center space-y-2 mb-2">
        <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 p-2 rounded-lg">
          <img
            src={teams[remainingTeams[0]]?.avatar}
            alt="Winner"
            className="w-8 h-8 rounded-full"
          />
          <div className="text-white font-bold">
            🏆 L'équipe {teams[remainingTeams[0]]?.name} remporte la partie !
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-1 auto-rows-fr">
        {Object.entries(celebrities).map(([id, celebrity]) => (
          <div key={id} className="flex flex-col items-center p-0.5">
            <div
              className={`relative w-full h-full flex-1 ${
                celebrity.foundBy
                  ? "ring-2 ring-green-500 rounded-lg overflow-hidden"
                  : ""
              }`}
            >
              <img
                src={celebrity.imageUrl}
                alt={celebrity.name}
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
            {celebrity.foundBy && (
              <div className="text-xs font-medium text-green-500 truncate w-full text-center mt-1">
                {teams[celebrity.foundBy]?.name}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-2 text-center">
        <button
          onClick={onNextGame}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-6 rounded-xl font-bold text-lg hover:opacity-90 transition-all"
        >
          Jeu suivant →
        </button>
      </div>
    </div>
  );
}
