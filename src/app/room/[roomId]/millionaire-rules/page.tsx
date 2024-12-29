"use client";

import { RoomProvider, useRoom } from "@/contexts/RoomContext";
import { usePlayer } from "@/hooks/usePlayer";
import { roomService } from "@/lib/firebase/roomService";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

function MillionaireRulesContent() {
  const router = useRouter();
  const { room } = useRoom();
  const { isHost } = usePlayer(room?.id || "");
  const startingTeamName = room?.gameData?.winningTeamName || "";

  useEffect(() => {
    if (room?.gamePhase === "millionaire-playing") {
      router.push(`/room/${room.id}/millionaire`);
    }
  }, [room?.gamePhase, room?.id, router]);

  const handleStart = async () => {
    if (!room?.id) return;
    await roomService.startMillionaireGame(room.id);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">
        Qui veut gagner des millions - Règles du jeu
      </h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-lg font-semibold text-blue-800">
          L'équipe "{startingTeamName}" commence la partie !
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <p>1. Chaque équipe joue à tour de rôle</p>
        <p>2. Choisissez une catégorie parmi les 4 disponibles</p>
        <p>3. Répondez aux questions de difficulté croissante</p>
        <p>4. Les points gagnés augmentent avec la difficulté :</p>
        <ul className="list-disc pl-8">
          <li>Questions 1-5 : 1-2 points</li>
          <li>Questions 6-10 : 2-3 points</li>
          <li>Questions 11-15 : 3-4 points</li>
        </ul>
        <p>5. Une mauvaise réponse passe le tour à l'équipe suivante</p>
        <p>
          6. La catégorie utilisée devient indisponible pour les autres équipes
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

export default function MillionaireRulesPage() {
  const { roomId } = useParams();

  return (
    <RoomProvider roomId={roomId as string}>
      <MillionaireRulesContent />
    </RoomProvider>
  );
}
