"use client";

import { RoomProvider, useRoom } from "@/contexts/RoomContext";
import { usePlayer } from "@/hooks/usePlayer";
import { UndercoverGameData } from "@/types/undercover";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";

function UndercoverResultsContent() {
  const { room } = useRoom();
  const { isHost, teamId } = usePlayer(room?.id || "");
  const gameData = room?.gameData?.undercover as UndercoverGameData;

  if (!room || !gameData) return <div>Chargement...</div>;

  const currentTeam = teamId ? room.teams[teamId] : null;

  // Vue pour l'hôte
  const HostView = () => (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl p-8 text-center shadow-[0_0_30px_rgba(251,191,36,0.3)]"
      >
        <h3 className="text-3xl font-extrabold mb-6">
          🏆{" "}
          {gameData.civilsWin
            ? "Les Civils gagnent !"
            : "Les Imposteurs gagnent !"}
        </h3>
      </motion.div>

      {/* Liste des joueurs avec leurs rôles */}
      {gameData.players.map((player, index) => (
        <motion.div
          key={player.memberId}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`flex items-center justify-between p-4 rounded-lg border ${
            player.isEliminated
              ? "bg-red-900/20 border-red-500/30"
              : "bg-white/10 border-white/20"
          }`}
        >
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-white/80">
              {player.name}
            </span>
            <span className="text-white/60">
              Équipe {room.teams[player.teamId]?.name}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`text-lg font-bold ${
                player.role === "civil"
                  ? "text-green-400"
                  : player.role === "undercover"
                  ? "text-red-400"
                  : "text-yellow-400"
              }`}
            >
              {player.role}
            </span>
            {player.isEliminated && (
              <span className="text-red-400 font-medium">Éliminé</span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Vue pour les joueurs
  const PlayerView = () => (
    <div className="max-w-md mx-auto p-6 text-center space-y-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-blue-900/50 backdrop-blur-sm p-8 rounded-xl border border-blue-400"
      >
        <h2 className="text-3xl font-bold text-white mb-6">
          {gameData.civilsWin
            ? "Les Civils l'emportent !"
            : "Les Imposteurs l'emportent !"}
        </h2>
        <div className="space-y-6">
          <div className="text-xl text-white/80">
            Ton rôle était :{" "}
            {
              gameData.players.find(
                (p) => p.memberId === currentTeam?.members[0].name
              )?.role
            }
          </div>
        </div>
      </motion.div>

      {/* Afficher tous les rôles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20"
      >
        <h3 className="text-xl font-bold text-white mb-4">Tous les rôles :</h3>
        <div className="space-y-2">
          {gameData.players.map((player) => (
            <div
              key={player.memberId}
              className={`flex justify-between items-center p-2 rounded ${
                player.isEliminated
                  ? "bg-red-900/20 border border-red-500/30"
                  : "bg-white/5"
              }`}
            >
              <span className="text-white">{player.name}</span>
              <div className="flex items-center gap-3">
                <span
                  className={`${
                    player.role === "civil"
                      ? "text-green-400"
                      : player.role === "undercover"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {player.role}
                </span>
                {player.isEliminated && (
                  <span className="text-red-400">Éliminé</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {isHost ? <HostView /> : <PlayerView />}
    </div>
  );
}

export default function UndercoverResultsPage() {
  const { roomId } = useParams();
  return (
    <RoomProvider roomId={roomId as string}>
      <UndercoverResultsContent />
    </RoomProvider>
  );
}
