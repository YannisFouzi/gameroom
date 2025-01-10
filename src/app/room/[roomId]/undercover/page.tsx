"use client";

import UndercoverGame from "@/components/undercover/UndercoverGame";
import { RoomProvider, useRoom } from "@/contexts/RoomContext";
import { usePlayer } from "@/hooks/usePlayer";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

function UndercoverContent() {
  const router = useRouter();
  const { room } = useRoom();
  const { isHost } = usePlayer(room?.id || "");

  useEffect(() => {
    if (room?.gamePhase === "undercover-results") {
      router.push(`/room/${room.id}/undercover-results`);
    }
  }, [room?.gamePhase, room?.id, router]);

  if (!room) return <div>Chargement...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <UndercoverGame />
    </div>
  );
}

export default function UnderCoverPage() {
  const { roomId } = useParams();

  return (
    <RoomProvider roomId={roomId as string}>
      <UndercoverContent />
    </RoomProvider>
  );
}
