"use client";

import { GuessingPhase } from "@/components/ratDeStar/GuessingPhase";
import { MemorizationPhase } from "@/components/ratDeStar/MemorizationPhase";
import { ResultsPhase } from "@/components/ratDeStar/ResultsPhase";
import { RoomProvider, useRoom } from "@/contexts/RoomContext";
import { usePlayer } from "@/hooks/usePlayer";
import {
  gameTransitionService,
  ratDeStarService,
} from "@/lib/firebase/services";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

function RatDeStarContent() {
  const router = useRouter();
  const { room } = useRoom();
  const { isHost, teamId } = usePlayer(room?.id || "");

  const handleGuess = async (guess: string): Promise<boolean> => {
    if (!room || !teamId) return false;
    try {
      return await ratDeStarService.submitGuess(room.id, teamId, guess);
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      return false;
    }
  };

  const handleNextGame = async () => {
    if (!room) return;
    await gameTransitionService.startNextGame(room.id);
  };

  useEffect(() => {
    if (room?.gamePhase === "millionaire-rules") {
      router.push(`/room/${room.id}/millionaire-rules`);
    }
  }, [room?.gamePhase, room?.id, router]);

  if (!room || !room.gameData) return null;

  const isCurrentTeam =
    room.gameData.remainingTeams[room.gameData.currentTeamIndex] === teamId;

  switch (room.gamePhase) {
    case "memorization":
      return (
        <MemorizationPhase
          celebrities={room.gameData.celebrities || {}}
          startTime={room.gameData.startTime || Date.now()}
          isHost={isHost}
          room={room}
          teamId={teamId}
        />
      );

    case "guessing":
      return (
        <GuessingPhase
          isCurrentTeam={isCurrentTeam}
          onSubmit={handleGuess}
          room={room}
          teamId={teamId}
          isHost={isHost}
        />
      );

    case "results":
      return (
        <ResultsPhase
          celebrities={room.gameData.celebrities || {}}
          teams={room.teams}
          remainingTeams={room.gameData.remainingTeams}
          isHost={isHost}
          onNextGame={handleNextGame}
          teamId={teamId}
        />
      );

    default:
      return null;
  }
}

export default function RatDeStarPage() {
  const { roomId } = useParams();
  return (
    <RoomProvider roomId={roomId as string}>
      <RatDeStarContent />
    </RoomProvider>
  );
}
