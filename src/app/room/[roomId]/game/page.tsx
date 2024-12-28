"use client";

import { RoomProvider, useRoom } from "@/contexts/RoomContext";
import { usePlayer } from "@/hooks/usePlayer";
import { roomService } from "@/lib/firebase/roomService";
import { Celebrity, Team } from "@/types/room";
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
  onSubmit: (guess: string) => Promise<boolean>;
}) {
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim()) {
      try {
        const isCorrect = await onSubmit(guess);
        setFeedback({
          type: isCorrect ? "success" : "error",
          message: isCorrect
            ? "Bonne réponse ! Continuez !"
            : "Mauvaise réponse... Votre équipe est éliminée.",
        });
        setGuess("");

        setTimeout(() => {
          setFeedback(null);
        }, 3000);
      } catch (error) {
        console.error("Erreur lors de la soumission:", error);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Phase de devinettes</h2>
      {isCurrentTeam ? (
        <>
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
          {feedback && (
            <div
              className={`mt-4 p-4 rounded-lg text-center ${
                feedback.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {feedback.message}
            </div>
          )}
        </>
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
  teams,
  remainingTeams,
  isHost,
  onNextGame,
}: {
  celebrities: Record<string, Celebrity>;
  teams: Record<string, Team>;
  remainingTeams: string[];
  isHost: boolean;
  onNextGame: () => void;
}) {
  const winningTeam = teams[remainingTeams[0]];

  return (
    <div className="container mx-auto p-4">
      <div className="mb-12 text-center">
        <div className="inline-block bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-white mb-4">
            🏆 Équipe Gagnante 🏆
          </h2>
          <div className="flex items-center justify-center gap-4 mb-4">
            <img
              src={winningTeam.avatar}
              alt={winningTeam.name}
              className="w-16 h-16 rounded-full border-4 border-white"
            />
            <div>
              <div className="text-2xl font-bold text-white">
                {winningTeam.name}
              </div>
              <div className="text-sm text-yellow-100">
                {winningTeam.members.map((member) => member.name).join(", ")}
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-center">
        Récapitulatif des trouvailles
      </h2>
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
                Trouvé par {teams[celebrity.foundBy]?.name || "équipe inconnue"}
              </div>
            )}
          </div>
        ))}
      </div>

      {isHost && (
        <div className="mt-8 text-center">
          <button
            onClick={onNextGame}
            className="bg-blue-600 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Passer au jeu suivant : Qui veut gagner des millions
          </button>
        </div>
      )}
    </div>
  );
}

function MillionaireRulesPhase({
  isHost,
  startingTeamName,
  onStart,
}: {
  isHost: boolean;
  startingTeamName: string;
  onStart: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">
        Qui veut gagner des millions - Règles du jeu
      </h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-lg font-semibold text-blue-800">
          L'équipe "{startingTeamName}" commence la partie !
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <p>1. Chaque équipe joue à tour de rôle</p>
        <p>2. Une question est posée avec 4 réponses possibles</p>
        <p>3. L'équipe a 30 secondes pour répondre</p>
        <p>4. Une bonne réponse rapporte des points selon le palier :</p>
        <ul className="list-disc pl-8">
          <li>Question 1-5 : 100 points</li>
          <li>Question 6-10 : 200 points</li>
          <li>Question 11-15 : 500 points</li>
        </ul>
        <p>5. Une mauvaise réponse ne fait pas perdre de points</p>
        <p>6. Le jeu se termine après 15 questions</p>
      </div>

      {isHost && (
        <button
          onClick={onStart}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700"
        >
          Commencer le jeu
        </button>
      )}
    </div>
  );
}

function GameContent() {
  const { room } = useRoom();
  const { teamId, isHost } = usePlayer(room?.id || "");

  if (!room || !room.gameData) return null;

  const handleStartMemorization = async () => {
    if (!room) return;
    await roomService.startMemorizationPhase(room.id);
  };

  const handleGuess = async (guess: string): Promise<boolean> => {
    if (!room || !teamId) return false;
    try {
      return await roomService.submitGuess(room.id, teamId, guess);
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      return false;
    }
  };

  const handleNextGame = async () => {
    if (!room) return;
    await roomService.startNextGame(room.id);
  };

  const handleStartMillionaire = async () => {
    if (!room) return;
    await roomService.startMillionaireGame(room.id);
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
      return (
        <ResultsPhase
          celebrities={room.gameData.celebrities}
          teams={room.teams}
          remainingTeams={room.gameData.remainingTeams}
          isHost={isHost}
          onNextGame={handleNextGame}
        />
      );

    case "millionaire-rules":
      if (!room.gameData.startingTeam) return null;
      return (
        <MillionaireRulesPhase
          isHost={isHost}
          startingTeamName={room.teams[room.gameData.startingTeam].name}
          onStart={handleStartMillionaire}
        />
      );

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
