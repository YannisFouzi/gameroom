import { undercoverService } from "@/lib/firebase/services/undercoverService";
import { Team } from "@/types/room";
import { UndercoverGameData } from "@/types/undercover";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type ResultsPhaseProps = {
  gameData: UndercoverGameData;
  isHost: boolean;
  currentTeam: Team | null;
  teamId: string | null;
  roomId: string;
};

export default function ResultsPhase({
  gameData,
  isHost,
  teamId,
  roomId,
}: ResultsPhaseProps) {
  const [isGameOver, setIsGameOver] = useState(false);
  const isTeamReady = teamId && gameData.teamsReady.includes(teamId);

  const teamColors: Record<string, string> = {};
  let colorIndex = 0;

  const getTeamBackgroundColor = (player: any) => {
    if (teamColors[player.teamId]) {
      return teamColors[player.teamId];
    }

    const colors = [
      "bg-blue-900/30",
      "bg-red-900/30",
      "bg-green-900/30",
      "bg-purple-900/30",
    ];

    teamColors[player.teamId] = colors[colorIndex % colors.length];
    colorIndex++;

    return teamColors[player.teamId] || "bg-white/10";
  };

  useEffect(() => {
    const checkGameEnd = async () => {
      const gameOver = await undercoverService.checkGameEnd(roomId);
      setIsGameOver(gameOver);
    };
    checkGameEnd();
  }, [roomId]);

  const handleTeamReady = async () => {
    if (!teamId) return;
    await undercoverService.teamReady(roomId, teamId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {gameData.lastEliminatedPlayers?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 backdrop-blur-sm p-4 rounded-xl border border-red-500/30"
          >
            <h3 className="text-xl font-bold text-white mb-2 text-center">
              {gameData.lastEliminatedPlayers.length > 1
                ? "Joueurs éliminés :"
                : "Joueur éliminé :"}
            </h3>
            <div className="flex justify-center gap-6">
              {gameData.lastEliminatedPlayers.map((player) => (
                <div key={player.memberId} className="text-center">
                  <div className="text-xl font-bold text-white mb-1">
                    {player.name}
                  </div>
                  <div className="text-base text-white/80">
                    Rôle : {player.role}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
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
          className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20"
        >
          <div className="space-y-2">
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
                    isEliminated ? "bg-white/5" : getTeamBackgroundColor(player)
                  }`}
                >
                  {!isEliminated && (
                    <span className="text-xl font-bold text-white/80">
                      {index + 1}
                    </span>
                  )}
                  <div className="flex-1">
                    <span
                      className={`text-1xl font-medium ${
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

        {!isHost && !isGameOver && (
          <>
            {!isTeamReady ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mt-8"
              >
                <button
                  onClick={handleTeamReady}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-bold text-lg"
                >
                  Passer aux votes
                </button>
              </motion.div>
            ) : (
              <div className="text-center mt-8 text-white/80">
                En attente des autres équipes...
              </div>
            )}
          </>
        )}

        {isGameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-8 text-white/80"
          >
            Partie terminée ! Les résultats s'afficheront dans un instant...
          </motion.div>
        )}
      </div>
    </div>
  );
}
