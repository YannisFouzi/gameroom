"use client";

import { RoomProvider, useRoom } from "@/contexts/RoomContext";
import { usePlayer } from "@/hooks/usePlayer";
import { useParams } from "next/navigation";

function GameContent() {
  const { room } = useRoom();
  const { playerId, isHost } = usePlayer(room?.id || "");

  if (!room || !playerId) return null;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Jeu en cours</h1>
      <div>
        {/* Contenu du jeu à implémenter selon le type de jeu */}
        <p>Type de jeu : {room.gameType}</p>
        <p>Mode : {room.settings.gameMode}</p>
      </div>
    </div>
  );
}

export default function GamePage() {
  const { roomId } = useParams();

  return (
    <RoomProvider roomId={roomId as string}>
      <GameContent />
    </RoomProvider>
  );
}
