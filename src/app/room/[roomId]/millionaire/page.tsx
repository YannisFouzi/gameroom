"use client";

import CategorySelector from "@/components/millionaire/CategorySelector";
import QuestionDisplay from "@/components/millionaire/QuestionDisplay";
import ScoreDisplay from "@/components/millionaire/ScoreDisplay";
import { RoomProvider, useRoom } from "@/contexts/RoomContext";
import { millionaireQuestions } from "@/data/millionaireQuestions";
import { usePlayer } from "@/hooks/usePlayer";
import { roomService } from "@/lib/firebase/roomService";
import { MillionaireCategory, MillionaireGameData } from "@/types/millionaire";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

function MillionaireContent() {
  const router = useRouter();
  const { room } = useRoom();
  const { teamId, isHost } = usePlayer(room?.id || "");

  const gameData: MillionaireGameData = {
    currentTeamIndex: room?.gameData?.currentTeamIndex || 0,
    remainingTeams: room?.gameData?.remainingTeams || [],
    startingTeam: room?.gameData?.startingTeam || "",
    currentCategory: room?.gameData?.currentCategory,
    currentQuestionIndex: room?.gameData?.currentQuestionIndex || 0,
    usedCategories: room?.gameData?.usedCategories || [],
    scores: room?.gameData?.scores || {},
  };

  const currentTeam = gameData.remainingTeams[gameData.currentTeamIndex];

  // Vérifier si le jeu est terminé
  useEffect(() => {
    // Vérifier que le jeu est bien initialisé et que toutes les équipes ont joué
    const usedCategories = room?.gameData?.usedCategories || [];
    const remainingTeams = room?.gameData?.remainingTeams || [];

    if (
      usedCategories.length > 0 && // Au moins une catégorie a été jouée
      usedCategories.length === remainingTeams.length && // Toutes les équipes ont joué
      !room?.gameData?.currentCategory // Pas de catégorie en cours (question terminée)
    ) {
      router.push(`/room/${room?.id}/millionaire-results`);
    }
  }, [
    room?.gameData?.usedCategories,
    room?.gameData?.currentCategory,
    room?.gameData?.remainingTeams,
    room?.id,
    router,
  ]);

  const handleCategorySelect = async (category: MillionaireCategory) => {
    if (!room) return;
    await roomService.selectMillionaireCategory(room.id, category);
  };

  const handleAnswer = async (answerIndex: number) => {
    if (!room || !gameData?.currentCategory) return;

    const currentQuestion =
      millionaireQuestions[gameData.currentCategory][
        gameData.currentQuestionIndex
      ];

    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    let points = currentQuestion.points;
    if (gameData.currentQuestionIndex >= 10) {
      points *= 2;
    }

    await roomService.submitMillionaireAnswer(room.id, isCorrect, points);
  };

  const isCurrentTeam = currentTeam === teamId;

  if (!room || !gameData) return <div>Chargement...</div>;

  return (
    <div className="container mx-auto p-4">
      <ScoreDisplay room={room} currentTeam={currentTeam} />

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">
          Tour de l'équipe : {room.teams[currentTeam]?.name}
        </h2>
        {gameData.currentCategory && (
          <p className="text-gray-600">
            Question {gameData.currentQuestionIndex + 1}/15 - Catégorie{" "}
            {gameData.currentCategory}
          </p>
        )}
      </div>

      {!isHost && !isCurrentTeam ? (
        <div className="max-w-2xl mx-auto p-6 text-center">
          <h3 className="text-xl font-semibold mb-4">
            C'est le tour de l'équipe {room.teams[currentTeam]?.name}
          </h3>
          <p className="text-gray-600">Attendez votre tour pour jouer...</p>
        </div>
      ) : !gameData.currentCategory ? (
        <CategorySelector
          usedCategories={gameData.usedCategories}
          onSelectCategory={handleCategorySelect}
          isCurrentTeam={isCurrentTeam}
        />
      ) : (
        <QuestionDisplay
          question={
            millionaireQuestions[gameData.currentCategory][
              gameData.currentQuestionIndex
            ]
          }
          onAnswer={handleAnswer}
          isHost={isHost}
          isCurrentTeam={isCurrentTeam}
          questionIndex={gameData.currentQuestionIndex}
        />
      )}
    </div>
  );
}

export default function MillionairePage() {
  const { roomId } = useParams();

  return (
    <RoomProvider roomId={roomId as string}>
      <MillionaireContent />
    </RoomProvider>
  );
}
