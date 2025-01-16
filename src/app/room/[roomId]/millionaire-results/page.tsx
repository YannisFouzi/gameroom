"use client";

import VideoOverlay from "@/components/common/VideoOverlay";
import { RoomProvider, useRoom } from "@/contexts/RoomContext";
import { usePlayer } from "@/hooks/usePlayer";
import { gameTransitionService } from "@/lib/firebase/services";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type TeamWithScore = {
  teamId: string;
  name: string;
  avatar: string;
  finalScore: number;
};

function MillionaireResultsContent() {
  const { room } = useRoom();
  const { isHost, teamId } = usePlayer(room?.id || "");
  const router = useRouter();
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (room?.gamePhase === "evaluation-rules") {
      router.push(`/room/${room.id}/evaluation-rules`);
    }
  }, [room?.gamePhase, room?.id, router]);

  if (!room?.gameData?.scores) return <div>Chargement...</div>;

  // Ajouter ces logs avant le tri des équipes
  console.log("Room data:", room);
  console.log("Scores:", room.gameData?.scores);

  // Trier les équipes par score
  const sortedTeams: TeamWithScore[] = Object.entries(room.teams)
    .map(([teamId, team]) => {
      const score = room.gameData?.scores?.millionaire?.[teamId] || 0;
      console.log(`Score for team ${team.name}:`, score);
      return {
        teamId,
        name: team.name,
        avatar: team.avatar,
        finalScore: score,
      };
    })
    .sort((a, b) => b.finalScore - a.finalScore);

  const winner = sortedTeams[0];

  const handleNextGame = async () => {
    if (!room) return;
    try {
      setShowVideo(true);
    } catch (error) {
      console.error("Erreur lors du passage au jeu suivant:", error);
    }
  };

  const handleVideoComplete = async () => {
    try {
      await gameTransitionService.startEvaluationGame(room!.id);
      setShowVideo(false);
      router.push(`/room/${room!.id}/evaluation-rules`);
    } catch (error) {
      console.error("Erreur lors du passage au jeu suivant:", error);
    }
  };

  // Vue pour l'hôte
  const HostView = () => (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Section gagnant avec plus d'animations et de style */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl p-8 text-center shadow-[0_0_30px_rgba(251,191,36,0.3)]"
      >
        <h3 className="text-4xl font-extrabold mb-6">🏆 Gagnant 🏆</h3>
        <div className="flex items-center justify-center gap-6 mb-4">
          <img src={winner.avatar} alt={winner.name} className="w-32 h-32" />
          <div>
            <div className="text-5xl font-bold">{winner.name}</div>
            <div className="text-3xl font-semibold">
              {winner.finalScore} points
            </div>
          </div>
        </div>
      </motion.div>

      {/* Autres équipes directement, sans container supplémentaire */}
      {sortedTeams.slice(1).map((team, index) => (
        <motion.div
          key={team.teamId}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-white/80">
              #{index + 2}
            </span>
            <img src={team.avatar} alt={team.name} className="w-16 h-16" />
            <span className="text-2xl font-medium text-white">{team.name}</span>
          </div>
          <span className="text-2xl font-bold text-white">
            {team.finalScore} points
          </span>
        </motion.div>
      ))}

      {/* Section suivant */}
      <div className="mt-12 space-y-4">
        <div className="bg-blue-900/50 backdrop-blur-sm p-6 rounded-xl border border-blue-400">
          <p className="text-2xl text-white">
            Félicitations à {winner.name} ! Vous commencerez la prochaine manche
            de "Tu te mets combien ?"
          </p>
        </div>
        <button
          onClick={handleNextGame}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-6 px-8 rounded-xl font-bold text-2xl hover:from-blue-500 hover:to-blue-600 transition-all"
        >
          Continuer vers "Tu te mets combien ?"
        </button>
      </div>

      {showVideo && (
        <VideoOverlay
          publicId="video/b9wuaqtlu4w4zmvwhuu0"
          onComplete={handleVideoComplete}
        />
      )}
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
          <h2 className="text-4xl font-bold text-white mb-6">
            {playerTeam?.name}
          </h2>
          <div className="space-y-6">
            <img
              src={playerTeam?.avatar}
              alt={playerTeam?.name}
              className="w-32 h-32 mx-auto"
            />
            <div className="text-3xl font-bold text-white">
              {playerTeam?.finalScore} points
            </div>
            <div className="text-2xl text-white/80">
              #{playerRank} au classement
            </div>
            <div className="space-y-3 pt-4 border-t border-white/20">
              {teamMembers.map((member, index) => (
                <div key={index} className="text-xl text-white/80">
                  {member.name}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return isHost ? <HostView /> : <PlayerView />;
}

export default function MillionaireResultsPage() {
  const { roomId } = useParams();

  return (
    <RoomProvider roomId={roomId as string}>
      <MillionaireResultsContent />
    </RoomProvider>
  );
}
