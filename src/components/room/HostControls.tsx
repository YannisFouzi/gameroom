import { roomService } from "@/lib/firebase/roomService";
import { Room } from "@/types/room";
import { useState } from "react";

type HostControlsProps = {
  room: Room;
};

export default function HostControls({ room }: HostControlsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isWaiting = room.status === "waiting";

  const handleStartGame = async () => {
    try {
      setIsUpdating(true);
      await roomService.startGame(room.id);
    } catch (error) {
      console.error("Erreur lors du démarrage de la partie:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 p-4 border rounded-lg">
      <h2 className="text-xl font-semibold">Contrôles du maître du jeu</h2>

      <div className="space-y-4">
        {isWaiting && (
          <button
            onClick={handleStartGame}
            disabled={Object.keys(room.teams).length < 2 || isUpdating}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isUpdating ? "Démarrage..." : "Démarrer la partie"}
          </button>
        )}
      </div>
    </div>
  );
}
