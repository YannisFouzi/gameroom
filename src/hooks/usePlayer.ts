import { roomService } from "@/lib/firebase/roomService";
import { useEffect, useState } from "react";

export function usePlayer(roomId: string) {
  const [teamId, setTeamId] = useState<string | null>(null);
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

        // Sinon vérifier si c'est une équipe
        const storedTeamId = localStorage.getItem(`team_${roomId}`);
        if (storedTeamId) {
          setTeamId(storedTeamId);

          // Vérifier si l'équipe existe toujours dans la room
          const room = await roomService.getRoom(roomId);
          if (!room.teams[storedTeamId]) {
            localStorage.removeItem(`team_${roomId}`);
            localStorage.removeItem(`device_${roomId}`);
            setTeamId(null);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du statut:", error);
      }
    };

    checkPlayerStatus();
  }, [roomId]);

  const clearPlayer = () => {
    localStorage.removeItem(`team_${roomId}`);
    localStorage.removeItem(`device_${roomId}`);
    localStorage.removeItem(`host_${roomId}`);
    setTeamId(null);
    setIsHost(false);
  };

  return {
    teamId,
    isHost,
    clearPlayer,
  };
}
