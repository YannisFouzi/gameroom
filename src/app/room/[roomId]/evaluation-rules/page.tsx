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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div
        className={`max-w-[1440px] mx-auto p-4 ${
          isHost ? "space-y-12" : "space-y-6"
        } flex flex-col items-center justify-center min-h-screen`}
      >
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
                className="w-20 h-20 mx-auto"
              />
            </motion.div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-8"
        >
          <h2
            className={`font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent ${
              isHost ? "text-5xl" : "text-2xl"
            }`}
          >
            Tu te mets combien ?
          </h2>
          <p className={`${isHost ? "text-2xl" : "text-base"} text-white/80`}>
            Testez vos connaissances !
          </p>
        </motion.div>

        {isHost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 w-full"
          >
            <div className="text-center">
              <div className="text-5xl mb-4">👑</div>
              <div className="text-3xl font-bold text-white">
                L&apos;équipe &quot;{winningTeamName}&quot; commence !
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`bg-white/5 ${
              isHost ? "p-8" : "p-4"
            } rounded-2xl backdrop-blur-sm border border-white/10`}
          >
            <div className={`${isHost ? "text-5xl mb-4" : "text-4xl mb-2"}`}>
              🎲
            </div>
            <h3
              className={`${
                isHost ? "text-2xl mb-3" : "text-base mb-2"
              } font-bold text-white`}
            >
              Le score
            </h3>
            <p
              className={`${
                isHost ? "text-xl" : "text-sm"
              } text-white/80 leading-relaxed`}
            >
              Chaque équipe commence à 0 point et le premier à 25 gagne !
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`bg-white/5 ${
              isHost ? "p-8" : "p-4"
            } rounded-2xl backdrop-blur-sm border border-white/10`}
          >
            <div className={`${isHost ? "text-5xl mb-4" : "text-4xl mb-2"}`}>
              🎯
            </div>
            <h3
              className={`${
                isHost ? "text-2xl mb-3" : "text-base mb-2"
              } font-bold text-white`}
            >
              Comment jouer ?
            </h3>
            <p
              className={`${
                isHost ? "text-xl" : "text-base"
              } text-white/80 leading-relaxed`}
            >
              Tourner la roue, et choisissez un palier de difficulté suivant le
              thème affiché.
            </p>
            <p
              className={`${
                isHost ? "text-xl" : "text-base"
              } text-white/80 leading-relaxed mt-2`}
            >
              L'équipe adverse pose ensuite les questions et valide ou non les
              réponses.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`bg-white/5 ${
              isHost ? "p-8" : "p-4"
            } rounded-2xl backdrop-blur-sm border border-white/10`}
          >
            <div className={`${isHost ? "text-5xl mb-4" : "text-4xl mb-2"}`}>
              🔄
            </div>
            <h3
              className={`${
                isHost ? "text-2xl mb-3" : "text-base mb-2"
              } font-bold text-white`}
            >
              Progression
            </h3>
            <p
              className={`${
                isHost ? "text-xl" : "text-base"
              } text-white/80 leading-relaxed`}
            >
              Vous avancez au rythme des paliers choisit.
            </p>
            <p
              className={`${
                isHost ? "text-xl" : "text-base"
              } text-white/80 leading-relaxed mt-2`}
            >
              ⚠️ Attention si vous répondez faux vous ne gagnez pas de points.
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
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-10 rounded-xl font-bold text-2xl shadow-lg hover:opacity-90 transition-all"
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
