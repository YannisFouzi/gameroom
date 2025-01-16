"use client";

import { ExplanationPhase } from "@/components/ratDeStar/ExplanationPhase";
import { RoomProvider, useRoom } from "@/contexts/RoomContext";
import { usePlayer } from "@/hooks/usePlayer";
import { ratDeStarService } from "@/lib/firebase/services";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

function RatDeStarRulesContent() {
  const router = useRouter();
  const { room } = useRoom();
  const { isHost, teamId } = usePlayer(room?.id || "");

  useEffect(() => {
    if (room?.gamePhase === "rat-de-star") {
      router.push(`/room/${room.id}/rat-de-star`);
    }
  }, [room?.gamePhase, room?.id, router]);

  const handleStart = async () => {
    if (!room?.id) return;
    try {
      await ratDeStarService.startMemorizationPhase(room.id);
      router.push(`/room/${room.id}/rat-de-star`);
    } catch (error) {
      console.error("Erreur lors du démarrage du jeu:", error);
    }
  };

  if (!room) return null;

  return (
    <ExplanationPhase
      isHost={isHost}
      onStart={handleStart}
      room={room}
      teamId={teamId}
    />
  );
}

export default function RatDeStarRulesPage() {
  const { roomId } = useParams();
  return (
    <RoomProvider roomId={roomId as string}>
      <RatDeStarRulesContent />
    </RoomProvider>
  );
}
