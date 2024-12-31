"use client";

import { RoomProvider, useRoom } from "@/contexts/RoomContext";
import { usePlayer } from "@/hooks/usePlayer";
import { roomService } from "@/lib/firebase/roomService";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

function MillionaireRulesContent() {
  const router = useRouter();
  const { room } = useRoom();
  const { isHost, teamId } = usePlayer(room?.id || "");

  useEffect(() => {
    if (room?.gamePhase === "millionaire-playing") {
      router.push(`/room/${room.id}/millionaire`);
    }
  }, [room?.gamePhase, room?.id, router]);

  if (!room) return null;

  const startingTeamName = room?.gameData?.winningTeamName || "";
  const currentTeam = teamId ? room.teams[teamId] : null;

  const handleStart = async () => {
    if (!room?.id) return;
    await roomService.startMillionaireGame(room.id);
  };

  if (!isHost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-4"
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Qui veut gagner des millions
            </h2>
            <p className="text-lg text-white/80">Testez vos connaissances !</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">👑</div>
              <div className="text-xl font-bold text-white">
                L'équipe "{startingTeamName}" commence !
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10"
            >
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="text-lg font-bold text-white mb-1">
                Tour par tour
              </h3>
              <p className="text-sm text-white/80">
                Chaque équipe joue à son tour et choisit une catégorie parmi les
                4 disponibles. Une fois utilisée, la catégorie devient
                indisponible pour les autres !
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10"
            >
              <div className="text-2xl mb-2">💎</div>
              <h3 className="text-lg font-bold text-white mb-1">
                Difficulté et paliers
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-white/80">
                  Les questions deviennent plus difficiles mais rapportent plus
                  de points :
                </p>
                <ul className="space-y-0.5 text-white/70">
                  <li>• Questions 1-5 : 1-5 points</li>
                  <li>• Questions 6-10 : 7-12 points</li>
                  <li>• Questions 11-15 : 14-20 points</li>
                </ul>
                <p>Paliers de sécurité :</p>
                <ul className="space-y-0.5 text-white/70">
                  <li>• Échec Q1-5 : 0 point</li>
                  <li>• Échec Q6-10 : 5 points garantis</li>
                  <li>• Échec Q11-15 : 12 points garantis</li>
                </ul>
                <p className="text-white/90 font-medium">
                  💡 Vous pouvez vous arrêter après chaque bonne réponse pour
                  garder vos points !
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10"
            >
              <div className="text-2xl mb-2">❌</div>
              <h3 className="text-lg font-bold text-white mb-1">
                Attention aux erreurs
              </h3>
              <p className="text-sm text-white/80">
                Une mauvaise réponse et c'est terminé ! Le tour passe à l'équipe
                suivante.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10"
            >
              <div className="text-2xl mb-2">🎮</div>
              <h3 className="text-lg font-bold text-white mb-1">
                Jokers disponibles
              </h3>
              <p className="text-sm text-white/80">
                Utilisez vos jokers stratégiquement : 50/50, appel à un ami, et
                double chance !
              </p>
            </motion.div>
          </div>

          {isHost && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-4"
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-4"
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Qui veut gagner des millions
          </h2>
          <p className="text-lg text-white/80">Testez vos connaissances !</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4"
        >
          <div className="text-center">
            <div className="text-2xl mb-2">👑</div>
            <div className="text-xl font-bold text-white">
              L'équipe "{startingTeamName}" commence !
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10"
          >
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="text-lg font-bold text-white mb-1">Tour par tour</h3>
            <p className="text-sm text-white/80">
              Chaque équipe joue à son tour et choisit une catégorie parmi les 4
              disponibles. Une fois utilisée, la catégorie devient indisponible
              pour les autres !
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10"
          >
            <div className="text-2xl mb-2">💎</div>
            <h3 className="text-lg font-bold text-white mb-1">
              Difficulté et paliers
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-white/80">
                Les questions deviennent plus difficiles mais rapportent plus de
                points :
              </p>
              <ul className="space-y-0.5 text-white/70">
                <li>• Questions 1-5 : 1-5 points</li>
                <li>• Questions 6-10 : 7-12 points</li>
                <li>• Questions 11-15 : 14-20 points</li>
              </ul>
              <p>Paliers de sécurité :</p>
              <ul className="space-y-0.5 text-white/70">
                <li>• Échec Q1-5 : 0 point</li>
                <li>• Échec Q6-10 : 5 points garantis</li>
                <li>• Échec Q11-15 : 12 points garantis</li>
              </ul>
              <p className="text-white/90 font-medium">
                💡 Vous pouvez vous arrêter après chaque bonne réponse pour
                garder vos points !
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10"
          >
            <div className="text-2xl mb-2">❌</div>
            <h3 className="text-lg font-bold text-white mb-1">
              Attention aux erreurs
            </h3>
            <p className="text-sm text-white/80">
              Une mauvaise réponse et c'est terminé ! Le tour passe à l'équipe
              suivante.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10"
          >
            <div className="text-2xl mb-2">🎮</div>
            <h3 className="text-lg font-bold text-white mb-1">
              Jokers disponibles
            </h3>
            <p className="text-sm text-white/80">
              Utilisez vos jokers stratégiquement : 50/50, appel à un ami, et
              double chance !
            </p>
          </motion.div>
        </div>

        {isHost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-4"
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
    </div>
  );
}

export default function MillionaireRulesPage() {
  const { roomId } = useParams();

  return (
    <RoomProvider roomId={roomId as string}>
      <MillionaireRulesContent />
    </RoomProvider>
  );
}
