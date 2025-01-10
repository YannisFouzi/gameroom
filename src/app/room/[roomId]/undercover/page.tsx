"use client";

import UndercoverGame from "@/components/undercover/UndercoverGame";
import { RoomProvider, useRoom } from "@/contexts/RoomContext";
import { usePlayer } from "@/hooks/usePlayer";
import { UndercoverGameData } from "@/types/undercover";
import { useParams } from "next/navigation";

function UndercoverContent() {
  const { room } = useRoom();
  const { isHost, teamId } = usePlayer(room?.id || "");
  const gameData = room?.gameData?.undercover as UndercoverGameData;
  const currentTeam = teamId && room?.teams ? room.teams[teamId] : null;

  if (!room || !gameData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <UndercoverGame
        gameData={gameData}
        isHost={isHost}
        currentTeam={currentTeam}
        teamId={teamId}
        roomId={room.id}
      />
    </div>
  );
}

export default function UndercoverPage() {
  const { roomId } = useParams();

  return (
    <RoomProvider roomId={roomId as string}>
      <UndercoverContent />
    </RoomProvider>
  );
}
