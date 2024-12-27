"use client";

import HostControls from "@/components/room/HostControls";
import RoomQRCode from "@/components/room/RoomQRCode";
import ScoreBoard from "@/components/room/ScoreBoard";
import TeamManager from "@/components/room/TeamManager";
import { RoomProvider, useRoom } from "@/contexts/RoomContext";
import { usePlayer } from "@/hooks/usePlayer";
import { usePresence } from "@/hooks/usePresence";
import { useParams } from "next/navigation";

function RoomContent() {
  const { roomId } = useParams();
  const { room, loading, error } = useRoom();
  const { playerId, isHost } = usePlayer(roomId as string);
  usePresence(roomId as string);

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
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne de gauche: Contrôles et QR Code */}
        <div className="space-y-6">
          {isHost && <HostControls room={room} />}
          <RoomQRCode roomId={roomId as string} />
        </div>

        {/* Colonne centrale: Tableau des scores */}
        <div className="lg:col-span-2">
          <ScoreBoard room={room} playerId={playerId} isHost={isHost} />
          {room.settings.gameMode === "team" && <TeamManager room={room} />}
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
