"use client";

import { RoomProvider, useRoom } from "@/contexts/RoomContext";
import { usePlayer } from "@/hooks/usePlayer";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";

type TeamWithScore = {
  teamId: string;
  name: string;
  avatar: string;
  score: number;
};

function WheelResultsContent() {
  const { room } = useRoom();
  const { isHost, teamId } = usePlayer(room?.id || "");

  if (!room) return <div>Chargement...</div>;

  const scores = room.gameData?.wheelState?.scores || {};
  const winningTeamId = room.gameData?.winningTeamId;
  const teams = room.teams || {};

  // Trier les équipes par score
  const sortedTeams: TeamWithScore[] = Object.entries(teams)
    .map(([teamId, team]) => ({
      teamId,
      name: team.name,
      avatar: team.avatar,
      score: scores[teamId] || 0,
    }))
    .sort((a, b) => b.score - a.score);

  const winner = sortedTeams[0];

  // Vue pour l'hôte
  const HostView = () => (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Section gagnant */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl p-8 text-center shadow-[0_0_30px_rgba(251,191,36,0.3)]"
      >
        <h3 className="text-3xl font-extrabold mb-6">🏆 Gagnant 🏆</h3>
        <div className="flex items-center justify-center gap-6 mb-4">
          <img src={winner.avatar} alt={winner.name} className="w-24 h-24" />
          <div>
            <div className="text-4xl font-bold">{winner.name}</div>
            <div className="text-2xl font-semibold">{winner.score} points</div>
          </div>
        </div>
      </motion.div>

      {/* Autres équipes */}
      {sortedTeams.slice(1).map((team, index) => (
        <motion.div
          key={team.teamId}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-white/80">
              #{index + 2}
            </span>
            <img src={team.avatar} alt={team.name} className="w-12 h-12" />
            <span className="text-xl font-medium text-white">{team.name}</span>
          </div>
          <span className="text-xl font-bold text-white">
            {team.score} points
          </span>
        </motion.div>
      ))}

      {/* Message de fin */}
      <div className="mt-12">
        <div className="bg-blue-900/50 backdrop-blur-sm p-6 rounded-xl border border-blue-400">
          <p className="text-xl text-white text-center">
            🎉 Félicitations à toutes les équipes pour cette belle partie ! 🎉
          </p>
        </div>
      </div>
    </div>
  );

  // Vue pour les joueurs
  const PlayerView = () => {
    const playerTeam = sortedTeams.find((team) => team.teamId === teamId);
    const playerRank =
      sortedTeams.findIndex((team) => team.teamId === teamId) + 1;
    const teamMembers = teamId ? room.teams[teamId]?.members || [] : [];

    return (
      <div className="max-w-md mx-auto p-6 text-center space-y-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-blue-900/50 backdrop-blur-sm p-8 rounded-xl border border-blue-400"
        >
          <h2 className="text-3xl font-bold text-white mb-6">
            {playerTeam?.name}
          </h2>
          <div className="space-y-6">
            <img
              src={playerTeam?.avatar}
              alt={playerTeam?.name}
              className="w-20 h-20 mx-auto"
            />
            <div className="text-2xl font-bold text-white">
              {playerTeam?.score} points
            </div>
            <div className="text-xl text-white/80">
              #{playerRank} au classement
            </div>
            <div className="space-y-2 pt-4 border-t border-white/20">
              {teamMembers.map((member, index) => (
                <div key={index} className="text-lg text-white/80">
                  {member.name}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {isHost ? <HostView /> : <PlayerView />}
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
