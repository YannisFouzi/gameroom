import { undercoverService } from "@/lib/firebase/services/undercoverService";
import { Team } from "@/types/room";
import { UndercoverGameData } from "@/types/undercover";
import { motion } from "framer-motion";
import { useState } from "react";

type VotingPhaseProps = {
  gameData: UndercoverGameData;
  isHost: boolean;
  currentTeam: Team | null;
  teamId: string | null;
  teams: Record<string, Team>;
  roomId: string;
};

export default function VotingPhase({
  gameData,
  isHost,
  currentTeam,
  teamId,
  teams,
  roomId,
}: VotingPhaseProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const hasVoted = teamId && gameData.votes[teamId];

  // Filtrer les joueurs des autres équipes qui ne sont pas éliminés
  const votablePlayers = gameData.players.filter(
    (p) => !p.isEliminated && p.teamId !== teamId
  );

  const handleVote = async () => {
    if (!teamId || !selectedPlayer) return;
    await undercoverService.submitVote(roomId, teamId, selectedPlayer);
  };

  if (isHost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Phase de vote</h2>
          <p className="text-xl text-white/80">
            Les équipes votent pour éliminer un joueur...
          </p>
          <div className="mt-8 space-y-4">
            {Object.entries(teams).map(([id, team]) => (
              <div key={id} className="text-lg text-white/80">
                {team.name}:{" "}
                {gameData.votes[id] ? "A voté" : "N'a pas encore voté"}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (hasVoted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
        <div className="max-w-md mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              Vote enregistré
            </h2>
            <p className="text-lg text-white/80">
              En attente des votes des autres équipes...
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Qui voulez-vous éliminer ?
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Choisissez un joueur à éliminer
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {votablePlayers.map((player) => (
            <motion.button
              key={player.memberId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedPlayer(player.memberId)}
              className={`p-4 rounded-xl border transition-all ${
                selectedPlayer === player.memberId
                  ? "bg-purple-600/20 border-purple-400"
                  : "bg-white/5 border-white/20 hover:bg-white/10"
              }`}
            >
              <div className="text-lg font-medium text-white">
                {player.name}
              </div>
              <div className="text-sm text-white/60">
                Équipe {teams[player.teamId]?.name}
              </div>
            </motion.button>
          ))}
        </div>

        {selectedPlayer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <button
              onClick={handleVote}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-bold text-lg hover:opacity-90 transition-all"
            >
              Confirmer le vote
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
