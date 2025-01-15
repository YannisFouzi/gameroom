"use client";

import { useRoom } from "@/contexts/RoomContext";
import { Team } from "@/types/room";
import { UndercoverGameData } from "@/types/undercover";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DistributionPhase from "./DistributionPhase";
import PlayingPhase from "./PlayingPhase";
import ResultsPhase from "./ResultsPhase";
import ScoreDisplay from "./ScoreDisplay";
import VotingPhase from "./VotingPhase";

type Props = {
  gameData: UndercoverGameData;
  isHost: boolean;
  currentTeam: Team | null;
  teamId: string | null;
  roomId: string;
};

export default function UndercoverGame({
  gameData,
  isHost,
  currentTeam,
  teamId,
  roomId,
}: Props) {
  const router = useRouter();
  const { room } = useRoom();

  useEffect(() => {
    if (room?.gamePhase === "undercover-results") {
      router.push(`/room/${room.id}/undercover-results`);
    }
  }, [room?.gamePhase, room?.id, router]);

  if (!room) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Section du haut avec scores et message */}
        {isHost && room.teams && (
          <div className="w-full space-y-8">
            <ScoreDisplay scores={gameData.scores} teams={room.teams} />
            {gameData.currentPhase === "distribution" && (
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl font-extrabold text-center bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent"
              >
                Découvrez vos mots !
              </motion.h1>
            )}
          </div>
        )}

        {/* Contenu principal du jeu */}
        <div className="w-full">
          {(() => {
            switch (gameData.currentPhase) {
              case "distribution":
                return (
                  <DistributionPhase
                    gameData={gameData}
                    isHost={isHost}
                    currentTeam={currentTeam}
                    teamId={teamId}
                    roomId={roomId}
                  />
                );
              case "playing":
                return (
                  <PlayingPhase
                    gameData={gameData}
                    isHost={isHost}
                    currentTeam={currentTeam}
                    teamId={teamId}
                    roomId={roomId}
                  />
                );
              case "voting":
                return (
                  <VotingPhase
                    gameData={gameData}
                    isHost={isHost}
                    currentTeam={currentTeam}
                    teamId={teamId}
                    roomId={roomId}
                    teams={room.teams}
                  />
                );
              case "results":
                return (
                  <ResultsPhase
                    gameData={gameData}
                    isHost={isHost}
                    currentTeam={currentTeam}
                    teamId={teamId}
                    roomId={roomId}
                  />
                );
              default:
                return null;
            }
          })()}
        </div>
      </div>
    </div>
  );
}
