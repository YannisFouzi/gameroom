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

              const isEliminated = player.isEliminated;

              return (
                <motion.div
                  key={playerId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-4 p-3 rounded-lg ${
                    isEliminated ? "bg-white/5" : "bg-white/10"
                  }`}
                >
                  {!isEliminated && (
                    <span className="text-xl font-bold text-white/80">
                      {index + 1}
                    </span>
                  )}
                  <div className="flex-1">
                    <span
                      className={`text-3xl font-medium ${
                        isEliminated ? "text-white/50" : "text-white"
                      }`}
                    >
                      {player.name}
                      {isEliminated && ` (Éliminé : ${player.role})`}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {gameData.eliminatedPlayers?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/20 backdrop-blur-sm p-6 rounded-xl border border-red-500/30"
          >
            <h3 className="text-xl font-bold text-white mb-4">
              Éliminés ce tour
            </h3>
            <div className="space-y-2">
              {gameData.eliminatedPlayers.map((eliminatedPlayer) => (
                <div
                  key={eliminatedPlayer.memberId}
                  className="flex items-center justify-between p-2 rounded bg-white/5"
                >
                  <span className="text-white/80">{eliminatedPlayer.name}</span>
                  <span className="text-red-400">{eliminatedPlayer.role}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

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
