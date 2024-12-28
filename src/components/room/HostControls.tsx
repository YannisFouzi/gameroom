import { roomService } from "@/lib/firebase/roomService";
import { GameType, Room } from "@/types/room";
import { useState } from "react";

type HostControlsProps = {
  room: Room;
};

export default function HostControls({ room }: HostControlsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isWaiting = room.status === "waiting";
  const isPlaying = room.status === "playing";

  const handleGameModeChange = async (mode: "team" | "individual") => {
    try {
      setIsUpdating(true);
      await roomService.updateGameMode(room.id, mode);
    } catch (error) {
      console.error("Erreur lors du changement de mode:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleGameTypeChange = async (gameType: string) => {
    try {
      setIsUpdating(true);
      await roomService.updateGameType(room.id, gameType as GameType);
    } catch (error) {
      console.error("Erreur lors du changement de jeu:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStartGame = async () => {
    try {
      setIsUpdating(true);
      await roomService.updateRoomStatus(room.id, "selecting");
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
          <div>
            <h3 className="text-lg mb-2">Mode de jeu</h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleGameModeChange("individual")}
                disabled={isUpdating}
                className={`px-4 py-2 rounded-md ${
                  room.settings.gameMode === "individual"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Individuel
              </button>
              <button
                onClick={() => handleGameModeChange("team")}
                disabled={isUpdating}
                className={`px-4 py-2 rounded-md ${
                  room.settings.gameMode === "team"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Équipes
              </button>
            </div>
          </div>
        )}

        {isPlaying && (
          <div>
            <h3 className="text-lg mb-2">Type de jeu</h3>
            <select
              value={room.gameType || ""}
              onChange={(e) => handleGameTypeChange(e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={isUpdating}
            >
              <option value="">Sélectionnez un jeu</option>
              <option value="undercover">Undercover</option>
              <option value="millionaire">Qui veut gagner des millions</option>
              <option value="other">Autre</option>
            </select>
          </div>
        )}

        {isWaiting && (
          <button
            onClick={handleStartGame}
            disabled={Object.keys(room.teams).length < 2}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            Démarrer la partie
          </button>
        )}
      </div>
    </div>
  );
}
