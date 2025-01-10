"use client";

import { useRoom } from "@/contexts/RoomContext";
import { motion } from "framer-motion";

type GameScores = {
  millionaire?: Record<string, number>;
  evaluation?: Record<string, number>;
  total?: Record<string, number>;
  undercover?: Record<string, number>;
};

export default function FinalScoresPage() {
  const { room } = useRoom();

  if (!room?.gameData?.scores) return <div>Chargement...</div>;

  const scores = room.gameData.scores as GameScores;
  const { millionaire = {}, evaluation = {}, undercover = {} } = scores;

  // Calculer les scores totaux
  const totalScores: Record<string, number> = {};
  Object.keys(room.teams).forEach((teamId) => {
    totalScores[teamId] =
      (millionaire?.[teamId] || 0) +
      (evaluation?.[teamId] || 0) +
      (undercover?.[teamId] || 0);
  });

  // Trier les équipes par score total
  const sortedTeams = Object.entries(room.teams)
    .map(([id, team]) => ({
      id,
      name: team.name,
      avatar: team.avatar,
      millionaireScore: millionaire?.[id] || 0,
      evaluationScore: evaluation?.[id] || 0,
      undercoverScore: undercover?.[id] || 0,
      totalScore: totalScores[id],
    }))
    .sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-4xl font-bold text-white text-center mb-12"
        >
          Scores Finaux
        </motion.h1>

        {sortedTeams.map((team, index) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-xl ${
              index === 0
                ? "bg-gradient-to-br from-yellow-400 to-amber-500"
                : "bg-white/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-white">
                  #{index + 1}
                </span>
                <img src={team.avatar} alt={team.name} className="w-12 h-12" />
                <span className="text-xl font-medium text-white">
                  {team.name}
                </span>
              </div>
              <div className="text-2xl font-bold text-white">
                {team.totalScore} pts
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div className="text-white/80">
                Millionaire: {team.millionaireScore} pts
              </div>
              <div className="text-white/80">
                Evaluation: {team.evaluationScore} pts
              </div>
              <div className="text-white/80">
                Undercover: {team.undercoverScore} pts
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
