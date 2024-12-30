"use client";

import HostControls from "@/components/room/HostControls";
import RoomQRCode from "@/components/room/RoomQRCode";
import ScoreBoard from "@/components/room/ScoreBoard";
import TeamManager from "@/components/room/TeamManager";
import { RoomProvider, useRoom } from "@/contexts/RoomContext";
import { usePlayer } from "@/hooks/usePlayer";
import { usePresence } from "@/hooks/usePresence";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

function RoomContent() {
  const { roomId } = useParams();
  const { room, loading, error } = useRoom();
  const { teamId, isHost } = usePlayer(roomId as string);
  const router = useRouter();
  usePresence(roomId as string);

  useEffect(() => {
    if (room?.status === "playing") {
      router.push(`/room/${room.id}/game`);
    }
  }, [room?.status, room?.id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error || "Room introuvable"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="max-w-2xl w-full space-y-8">
          {/* Contrôles de l'hôte en haut */}
          {isHost && <HostControls room={room} />}

          {/* Liste des équipes au centre */}
          <ScoreBoard room={room} teamId={teamId} isHost={isHost} />
          <TeamManager room={room} showCreateTeam={false} />

          {/* QR Code en bas */}
          <div className="mt-8">
            <RoomQRCode roomId={roomId as string} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RoomPage() {
  const { roomId } = useParams();

  return (
    <RoomProvider roomId={roomId as string}>
      <RoomContent />
    </RoomProvider>
  );
}
