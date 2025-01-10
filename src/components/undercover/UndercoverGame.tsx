"use client";

import { useRoom } from "@/contexts/RoomContext";
import { usePlayer } from "@/hooks/usePlayer";
import { UndercoverGameData } from "@/types/undercover";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DistributionPhase from "./DistributionPhase";
import PlayingPhase from "./PlayingPhase";
import ResultsPhase from "./ResultsPhase";
import VotingPhase from "./VotingPhase";

export default function UndercoverGame() {
  const router = useRouter();
  const { room } = useRoom();
  const { isHost, teamId } = usePlayer(room?.id || "");
  const gameData = room?.gameData?.undercover as UndercoverGameData;

  useEffect(() => {
    if (room?.gamePhase === "undercover-results") {
      router.push(`/room/${room.id}/undercover-results`);
    }
  }, [room?.gamePhase, room?.id, router]);

  if (!room || !gameData) return null;

  const currentTeam = teamId ? room.teams[teamId] : null;

  // Afficher la phase appropriée
  switch (gameData.currentPhase) {
    case "distribution":
      return (
        <DistributionPhase
          gameData={gameData}
          isHost={isHost}
          currentTeam={currentTeam}
          teamId={teamId}
          roomId={room.id}
        />
      );

    case "playing":
      return (
        <PlayingPhase
          gameData={gameData}
          isHost={isHost}
          currentTeam={currentTeam}
          teamId={teamId}
          roomId={room.id}
        />
      );

    case "voting":
      return (
        <VotingPhase
          gameData={gameData}
          isHost={isHost}
          currentTeam={currentTeam}
          teamId={teamId}
          teams={room.teams}
          roomId={room.id}
        />
      );

    case "results":
      return (
        <ResultsPhase
          gameData={gameData}
          isHost={isHost}
          currentTeam={currentTeam}
          teamId={teamId}
          roomId={room.id}
        />
      );

    default:
      return null;
  }
}
