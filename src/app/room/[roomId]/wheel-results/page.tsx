"use client";

import VideoOverlay from "@/components/common/VideoOverlay";
import { RoomProvider, useRoom } from "@/contexts/RoomContext";
import { usePlayer } from "@/hooks/usePlayer";
import { gameTransitionService } from "@/lib/firebase/services";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type TeamWithTotalScore = {
  teamId: string;
  name: string;
  avatar: string;
  millionaireScore: number;
  evaluationScore: number;
  totalScore: number;
};

function WheelResultsContent() {
  const { room } = useRoom();
  const { isHost, teamId } = usePlayer(room?.id || "");
  const router = useRouter();
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    // Rediriger vers les règles d'Undercover si c'est la phase suivante
    if (room?.gamePhase === "undercover-rules") {
      router.push(`/room/${room.id}/undercover-rules`);
    }
    // Rediriger vers le jeu si on est déjà en phase de jeu
    if (room?.gamePhase === "undercover-playing") {
      router.push(`/room/${room.id}/undercover`);
    }
  }, [room?.gamePhase, room?.id, router]);

  if (!room) return <div>Chargement...</div>;

  const scores = room.gameData?.scores || {};
  const wheelScores = room.gameData?.wheelState?.scores || {};
  const teams = room.teams || {};

  // Calculer les scores totaux
  const totalScores: TeamWithTotalScore[] = Object.entries(teams)
    .map(([id, team]) => ({
      teamId: id,
      name: team.name,
      avatar: team.avatar,
      millionaireScore: scores.millionaire?.[id] || 0,
      evaluationScore: wheelScores[id] || 0,
      totalScore: (scores.millionaire?.[id] || 0) + (wheelScores[id] || 0),
    }))
    .sort((a, b) => b.totalScore - a.totalScore);

  const winner = totalScores[0];

  // Vue pour l'hôte
  const HostView = () => (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Section gagnant */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl p-8 text-center shadow-[0_0_30px_rgba(251,191,36,0.3)]"
      >
        <h3 className="text-5xl font-extrabold mb-8">🏆 Équipe en tête 🏆</h3>
        <div className="flex items-center justify-center gap-8 mb-6">
          <img src={winner.avatar} alt={winner.name} className="w-32 h-32" />
          <div>
            <div className="text-6xl font-bold">{winner.name}</div>
            <div className="text-4xl font-semibold">
              {winner.totalScore} points
            </div>
          </div>
        </div>
        <div className="mt-6 space-y-4 text-2xl">
          <div>
            Qui veut gagner des millions : {winner.millionaireScore} pts
          </div>
          <div>Tu te mets combien : {winner.evaluationScore} pts</div>
        </div>
      </motion.div>

      {/* Autres équipes */}
      {totalScores.slice(1).map((team, index) => (
        <motion.div
          key={team.teamId}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
        >
          <div className="flex items-center gap-6">
            <span className="text-3xl font-bold text-white/80">
              #{index + 2}
            </span>
            <img src={team.avatar} alt={team.name} className="w-16 h-16" />
            <div>
              <span className="text-2xl font-medium text-white block">
                {team.name}
              </span>
              <span className="text-lg text-white/70">
                Qui veut gagner des millions : {team.millionaireScore} pts • Tu
                te mets combien : {team.evaluationScore} pts
              </span>
            </div>
          </div>
          <span className="text-2xl font-bold text-white">
            {team.totalScore} points
          </span>
        </motion.div>
      ))}

      {/* Message de fin */}
      <div className="mt-12 space-y-4">
        <div className="bg-blue-900/50 backdrop-blur-sm p-6 rounded-xl border border-blue-400">
          <p className="text-xl text-white text-center">
            Place au dernier jeu : Undercover !
          </p>
        </div>
        <button
          onClick={handleNextGame}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-xl font-bold text-xl hover:opacity-90 transition-all"
        >
          Continuer vers "Undercover" →
        </button>
      </div>

      {showVideo && (
        <VideoOverlay
          publicId="video/jg4irxswuvvh6q1ahopr"
          onComplete={handleVideoComplete}
        />
      )}
    </div>
  );

  // Vue pour les joueurs
  const PlayerView = () => {
    const playerTeam = totalScores.find((team) => team.teamId === teamId);
    const playerRank =
      totalScores.findIndex((team) => team.teamId === teamId) + 1;
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
            <div className="space-y-4">
              <div className="text-2xl font-bold text-white">
                {playerTeam?.totalScore} points au total
              </div>
              <div className="space-y-2 text-lg text-white/80">
                <div>
                  Qui veut gagner des millions : {playerTeam?.millionaireScore}{" "}
                  pts
                </div>
                <div>
                  Tu te mets combien : {playerTeam?.evaluationScore} pts
                </div>
              </div>
              <div className="text-xl text-white/80">
                #{playerRank} au classement final
              </div>
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
      await gameTransitionService.startUndercoverGame(room!.id);
      setShowVideo(false);
      router.push(`/room/${room!.id}/undercover-rules`);
    } catch (error) {
      console.error("Erreur lors du passage au jeu suivant:", error);
    }
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
