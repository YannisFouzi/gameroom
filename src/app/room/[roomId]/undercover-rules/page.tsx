"use client";

import { RoomProvider, useRoom } from "@/contexts/RoomContext";
import { usePlayer } from "@/hooks/usePlayer";
import { roomService } from "@/lib/firebase/roomService";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

function UndercoverRulesContent() {
  const router = useRouter();
  const { room } = useRoom();
  const { isHost, teamId } = usePlayer(room?.id || "");
  const currentTeam = teamId ? room?.teams[teamId] : null;

  useEffect(() => {
    if (room?.gamePhase === "undercover-playing") {
      router.push(`/room/${room.id}/undercover`);
    }
  }, [room?.gamePhase, room?.id, router]);

  const handleStart = async () => {
    if (!room?.id) return;
    await roomService.startUndercoverGame(room.id);
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

          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white">
              {currentTeam.name}
            </h1>
            <div className="space-y-2">
              {currentTeam.members.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-xl text-white/80"
                >
                  {member.name}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10"
        >
          <div className="text-2xl mb-2">🕵️</div>
          <h3 className="text-lg font-bold text-white mb-1">Concept du jeu</h3>
          <p className="text-sm text-white/80">
            Chaque joueur reçoit un mot secret. Un joueur reçoit un mot
            différent : c'est l'Undercover ! À vous de le démasquer sans vous
            faire repérer.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10"
        >
          <div className="text-2xl mb-2">🎯</div>
          <h3 className="text-lg font-bold text-white mb-1">Tour par tour</h3>
          <p className="text-sm text-white/80">
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
          <div className="text-2xl mb-2">🗳️</div>
          <h3 className="text-lg font-bold text-white mb-1">Phase de vote</h3>
          <p className="text-sm text-white/80">
            Après chaque tour, les joueurs votent pour éliminer celui qu'ils
            soupçonnent d'être l'Undercover. Le joueur avec le plus de votes est
            éliminé !
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10"
        >
          <div className="text-2xl mb-2">👑</div>
          <h3 className="text-lg font-bold text-white mb-1">Victoire</h3>
          <p className="text-sm text-white/80">
            Les joueurs gagnent s'ils éliminent l'Undercover. L'Undercover gagne
            s'il survit jusqu'à ce qu'il ne reste que 2 joueurs en jeu !
          </p>
        </motion.div>
      </div>

      {isHost && (
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
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <MainContent />
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
