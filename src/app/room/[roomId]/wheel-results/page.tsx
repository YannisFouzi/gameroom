"use client";

import { RoomProvider, useRoom } from "@/contexts/RoomContext";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";

function WheelResultsContent() {
  const { room } = useRoom();
  const scores = room?.gameData?.wheelState?.scores || {};
  const winningTeamId = room?.gameData?.winningTeamId;
  const teams = room?.teams || {};

  const sortedTeams = Object.entries(teams)
    .map(([teamId, team]) => ({
      teamId,
      name: team.name,
      score: scores[teamId] || 0,
    }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8"
      >
        <h1 className="text-3xl font-bold text-center mb-8">
          🎉 Fin de la partie ! 🎉
        </h1>

        <div className="space-y-6">
          {sortedTeams.map(({ teamId, name, score }) => (
            <div
              key={teamId}
              className={`p-4 rounded-lg ${
                teamId === winningTeamId
                  ? "bg-yellow-100 border-2 border-yellow-400"
                  : "bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold">{name}</h3>
                  {teamId === winningTeamId && (
                    <span className="text-yellow-600">🏆 Vainqueur !</span>
                  )}
                </div>
                <span className="text-2xl font-bold">{score} points</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default function WheelResultsPage() {
  const { roomId } = useParams();

  return (
    <RoomProvider roomId={roomId as string}>
      <WheelResultsContent />
    </RoomProvider>
  );
}
