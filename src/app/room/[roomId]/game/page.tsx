"use client";

import { ExplanationPhase } from "@/components/ratDeStar/ExplanationPhase";
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

function GameContent() {
  const router = useRouter();
  const { room } = useRoom();
  const { teamId, isHost } = usePlayer(room?.id || "");

  useEffect(() => {
    if (room?.gamePhase === "millionaire-rules") {
      router.push(`/room/${room.id}/millionaire-rules`);
    }
  }, [room?.gamePhase, room?.id, router]);

  if (!room || !room.gameData) return null;

  const handleStartMemorization = async () => {
    if (!room) return;
    await ratDeStarService.startMemorizationPhase(room.id);
  };

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

  const isCurrentTeam =
    room.gameData.remainingTeams[room.gameData.currentTeamIndex] === teamId;

  switch (room.gamePhase) {
    case "explanation":
      return (
        <ExplanationPhase
          isHost={isHost}
          onStart={handleStartMemorization}
          room={room}
          teamId={teamId}
        />
      );

    case "memorization":
      if (!room.gameData.celebrities) return null;
      return (
        <MemorizationPhase
          celebrities={room.gameData.celebrities}
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
        />
      );

    case "results":
      if (!room.gameData.celebrities) return null;
      return (
        <ResultsPhase
          celebrities={room.gameData.celebrities}
          teams={room.teams}
          remainingTeams={room.gameData.remainingTeams}
          isHost={isHost}
          onNextGame={handleNextGame}
        />
      );

    default:
      return null;
  }
}

export default function GamePage() {
  const { roomId } = useParams();

  return (
    <RoomProvider roomId={roomId as string}>
      <GameContent />
    </RoomProvider>
  );
}
