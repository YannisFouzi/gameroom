"use client";

import { RoomProvider, useRoom } from "@/contexts/RoomContext";
import { usePlayer } from "@/hooks/usePlayer";
import { useParams } from "next/navigation";

function GameContent() {
  const { room } = useRoom();
  const { teamId, isHost } = usePlayer(room?.id || "");

  if (!room) return null;

  const currentTeam = teamId ? room.teams[teamId] : null;

  if (isHost) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mb-6">
          JEU {room.currentGame}
        </h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        JEU {room.currentGame}
      </h1>

      {currentTeam && (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">{currentTeam.name}</h2>
          <div className="flex items-center gap-4 mb-4">
            <img
              src={currentTeam.avatar}
              alt={currentTeam.name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <p className="text-sm text-gray-600">Membres :</p>
              <p className="font-medium">
                {currentTeam.members.map((m) => m.name).join(", ")}
              </p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Score actuel</p>
            <p className="text-3xl font-bold">{currentTeam.score}</p>
          </div>
        </div>
      )}
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
