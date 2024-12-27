"use client";

import { usePlayer } from "@/hooks/usePlayer";
import { roomService } from "@/lib/firebase/roomService";
import { GameType } from "@/types/room";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

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
  // Ajoutez d'autres jeux ici
];

export default function SelectGamePage() {
  const router = useRouter();
  const { roomId } = useParams();
  const { isHost } = usePlayer(roomId as string);
  const [isLoading, setIsLoading] = useState(false);

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

  if (!isHost) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          Accès non autorisé
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Sélectionnez un jeu</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => handleSelectGame(game.id)}
            disabled={isLoading}
            className="bg-background p-6 rounded-lg border hover:border-blue-500 transition-colors"
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
