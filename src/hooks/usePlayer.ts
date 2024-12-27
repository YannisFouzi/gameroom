import { roomService } from "@/lib/firebase/roomService";
import { useEffect, useState } from "react";

export function usePlayer(roomId: string) {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    const checkPlayerStatus = async () => {
      try {
        const storedPlayerId = localStorage.getItem(`player_${roomId}`);
        if (storedPlayerId) {
          setPlayerId(storedPlayerId);

          // Vérifie si le joueur est l'hôte
          const room = await roomService.getRoom(roomId);
          setIsHost(room.hostId === storedPlayerId);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du statut:", error);
      }
    };

    checkPlayerStatus();
  }, [roomId]);

  const clearPlayer = () => {
    localStorage.removeItem(`player_${roomId}`);
    setPlayerId(null);
    setIsHost(false);
  };

  return {
    playerId,
    isHost,
    clearPlayer,
  };
}
