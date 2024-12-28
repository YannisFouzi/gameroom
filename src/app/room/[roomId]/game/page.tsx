"use client";

import { RoomProvider, useRoom } from "@/contexts/RoomContext";
import { usePlayer } from "@/hooks/usePlayer";
import { roomService } from "@/lib/firebase/roomService";
import { Celebrity } from "@/types/room";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function ExplanationPhase({
  isHost,
  onStart,
}: {
  isHost: boolean;
  onStart: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Rat de Star - Règles du jeu</h2>
      <div className="space-y-4 mb-6">
        <p>1. Une mosaïque de célébrités va s'afficher pendant 1 minute</p>
        <p>2. Mémorisez un maximum de personnalités</p>
        <p>3. À tour de rôle, chaque équipe devra nommer une célébrité</p>
        <p>4. Si la réponse est correcte, l'équipe continue</p>
        <p>
          5. Si la réponse est incorrecte ou déjà donnée, l'équipe est éliminée
        </p>
        <p>6. Le jeu continue jusqu'à ce qu'il ne reste qu'une équipe</p>
      </div>
      {isHost && (
        <button
          onClick={onStart}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700"
        >
          Commencer
        </button>
      )}
    </div>
  );
}

function MemorizationPhase({
  celebrities,
  startTime,
  isHost,
}: {
  celebrities: Record<string, Celebrity>;
  startTime: number;
  isHost: boolean;
}) {
  const [timeLeft, setTimeLeft] = useState(10);
  const { room } = useRoom();

  useEffect(() => {
    const start = room?.gameData?.startTime;
    if (!start) return;

    if (timeLeft === 0) {
      if (isHost) {
        roomService.startGuessingPhase(room.id);
      }
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - start) / 1000);
      const remaining = Math.max(0, 10 - elapsed);
      setTimeLeft(remaining);
    }, 100);

    return () => clearInterval(interval);
  }, [timeLeft, room, isHost]);

  if (!isHost) {
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Mémorisation en cours</h2>
          <p className="text-xl">Regardez l'écran principal</p>
          <div className="mt-4 text-4xl font-bold">{timeLeft}s</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-6">
        <div className="text-4xl font-bold">{timeLeft}s</div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Object.entries(celebrities).map(([id, celebrity]) => (
          <div key={id} className="aspect-square">
            <img
              key={`img-${id}`}
              src={celebrity.imageUrl}
              alt="Célébrité"
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                console.error(
                  `Erreur de chargement de l'image: ${celebrity.imageUrl}`
                );
                e.currentTarget.src = "/ratDeStar/placeholder.jpg";
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function GuessingPhase({
  isCurrentTeam,
  onSubmit,
}: {
  isCurrentTeam: boolean;
  onSubmit: (guess: string) => void;
}) {
  const [guess, setGuess] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim()) {
      onSubmit(guess);
      setGuess("");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Phase de devinettes</h2>
      {isCurrentTeam ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            className="w-full p-3 border rounded-lg"
            placeholder="Nom de la célébrité"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Valider
          </button>
        </form>
      ) : (
        <p className="text-center">
          En attente de la réponse de l'équipe active...
        </p>
      )}
    </div>
  );
}

function ResultsPhase({
  celebrities,
}: {
  celebrities: Record<string, Celebrity>;
}) {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Résultats</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Object.entries(celebrities).map(([id, celebrity]) => (
          <div key={id} className="space-y-2">
            <img
              key={`img-${id}`}
              src={celebrity.imageUrl}
              alt={celebrity.name}
              className="w-full aspect-square object-cover rounded-lg"
            />
            {celebrity.foundBy && (
              <div
                key={`found-${id}`}
                className="text-sm text-center text-green-600"
              >
                Trouvé par équipe {celebrity.foundBy}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function GameContent() {
  const { room } = useRoom();
  const { teamId, isHost } = usePlayer(room?.id || "");

  if (!room || !room.gameData) return null;

  const handleStartMemorization = async () => {
    await roomService.startMemorizationPhase(room.id);
  };

  const handleGuess = async (guess: string) => {
    if (teamId) {
      await roomService.submitGuess(room.id, teamId, guess);
    }
  };

  const isCurrentTeam =
    room.gameData.remainingTeams[room.gameData.currentTeamIndex] === teamId;

  switch (room.gamePhase) {
    case "explanation":
      return (
        <ExplanationPhase isHost={isHost} onStart={handleStartMemorization} />
      );

    case "memorization":
      return (
        <MemorizationPhase
          celebrities={room.gameData.celebrities}
          startTime={room.gameData.startTime || Date.now()}
          isHost={isHost}
        />
      );

    case "guessing":
      return (
        <GuessingPhase isCurrentTeam={isCurrentTeam} onSubmit={handleGuess} />
      );

    case "results":
      return <ResultsPhase celebrities={room.gameData.celebrities} />;

    default:
      return null;
  }
}

export default function GamePage() {
  const { roomId } = useParams();

  return (
    <RoomProvider roomId={roomId as string}>
      <GameContent />
    </RoomProvider>
  );
}
