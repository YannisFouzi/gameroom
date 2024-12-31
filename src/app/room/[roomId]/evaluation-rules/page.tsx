"use client";

import { RoomProvider, useRoom } from "@/contexts/RoomContext";
import { usePlayer } from "@/hooks/usePlayer";
import { db } from "@/lib/firebase/config";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

function EvaluationRulesContent() {
  const router = useRouter();
  const { room } = useRoom();
  const { isHost, teamId } = usePlayer(room?.id || "");
  const winningTeamName = room?.gameData?.winningTeamName || "";
  const currentTeam = teamId && room ? room.teams[teamId] : null;

  useEffect(() => {
    if (room?.gamePhase === "wheel") {
      router.push(`/room/${room.id}/wheel`);
    }
  }, [room?.gamePhase, room?.id, router]);

  const handleStart = async () => {
    if (!room?.id) return;
    try {
      await updateDoc(doc(db, "rooms", room.id), {
        gamePhase: "wheel",
        updatedAt: serverTimestamp(),
      });
      router.push(`/room/${room.id}/wheel`);
    } catch (error) {
      console.error("Erreur lors du démarrage du jeu:", error);
    }
  };

  if (!room) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="max-w-2xl mx-auto space-y-12">
        {!isHost && currentTeam && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Tu te mets combien ?
          </h2>
          <p className="text-xl text-white/80">Testez vos connaissances !</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
        >
          <div className="text-center">
            <div className="text-3xl mb-4">👑</div>
            <div className="text-2xl font-bold text-white">
              L'équipe "{winningTeamName}" commence !
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10"
          >
            <div className="text-3xl mb-4">🎲</div>
            <h3 className="text-xl font-bold text-white mb-2">Le plateau</h3>
            <p className="text-white/80">
              Chaque équipe commence à la case 0 sur un plateau de 20 cases. Le
              but est d'atteindre la case 20 en premier !
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10"
          >
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-white mb-2">Tour de jeu</h3>
            <p className="text-white/80">
              L'équipe qui joue tourne une roue pour déterminer le thème. Une
              équipe adverse pose ensuite les questions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10"
          >
            <div className="text-3xl mb-4">⭐</div>
            <h3 className="text-xl font-bold text-white mb-2">Difficulté</h3>
            <p className="text-white/80">
              L'équipe qui répond choisit un niveau de difficulté (1 à 5). Plus
              c'est difficile, plus vous avancez !
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10"
          >
            <div className="text-3xl mb-4">🔄</div>
            <h3 className="text-xl font-bold text-white mb-2">Progression</h3>
            <p className="text-white/80">
              Après chaque tour, la main passe à l'équipe suivante. Stratégie et
              connaissances sont les clés !
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
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-xl font-bold text-xl shadow-lg hover:opacity-90 transition-all"
            >
              Commencer le jeu →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function EvaluationRulesPage() {
  const { roomId } = useParams();

  return (
    <RoomProvider roomId={roomId as string}>
      <EvaluationRulesContent />
    </RoomProvider>
  );
}
