"use client";

import { RoomProvider, useRoom } from "@/contexts/RoomContext";
import { usePlayer } from "@/hooks/usePlayer";
import { roomService } from "@/lib/firebase/roomService";
import { useParams, useRouter } from "next/navigation";

function RateYourselfRulesContent() {
  const router = useRouter();
  const { room } = useRoom();
  const { isHost } = usePlayer(room?.id || "");
  const winningTeamName = room?.gameData?.winningTeamName;

  const handleStart = async () => {
    if (!room?.id) return;
    await roomService.startRateYourselfGame(room.id);
    router.push(`/room/${room.id}/rate-yourself`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">
        Tu te mets combien ? - Règles du jeu
      </h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-lg font-semibold text-blue-800">
          L'équipe "{winningTeamName}" commence la partie !
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <p>1. L'équipe gagnante tourne la roue pour sélectionner un thème</p>
        <p>2. Une question est posée sur ce thème</p>
        <p>3. L'équipe doit s'auto-évaluer de 1 à 5</p>
        <p>4. Si la réponse est correcte :</p>
        <ul className="list-disc pl-8">
          <li>
            L'équipe avance du nombre de cases correspondant à son
            auto-évaluation
          </li>
        </ul>
        <p>5. Si la réponse est incorrecte :</p>
        <ul className="list-disc pl-8">
          <li>
            L'équipe recule du nombre de cases correspondant à son
            auto-évaluation
          </li>
        </ul>
        <p>6. La première équipe à atteindre la case 20 gagne la partie</p>
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

export default function RateYourselfRulesPage() {
  const { roomId } = useParams();

  return (
    <RoomProvider roomId={roomId as string}>
      <RateYourselfRulesContent />
    </RoomProvider>
  );
}
