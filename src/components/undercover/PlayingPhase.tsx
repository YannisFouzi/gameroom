import { undercoverService } from "@/lib/firebase/services/undercoverService";
import { Team } from "@/types/room";
import { UndercoverGameData } from "@/types/undercover";
import { motion } from "framer-motion";

type PlayingPhaseProps = {
  gameData: UndercoverGameData;
  isHost: boolean;
  currentTeam: Team | null;
  teamId: string | null;
  roomId: string;
};

export default function PlayingPhase({
  gameData,
  isHost,
  currentTeam,
  teamId,
  roomId,
}: PlayingPhaseProps) {
  const handleTeamReady = async () => {
    if (!teamId) return;
    await undercoverService.teamReady(roomId, teamId);
  };

  const isTeamReady = teamId && gameData.teamsReady.includes(teamId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ordre de passage
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Chaque joueur doit donner un mot qui décrit son mot secret
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20"
        >
          <div className="space-y-4">
            {gameData.playOrder.map((playerId, index) => {
              const player = gameData.players.find(
                (p) => p.memberId === playerId
              );
              if (!player) return null;

              return (
                <motion.div
                  key={playerId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-white/5"
                >
                  <span className="text-xl font-bold text-white/80">
                    {index + 1}
                  </span>
                  <div>
                    <span className="text-lg font-medium text-white">
                      {player.name}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {!isHost && !isTeamReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-8"
          >
            <button
              onClick={handleTeamReady}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-bold text-lg hover:opacity-90 transition-all"
            >
              Passer aux votes
            </button>
          </motion.div>
        )}

        {isTeamReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-8 text-white/80"
          >
            En attente des autres équipes...
          </motion.div>
        )}
      </div>
    </div>
  );
}
