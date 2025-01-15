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

  const RulesForPlayers = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Phase 1: Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10 relative overflow-hidden group hover:bg-white/10 transition-all"
      >
        <div className="absolute -right-4 -top-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">
          🎲
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Phase 1</h3>
        <div className="space-y-2">
          <motion.div className="flex items-center gap-2" whileHover={{ x: 5 }}>
            <span className="text-purple-400">👥</span>
            <p className="text-white/80">Chaque joueur reçoit un mot secret</p>
          </motion.div>
          <motion.div className="flex items-center gap-2" whileHover={{ x: 5 }}>
            <span className="text-purple-400">🕵️</span>
            <p className="text-white/80">
              1 Undercover par équipe : mot différent
            </p>
          </motion.div>
          <motion.div className="flex items-center gap-2" whileHover={{ x: 5 }}>
            <span className="text-purple-400">👻</span>
            <p className="text-white/80">1 Mr White par équipe : sans mot</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Phase 2: Jeu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10 relative overflow-hidden group hover:bg-white/10 transition-all"
      >
        <div className="absolute -right-4 -top-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">
          💭
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Phase 2</h3>
        <div className="space-y-2">
          <motion.div className="flex items-center gap-2" whileHover={{ x: 5 }}>
            <span className="text-purple-400">🎯</span>
            <p className="text-white/80">Tour par tour : donnez un indice</p>
          </motion.div>
          <motion.div className="flex items-center gap-2" whileHover={{ x: 5 }}>
            <span className="text-purple-400">🤫</span>
            <p className="text-white/80">Soyez subtils !</p>
          </motion.div>
          <motion.div className="flex items-center gap-2" whileHover={{ x: 5 }}>
            <span className="text-purple-400">🔍</span>
            <p className="text-white/80">Repérez les suspects</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Phase 3: Vote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10 relative overflow-hidden group hover:bg-white/10 transition-all"
      >
        <div className="absolute -right-4 -top-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">
          🏆
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Phase 3</h3>
        <div className="space-y-2">
          <motion.div className="flex items-center gap-2" whileHover={{ x: 5 }}>
            <span className="text-purple-400">🗳️</span>
            <p className="text-white/80">Votez pour éliminer un suspect</p>
          </motion.div>
          <motion.div className="flex items-center gap-2" whileHover={{ x: 5 }}>
            <span className="text-purple-400">💰</span>
            <p className="text-white/80">
              5 pts par Undercover, 3 pts par Mr White
            </p>
          </motion.div>
          <motion.div className="flex items-center gap-2" whileHover={{ x: 5 }}>
            <span className="text-purple-400">🏆</span>
            <p className="text-white/80">3 parties pour la victoire finale</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );

  const ExampleForHost = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white/5 p-5 rounded-3xl backdrop-blur-sm border border-white/10"
    >
      <h3 className="text-5xl font-bold text-white mb-8 text-center">
        Exemple
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Équipe 1 */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <h4 className="text-4xl font-bold text-white">Équipe 1</h4>
          </div>

          <div className="space-y-4">
            <motion.div
              className="flex items-center gap-4 bg-white/10 p-4 rounded-xl"
              whileHover={{ x: 5 }}
            >
              <span className="text-green-400 text-4xl">👤</span>
              <p className="text-white/80 text-2xl">
                Joueur 2 - Mot: "Chat" (Civil)
              </p>
            </motion.div>
            <motion.div
              className="flex items-center gap-4 bg-white/10 p-4 rounded-xl"
              whileHover={{ x: 5 }}
            >
              <span className="text-green-400 text-4xl">👤</span>
              <p className="text-white/80 text-2xl">
                Joueur 2 - Mot: "Chat" (Civil)
              </p>
            </motion.div>
            <motion.div
              className="flex items-center gap-4 bg-purple-500/20 p-4 rounded-xl"
              whileHover={{ x: 5 }}
            >
              <span className="text-purple-400 text-4xl">🕵️</span>
              <p className="text-white/80 text-2xl">
                Joueur 3 - Mot: "Chien" (Undercover)
              </p>
            </motion.div>
            <motion.div
              className="flex items-center gap-4 bg-blue-500/20 p-4 rounded-xl"
              whileHover={{ x: 5 }}
            >
              <span className="text-blue-400 text-4xl">👻</span>
              <p className="text-white/80 text-2xl">
                Joueur 4 - Pas de mot (Mr White)
              </p>
            </motion.div>
          </div>
        </div>

        {/* Équipe 2 */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <h4 className="text-4xl font-bold text-white">Équipe 2</h4>
          </div>

          <div className="space-y-4">
            <motion.div
              className="flex items-center gap-4 bg-white/10 p-4 rounded-xl"
              whileHover={{ x: 5 }}
            >
              <span className="text-green-400 text-4xl">👤</span>
              <p className="text-white/80 text-2xl">
                Joueur 2 - Mot: "Chat" (Civil)
              </p>
            </motion.div>
            <motion.div
              className="flex items-center gap-4 bg-white/10 p-4 rounded-xl"
              whileHover={{ x: 5 }}
            >
              <span className="text-green-400 text-4xl">👤</span>
              <p className="text-white/80 text-2xl">
                Joueur 2 - Mot: "Chat" (Civil)
              </p>
            </motion.div>
            <motion.div
              className="flex items-center gap-4 bg-purple-500/20 p-4 rounded-xl"
              whileHover={{ x: 5 }}
            >
              <span className="text-purple-400 text-4xl">🕵️</span>
              <p className="text-white/80 text-2xl">
                Joueur 3 - Mot: "Chien" (Undercover)
              </p>
            </motion.div>
            <motion.div
              className="flex items-center gap-4 bg-blue-500/20 p-4 rounded-xl"
              whileHover={{ x: 5 }}
            >
              <span className="text-blue-400 text-4xl">👻</span>
              <p className="text-white/80 text-2xl">
                Joueur 4 - Pas de mot (Mr White)
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
        <p className="text-center text-yellow-300 text-2xl leading-relaxed">
          Dans cet exemple, le mot principal est "Chat". Les Undercover ont
          "Chien" et les Mr White n'ont aucun mot.
          <br />
          Les joueurs doivent donner des indices à tour de rôle pour trouver qui
          a un mot différent !
        </p>
      </div>
    </motion.div>
  );

  const MainContent = () => (
    <div className="w-[85%] mx-auto space-y-9">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent mb-2">
          Undercover
        </h1>
        <p className="text-xl text-white/80">
          Infiltrez-vous et démasquez les imposteurs !
        </p>
      </motion.div>

      {/* Afficher le contenu approprié selon le rôle */}
      {isHost ? (
        <>
          <ExampleForHost />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <button
              onClick={handleStart}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Lancer la partie →
            </button>
          </motion.div>
        </>
      ) : (
        <RulesForPlayers />
      )}
    </div>
  );

  if (!room) return <div>Chargement...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black px-12 flex items-center">
      <div className="w-[85%] mx-auto space-y-6 my-auto">
        {/* Scores en haut */}
        {isHost && room.teams && gameData?.scores && (
          <div className="w-full">
            <ScoreDisplay scores={gameData.scores} teams={room.teams} />
          </div>
        )}

        {/* Contenu principal */}
        <div className="w-full flex items-center">
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
