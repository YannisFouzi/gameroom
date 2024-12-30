"use client";

import { RoomProvider, useRoom } from "@/contexts/RoomContext";
import { usePlayer } from "@/hooks/usePlayer";
import { roomService } from "@/lib/firebase/roomService";
import { useParams, useRouter } from "next/navigation";

function EvaluationRulesContent() {
  const router = useRouter();
  const { room } = useRoom();
  const { isHost } = usePlayer(room?.id || "");
  const winningTeamName = room?.gameData?.winningTeamName || "";

  const handleStart = async () => {
    if (!room?.id) return;
    await roomService.startEvaluationGame(room.id);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Tu te mets combien ? - Règles</h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-lg font-semibold text-blue-800">
          L'équipe "{winningTeamName}" commence la partie !
        </p>
      </div>

      {isHost && (
        <button
          onClick={handleStart}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700"
        >
          Commencer le jeu
        </button>
      )}
    </div>
  );
}

export default function EvaluationRulesPage() {
  const { roomId } = useParams();

  return (
    <RoomProvider roomId={roomId as string}>
      <EvaluationRulesContent />
    </RoomProvider>
  );
}
