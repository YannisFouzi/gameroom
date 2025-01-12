"use client";

import ScoreDisplay from "@/components/undercover/ScoreDisplay";
import { RoomProvider, useRoom } from "@/contexts/RoomContext";
import { usePlayer } from "@/hooks/usePlayer";
import { db } from "@/lib/firebase/config";
import { undercoverService } from "@/lib/firebase/services/undercoverService";
import { UndercoverGameData } from "@/types/undercover";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

function UndercoverResultsContent() {
  const router = useRouter();
  const { room } = useRoom();
  const { isHost, teamId } = usePlayer(room?.id || "");
  const gameData = room?.gameData?.undercover as UndercoverGameData;
  const isTeamReady = teamId && gameData.teamsReady?.includes(teamId);

  useEffect(() => {
    if (room?.gamePhase === "undercover-playing") {
      router.push(`/room/${room.id}/undercover`);
    }
  }, [room?.gamePhase, room?.id, router]);

  useEffect(() => {
    if (room?.gamePhase === "final-scores") {
      router.push(`/room/${room.id}/final-scores`);
    }
  }, [room?.gamePhase, room?.id, router]);

  const handleTeamReady = async () => {
    if (!teamId || !room) return;
    await undercoverService.teamReadyForNextGame(room.id, teamId);
  };

  const handleNextGame = async () => {
    if (!room) return;

    // Si c'est la dernière partie, mettre à jour les scores et rediriger
    if (gameData.isLastGame) {
      await updateDoc(doc(db, "rooms", room.id), {
        gamePhase: "final-scores",
        "gameData.scores": {
          ...room.gameData?.scores,
          undercover: gameData.scores,
        },
        updatedAt: serverTimestamp(),
      });
      router.push(`/room/${room.id}/final-scores`);
    } else {
      // Sinon démarrer une nouvelle partie
      await undercoverService.startNextRound(room.id);
    }
  };

  if (!room || !gameData) return <div>Chargement...</div>;

  const currentTeam = teamId ? room.teams[teamId] : null;

  // Vue pour l'hôte
  const HostView = () => (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl p-8 text-center shadow-[0_0_30px_rgba(251,191,36,0.3)]"
      >
        <h3 className="text-3xl font-extrabold mb-6">
          🏆{" "}
          {gameData.winningTeamId
            ? `L'équipe ${
                room.teams[gameData.winningTeamId].name
              } gagne cette partie !`
            : "Match nul"}
        </h3>
      </motion.div>

      {/* Liste des équipes et leurs joueurs */}
      <div className="grid grid-cols-2 gap-6">
        {Object.entries(room.teams).map(([teamId, team], teamIndex) => (
          <motion.div
            key={teamId}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: teamIndex * 0.2 }}
            className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20"
          >
            <div className="flex items-center gap-4 mb-4">
              <img src={team.avatar} alt="" className="w-12 h-12" />
              <h3 className="text-2xl font-bold text-white">{team.name}</h3>
            </div>

            <div className="space-y-3">
              {gameData.players
                .filter((player) => player.teamId === teamId)
                .map((player, index) => (
                  <motion.div
                    key={player.memberId}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      player.isEliminated
                        ? "bg-red-900/20 border border-red-500/30"
                        : "bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-white/80">
                        {player.name}
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
                        <span className="text-red-400 font-medium">
                          Éliminé
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Ajouter le bouton des scores finaux pour l'hôte */}
      {gameData.isLastGame && (
        <button
          onClick={handleNextGame}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-xl font-bold text-xl hover:opacity-90 transition-all"
        >
          Voir les scores finaux →
        </button>
      )}
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
        <h2 className="text-3xl font-bold text-white">
          {gameData.winningTeamId
            ? `L'équipe ${room.teams[gameData.winningTeamId].name} gagne !`
            : "Match nul"}
        </h2>
      </motion.div>

      {/* Afficher les rôles de l'équipe */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20"
      >
        <div className="flex items-center gap-4 mb-4">
          <img src={currentTeam?.avatar} alt="" className="w-12 h-12" />
          <h3 className="text-2xl font-bold text-white">{currentTeam?.name}</h3>
        </div>

        <div className="space-y-2">
          {gameData.players
            .filter((player) => player.teamId === teamId)
            .map((player) => (
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

      {/* Ne pas afficher le bouton "Partie suivante" si c'est la dernière partie */}
      {!isHost && !isTeamReady && !gameData.isLastGame && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-8"
        >
          <button
            onClick={handleTeamReady}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-bold text-lg hover:opacity-90 transition-all"
          >
            Partie suivante
          </button>
        </motion.div>
      )}

      {!isHost && isTeamReady && !gameData.isLastGame && (
        <div className="text-center mt-8 text-white/80">
          En attente des autres équipes...
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Scores en haut */}
        {isHost && room.teams && (
          <div className="w-full">
            <ScoreDisplay scores={gameData.scores} teams={room.teams} />
          </div>
        )}

        {/* Contenu principal */}
        <div className="w-full">{isHost ? <HostView /> : <PlayerView />}</div>
      </div>
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
