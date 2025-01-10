"use client";

import { useRoom } from "@/contexts/RoomContext";
import { Team } from "@/types/room";
import { UndercoverGameData } from "@/types/undercover";
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
      {isHost && room.teams && (
        <ScoreDisplay scores={gameData.scores} teams={room.teams} />
      )}

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
  );
}
