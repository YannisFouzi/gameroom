"use client";

import ScoreDisplay from "@/components/undercover/ScoreDisplay";
import { RoomProvider, useRoom } from "@/contexts/RoomContext";
import { usePlayer } from "@/hooks/usePlayer";
import { roomService } from "@/lib/firebase/roomService";
import { undercoverService } from "@/lib/firebase/services/undercoverService";
import { UndercoverGameData } from "@/types/undercover";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

function UndercoverRulesContent() {
  const router = useRouter();
  const { room } = useRoom();
  const { isHost, teamId } = usePlayer(room?.id || "");
  const currentTeam = teamId ? room?.teams[teamId] : null;
  const gameData = room?.gameData?.undercover as UndercoverGameData;

  useEffect(() => {
    if (room?.gamePhase === "undercover-playing") {
      router.push(`/room/${room.id}/undercover`);
    }
  }, [room?.gamePhase, room?.id, router]);

  const handleStart = async () => {
    if (!room?.id) return;
    try {
      await undercoverService.initializeGame(room.id);
      await roomService.startUndercoverGame(room.id);
      router.push(`/room/${room.id}/undercover`);
    } catch (error) {
      console.error("Erreur lors du démarrage du jeu:", error);
    }
  };

  const MainContent = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-4"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent">
          Undercover
        </h2>
        <p className="text-lg text-white/80">Trouvez l'imposteur !</p>
      </motion.div>

      {!isHost && currentTeam && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8 mb-12"
        >
          <motion.div
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <img
              src={currentTeam.avatar}
              alt={currentTeam.name}
              className="w-24 h-24 mx-auto"
            />
          </motion.div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10"
        >
          <div className="text-3xl mb-2">🕵️</div>
          <h3 className="text-xl font-bold text-white mb-1">Concept du jeu</h3>
          <p className="text-lg text-white/80">
            Chaque joueur reçoit un mot secret sur le télépone de l'équipe.
            <br />
            Par équipe :<br />• Un joueur reçoit un mot différent : c'est
            l'Undercover <br />• Un autre n'aura pas de mot attribué : c'est le
            Mr White
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10"
        >
          <div className="text-3xl mb-2">🎯</div>
          <h3 className="text-xl font-bold text-white mb-1">Tour par tour</h3>
          <p className="text-lg text-white/80">
            À tour de rôle, chaque joueur doit donner un mot qui décrit son mot
            secret, sans le révéler directement. Soyez subtils pour ne pas vous
            faire démasquer !
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10"
        >
          <div className="text-3xl mb-2">🗳️</div>
          <h3 className="text-xl font-bold text-white mb-1">Phase de vote</h3>
          <p className="text-lg text-white/80">
            Après chaque tour, chaque équipe votent pour éliminer celui qu'ils
            soupçonnent dans l'autre équipe.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10"
        >
          <div className="text-3xl mb-2">👑</div>
          <h3 className="text-xl font-bold text-white mb-1">Victoire</h3>
          <p className="text-lg text-white/80">
            La première équipe à éliminer l'Undercover et le Mr White adverse
            gagne !
          </p>
        </motion.div>
      </div>

      {isHost && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10 text-center w-full"
          >
            <p className="text-lg text-white/80">
              Undercover éliminé = 5 points, Mr White = 3 points.
              <br />
              Ce jeu possède 3 parties.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-8"
          >
            <button
              onClick={handleStart}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-bold text-lg shadow-lg hover:opacity-90 transition-all"
            >
              Commencer le jeu →
            </button>
          </motion.div>
        </>
      )}
    </div>
  );

  if (!room) return <div>Chargement...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Scores en haut */}
        {isHost && room.teams && gameData?.scores && (
          <div className="w-full">
            <ScoreDisplay scores={gameData.scores} teams={room.teams} />
          </div>
        )}

        {/* Contenu principal */}
        <div className="w-full">
          <MainContent />
        </div>
      </div>
    </div>
  );
}

export default function UndercoverRulesPage() {
  const { roomId } = useParams();
  return (
    <RoomProvider roomId={roomId as string}>
      <UndercoverRulesContent />
    </RoomProvider>
  );
}
