import { undercoverService } from "@/lib/firebase/services/undercoverService";
import { Team } from "@/types/room";
import { UndercoverGameData } from "@/types/undercover";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
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
  currentTeam,
  teamId,
  roomId,
}: ResultsPhaseProps) {
  const [isGameOver, setIsGameOver] = useState(false);
  const isTeamReady = teamId && gameData.teamsReady.includes(teamId);
  const router = useRouter();

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

  const lastEliminated = gameData.lastEliminatedPlayers?.[0];

  const handleNextGame = async () => {
    if (gameData.isLastGame) {
      router.push(`/room/${roomId}/final-scores`);
    } else {
      await undercoverService.startNextRound(roomId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {gameData.lastEliminatedPlayers?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 backdrop-blur-sm p-6 rounded-xl border border-red-500/30"
          >
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              {gameData.lastEliminatedPlayers.length > 1
                ? "Joueurs éliminés :"
                : "Joueur éliminé :"}
            </h3>
            <div className="flex justify-center gap-8">
              {gameData.lastEliminatedPlayers.map((player) => (
                <div key={player.memberId} className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">
                    {player.name}
                  </div>
                  <div className="text-lg text-white/80">
                    Rôle : {player.role}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Ordre de passage */}
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
                      className={`text-lg font-medium ${
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

        {/* Boutons de contrôle uniquement pour les joueurs non-hôtes */}
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

        {/* Bouton "Partie suivante" uniquement pour l'hôte */}
        {isHost && isGameOver && (
          <button
            onClick={handleNextGame}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-bold text-lg"
          >
            {gameData.isLastGame ? "Voir les scores finaux" : "Partie suivante"}
          </button>
        )}
      </div>
    </div>
  );
}
