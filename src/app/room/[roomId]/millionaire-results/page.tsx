"use client";

import { RoomProvider, useRoom } from "@/contexts/RoomContext";
import { usePlayer } from "@/hooks/usePlayer";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";

type TeamWithScore = {
  teamId: string;
  name: string;
  avatar: string;
  finalScore: number;
};

function MillionaireResultsContent() {
  const { room } = useRoom();
  const { isHost } = usePlayer(room?.id || "");

  if (!room?.gameData?.scores) return <div>Chargement...</div>;

  // Trier les équipes par score
  const sortedTeams: TeamWithScore[] = Object.entries(room.teams)
    .map(([teamId, team]) => ({
      teamId,
      name: team.name,
      avatar: team.avatar,
      finalScore: room.gameData?.scores?.[teamId] || 0,
    }))
    .sort((a, b) => b.finalScore - a.finalScore);

  const winner = sortedTeams[0];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Résultats finaux</h2>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-center"
      >
        <h3 className="text-xl font-bold mb-2">🏆 Équipe gagnante 🏆</h3>
        <div className="flex items-center justify-center gap-3 mb-2">
          <img
            src={winner.avatar}
            alt={winner.name}
            className="w-12 h-12 rounded-full"
          />
          <span className="text-2xl font-bold">{winner.name}</span>
        </div>
        <p className="text-lg text-blue-800">
          avec {winner.finalScore} points !
        </p>
      </motion.div>

      <div className="space-y-4">
        {sortedTeams.slice(1).map((team, index) => (
          <motion.div
            key={team.teamId}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-white rounded-lg border"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-gray-500">
                #{index + 2}
              </span>
              <img
                src={team.avatar}
                alt={team.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="font-medium">{team.name}</span>
            </div>
            <span className="text-lg font-bold">{team.finalScore} points</span>
          </motion.div>
        ))}
      </div>

      {isHost && (
        <div className="mt-8 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-lg text-blue-800">
              Félicitations à {winner.name} ! Tu as remporté la manche
              précédente. C'est toi qui commenceras à tourner la roue pour le
              jeu Tu te mets combien ?
            </p>
          </div>
          <button
            onClick={() => {
              /* Implémenter la suite du jeu ici */
            }}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Passer au jeu suivant : Tu te mets combien ?
          </button>
        </div>
      )}
    </div>
  );
}

export default function MillionaireResultsPage() {
  const { roomId } = useParams();

  return (
    <RoomProvider roomId={roomId as string}>
      <MillionaireResultsContent />
    </RoomProvider>
  );
}
