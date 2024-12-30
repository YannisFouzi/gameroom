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

      <div className="space-y-4 mb-6">
        <p>1. Chaque équipe commence à la case 0 sur un plateau de 20 cases</p>
        <p>2. L'équipe qui joue tourne une roue pour déterminer le thème</p>
        <p>3. Une équipe adverse pose les questions selon le thème tiré</p>
        <p>4. L'équipe qui répond choisit un niveau de difficulté (1 à 5)</p>
        <p>5. Après chaque tour, la main passe à l'équipe suivante</p>
        <p>6. Le but est d'atteindre la case 20 en premier</p>
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
