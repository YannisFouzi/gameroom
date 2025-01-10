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
  currentTeam,
  teamId,
  roomId,
}: ResultsPhaseProps) {
  const [isGameOver, setIsGameOver] = useState(false);
  const isTeamReady = teamId && gameData.teamsReady.includes(teamId);

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

  const lastEliminated =
    gameData.eliminatedPlayers[gameData.eliminatedPlayers.length - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Résultats du vote
          </h2>
        </motion.div>

        {lastEliminated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 backdrop-blur-sm p-6 rounded-xl border border-red-500/30"
          >
            <h3 className="text-xl font-bold text-white mb-2">
              Joueur éliminé :
            </h3>
            <div className="text-2xl font-bold text-white mb-2">
              {lastEliminated.name}
            </div>
            <div className="text-lg text-white/80">
              Rôle : {lastEliminated.role}
            </div>
          </motion.div>
        )}

        {/* Liste des joueurs éliminés */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20"
        >
          <h3 className="text-xl font-bold text-white mb-4">
            Joueurs éliminés :
          </h3>
          <div className="space-y-2">
            {gameData.eliminatedPlayers.map((player) => (
              <div
                key={player.memberId}
                className="flex justify-between items-center p-2 rounded bg-white/5"
              >
                <span className="text-white">{player.name}</span>
                <span className="text-white/60">{player.role}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Joueurs restants */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20"
        >
          <h3 className="text-xl font-bold text-white mb-4">
            Joueurs restants :
          </h3>
          <div className="space-y-2">
            {gameData.players
              .filter((p) => !p.isEliminated)
              .map((player) => (
                <div key={player.memberId} className="p-2 rounded bg-white/5">
                  <span className="text-white">{player.name}</span>
                </div>
              ))}
          </div>
        </motion.div>

        {!isHost && !isTeamReady && !isGameOver && (
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

        {!isHost && isTeamReady && !isGameOver && (
          <div className="text-center mt-8 text-white/80">
            En attente des autres équipes...
          </div>
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
