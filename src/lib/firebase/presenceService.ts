import { Player, Room } from "@/types/room";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "./config";

export const presenceService = {
  async initializePresence(roomId: string, playerId: string) {
    const playerRef = doc(db, "rooms", roomId);

    // Mettre à jour le statut du joueur quand il se connecte
    await updateDoc(playerRef, {
      [`players.${playerId}.isOnline`]: true,
      [`players.${playerId}.lastSeen`]: serverTimestamp(),
    });

    // Gérer la déconnexion
    window.addEventListener("beforeunload", async () => {
      await updateDoc(playerRef, {
        [`players.${playerId}.isOnline`]: false,
        [`players.${playerId}.lastSeen`]: serverTimestamp(),
      });
    });

    // Vérifier périodiquement la connexion
    setInterval(async () => {
      const docSnap = await getDoc(playerRef);
      if (docSnap.exists()) {
        await updateDoc(playerRef, {
          [`players.${playerId}.lastSeen`]: serverTimestamp(),
        });
      }
    }, 30000); // Toutes les 30 secondes
  },

  async cleanupInactivePlayers(roomId: string, inactiveTimeout: number = 5) {
    const now = new Date();
    const roomRef = doc(db, "rooms", roomId);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) return;

    const data = roomSnap.data() as Room;
    const players = { ...data.players };
    let hasChanges = false;

    // Vérifier chaque joueur
    Object.entries(players).forEach(([playerId, player]: [string, Player]) => {
      if (!player.lastSeen) return; // Skip si lastSeen n'existe pas

      const lastSeenDate = player.lastSeen.toDate();
      const minutesSinceLastSeen =
        (now.getTime() - lastSeenDate.getTime()) / 60000;

      if (!player.isOnline && minutesSinceLastSeen > inactiveTimeout) {
        delete players[playerId];
        hasChanges = true;
      }
    });

    // Si des changements ont été effectués, mettre à jour la room
    if (hasChanges) {
      await updateDoc(roomRef, {
        players,
        updatedAt: serverTimestamp(),
      });
    }
  },
};
