import { presenceService } from "@/lib/firebase/presenceService";
import { useEffect } from "react";
import { usePlayer } from "./usePlayer";

export function usePresence(roomId: string) {
  const { playerId } = usePlayer(roomId);

  useEffect(() => {
    if (!playerId || !roomId) return;

    // Initialiser la présence quand le joueur rejoint
    presenceService.initializePresence(roomId, playerId);

    // Nettoyer les joueurs inactifs toutes les minutes
    const cleanup = setInterval(() => {
      presenceService.cleanupInactivePlayers(roomId);
    }, 60000);

    return () => {
      clearInterval(cleanup);
    };
  }, [roomId, playerId]);
}
