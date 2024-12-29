"use client";

import { RoomProvider, useRoom } from "@/contexts/RoomContext";
import { usePlayer } from "@/hooks/usePlayer";
import { roomService } from "@/lib/firebase/roomService";
import { GameType, Room } from "@/types/room";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

// Composant pour la vue des joueurs
function PlayerView({
  room,
  currentPlayerId,
}: {
  room: Room;
  currentPlayerId: string;
}) {
  const currentPlayer = room.players[currentPlayerId];
  const playerTeam =
    room.teams && currentPlayer.teamId
      ? room.teams[currentPlayer.teamId]
      : null;

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg border p-6 space-y-4">
        <div className="text-center">
          <img
            src={currentPlayer.avatar}
            alt={currentPlayer.name}
            className="w-20 h-20 rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-bold">{currentPlayer.name}</h2>
          {playerTeam ? (
            <>
              <p className="text-gray-600 mt-2">Équipe : {playerTeam.name}</p>
              <div className="mt-4">
                <h3 className="font-medium mb-2">Coéquipiers :</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {playerTeam.players
                    .filter((pid) => pid !== currentPlayerId)
                    .map((pid) => {
                      const teammate = room.players[pid];
                      return (
                        <div
                          key={pid}
                          className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                        >
                          <img
                            src={teammate.avatar}
                            alt={teammate.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <span>{teammate.name}</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-600 mt-2">Pas d'équipe assignée</p>
          )}
        </div>
        <div className="text-center mt-6">
          <p className="text-gray-500">
            En attente de la sélection du jeu par le maître du jeu...
          </p>
        </div>
      </div>
    </div>
  );
}

// Composant pour le contenu
function SelectGameContent() {
  const router = useRouter();
  const { roomId } = useParams();
  const { room } = useRoom();
  const { teamId, isHost } = usePlayer(roomId as string);
  const storedPlayerId = localStorage.getItem(`player_${roomId}`);
  const [isLoading, setIsLoading] = useState(false);

  // Ajout de logs pour le débogage
  console.log("Room:", room);
  console.log("PlayerId:", teamId);
  console.log("IsHost:", isHost);
  console.log(
    "Host ID from localStorage:",
    localStorage.getItem(`host_${roomId}`)
  );
  console.log(
    "Player ID from localStorage:",
    localStorage.getItem(`player_${roomId}`)
  );

  if (!room) {
    console.log("No room data");
    return <div>Chargement...</div>;
  }

  // Vérifier directement le localStorage pour l'hôte
  const hostId = localStorage.getItem(`host_${roomId}`);
  if (hostId && room.hostId === hostId) {
    // Vue de l'hôte
    const games = [
      {
        id: "undercover" as GameType,
        title: "Undercover",
        description: "Trouvez l'imposteur parmi les joueurs",
        image: "/games/undercover.jpg",
      },
      {
        id: "millionaire" as GameType,
        title: "Qui veut gagner des millions",
        description: "Testez vos connaissances et gagnez gros",
        image: "/games/millionaire.jpg",
      },
    ];

    const handleSelectGame = async (gameType: GameType) => {
      try {
        setIsLoading(true);
        await roomService.updateGameType(roomId as string, gameType);
        await roomService.updateRoomStatus(roomId as string, "playing");
        router.push(`/room/${roomId}/game`);
      } catch (error) {
        console.error("Erreur lors de la sélection du jeu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Sélectionnez un jeu</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => handleSelectGame(game.id)}
              disabled={isLoading}
              className="bg-white p-6 rounded-lg border hover:border-blue-500 transition-colors"
            >
              <div className="aspect-video relative mb-4">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
              <p className="text-gray-600">{game.description}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Si ce n'est pas l'hôte et qu'on a un playerId
  if (storedPlayerId && room.players[storedPlayerId]) {
    return <PlayerView room={room} currentPlayerId={storedPlayerId} />;
  }

  return <div>Accès non autorisé</div>;
}

// Composant principal avec le Provider
export default function SelectGamePage() {
  const { roomId } = useParams();

  return (
    <RoomProvider roomId={roomId as string}>
      <SelectGameContent />
    </RoomProvider>
  );
}
