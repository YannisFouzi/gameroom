import { roomService } from "@/lib/firebase/roomService";
import { Room } from "@/types/room";
import { useState } from "react";

type HostControlsProps = {
  room: Room;
};

export default function HostControls({ room }: HostControlsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isWaiting = room.status === "waiting";

  // Compte le nombre d'équipes qui ont au moins un membre
  const validTeamsCount = Object.values(room.teams).filter(
    (team) => team.members.length > 0
  ).length;

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
    <div className="space-y-6 p-4 border rounded-lg bg-gradient-to-r from-purple-600 to-pink-600">
      <div className="space-y-4">
        {isWaiting && (
          <button
            onClick={handleStartGame}
            disabled={validTeamsCount < 2 || isUpdating}
            className="w-full bg-white/10 backdrop-blur-sm text-white py-2 px-4 rounded-md hover:bg-white/20 disabled:opacity-50 transition-all duration-200"
          >
            {isUpdating ? "Démarrage..." : "Démarrer la partie"}
          </button>
        )}
      </div>
    </div>
  );
}
