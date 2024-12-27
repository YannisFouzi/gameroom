import { roomService } from "@/lib/firebase/roomService";
import { useEffect, useState } from "react";

export function usePlayer(roomId: string) {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    const checkPlayerStatus = async () => {
      try {
        // Vérifier d'abord si c'est l'hôte
        const hostId = localStorage.getItem(`host_${roomId}`);
        if (hostId) {
          setIsHost(true);
          return;
        }

        // Sinon vérifier si c'est un joueur
        const storedPlayerId = localStorage.getItem(`player_${roomId}`);
        if (storedPlayerId) {
          setPlayerId(storedPlayerId);

          // Vérifier si le joueur existe toujours dans la room
          const room = await roomService.getRoom(roomId);
          if (!room.players[storedPlayerId]) {
            localStorage.removeItem(`player_${roomId}`);
            setPlayerId(null);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du statut:", error);
      }
    };

    checkPlayerStatus();
  }, [roomId]);

  const clearPlayer = () => {
    localStorage.removeItem(`player_${roomId}`);
    localStorage.removeItem(`host_${roomId}`);
    setPlayerId(null);
    setIsHost(false);
  };

  return {
    playerId,
    isHost,
    clearPlayer,
  };
}
