"use client";

import CategorySelector from "@/components/millionaire/CategorySelector";
import ProgressLadder from "@/components/millionaire/ProgressLadder";
import QuestionDisplay from "@/components/millionaire/QuestionDisplay";
import ScoreDisplay from "@/components/millionaire/ScoreDisplay";
import { RoomProvider, useRoom } from "@/contexts/RoomContext";
import { millionaireQuestions } from "@/data/millionaireQuestions";
import { usePlayer } from "@/hooks/usePlayer";
import {
  gameTransitionService,
  jokerService,
  millionaireService,
} from "@/lib/firebase/services";
import {
  AnswerState,
  MillionaireCategory,
  MillionaireGameData,
} from "@/types/millionaire";
import { motion } from "framer-motion";
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
    jokers: room?.gameData?.jokers || {},
    selectedAnswer: room?.gameData?.selectedAnswer || null,
    answerState: room?.gameData?.answerState || null,
    selectedAnswers: room?.gameData?.selectedAnswers || [],
    phoneCallModalOpen: room?.gameData?.phoneCallModalOpen || false,
    hiddenAnswers: room?.gameData?.hiddenAnswers || [],
    doubleAnswerActive: room?.gameData?.doubleAnswerActive || false,
  };

  const currentTeam = gameData.remainingTeams[gameData.currentTeamIndex];
  const isCurrentTeam = currentTeam === teamId;

  // Vérifier si le jeu est terminé
  useEffect(() => {
    const usedCategories = room?.gameData?.usedCategories || [];
    const allCategories = Object.keys(millionaireQuestions);

    if (
      usedCategories.length === allCategories.length &&
      !room?.gameData?.currentCategory
    ) {
      router.push(`/room/${room?.id}/millionaire-results`);
    }
  }, [
    room?.gameData?.usedCategories,
    room?.gameData?.currentCategory,
    room?.id,
    router,
  ]);

  const handleCategorySelect = async (category: MillionaireCategory) => {
    if (!room) return;
    await millionaireService.selectMillionaireCategory(room.id, category);
  };

  const handleAnswer = async (answerIndex: number) => {
    if (!room || !gameData?.currentCategory) return;

    const currentQuestion =
      millionaireQuestions[gameData.currentCategory][
        gameData.currentQuestionIndex
      ];

    const isCorrect = answerIndex === currentQuestion.correctAnswer;

    await millionaireService.submitMillionaireAnswer(
      room.id,
      isCorrect,
      gameData.currentQuestionIndex,
      currentQuestion.points
    );
  };

  const handleNextQuestion = async () => {
    if (!room || !gameData?.currentCategory) return;

    // Si c'est la dernière question, on passe à l'équipe suivante
    if (gameData.currentQuestionIndex === 14) {
      const nextTeamIndex =
        (gameData.currentTeamIndex + 1) % gameData.remainingTeams.length;
      await millionaireService.moveToNextTeam(room.id, nextTeamIndex);
    } else {
      // Sinon on passe à la question suivante
      await millionaireService.moveToNextQuestion(
        room.id,
        gameData.currentQuestionIndex + 1
      );
    }
  };

  const handleQuit = async () => {
    if (!room) return;
    // Passer à l'équipe suivante et réinitialiser la catégorie
    const nextTeamIndex =
      (gameData.currentTeamIndex + 1) % gameData.remainingTeams.length;
    await millionaireService.moveToNextTeam(room.id, nextTeamIndex);
  };

  const handleQuitWithPoints = async () => {
    if (!room || !gameData?.currentCategory) return;

    const currentQuestion =
      millionaireQuestions[gameData.currentCategory][
        gameData.currentQuestionIndex
      ];

    await millionaireService.quitWithPoints(room.id, currentQuestion.points);
  };

  const handleUsePhoneCall = async () => {
    if (!room || !teamId) return;
    await jokerService.useJoker(room.id, teamId, "phoneCall");
  };

  const handleUseFiftyFifty = async () => {
    if (!room || !teamId) return;
    await jokerService.useJoker(room.id, teamId, "fiftyFifty");
  };

  const handleUseDoubleAnswer = async () => {
    if (!room || !teamId) return;
    await jokerService.useJoker(room.id, teamId, "doubleAnswer");
  };

  const handleUpdateAnswerState = async (
    selectedAnswer: number | null,
    answerState: AnswerState,
    selectedAnswers: number[] = []
  ) => {
    if (!room) return;
    await gameTransitionService.updateAnswerState(
      room.id,
      selectedAnswer?.toString() || null,
      answerState,
      selectedAnswers
    );
  };

  const handlePhoneCallModalChange = async (isOpen: boolean) => {
    if (!room) return;
    await jokerService.setPhoneCallModalState(room.id, isOpen);
  };

  const handleSetHiddenAnswers = async (answers: number[]) => {
    if (!room) return;
    await jokerService.setHiddenAnswers(room.id, answers);
  };

  const handleSetDoubleAnswerActive = async (isActive: boolean) => {
    if (!room) return;
    await jokerService.setDoubleAnswerActive(room.id, isActive);
  };

  // Modification ici : on récupère toujours les jokers de l'équipe active
  const currentJokers = gameData.jokers[currentTeam] || {
    phoneCall: false,
    fiftyFifty: false,
    doubleAnswer: false,
  };

  if (!room || !gameData) return <div>Chargement...</div>;

  // Récupérer les infos de l'équipe du joueur
  const playerTeam = teamId ? room.teams[teamId] : null;

  return (
    <div className={`min-h-screen ${isHost ? "flex gap-12 p-12" : "p-6"}`}>
      {/* Colonne principale (2/3) - Questions et réponses */}
      <div className={`${isHost ? "w-3/4" : "w-full"} max-w-[1400px] mx-auto`}>
        {/* Info équipe pour les joueurs */}
        {!isHost && playerTeam && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8 mb-12"
          >
            <motion.div
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <img
                src={playerTeam.avatar}
                alt={playerTeam.name}
                className="w-24 h-24 mx-auto rounded-full"
              />
            </motion.div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-white">
                {playerTeam.name}
              </h1>
              <div className="space-y-2">
                {playerTeam.members.map((member, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-xl text-white/80"
                  >
                    {member.name}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Message pour les joueurs qui ne jouent pas */}
        {!isHost && !isCurrentTeam && (
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              C'est au tour de l'équipe {room.teams[currentTeam]?.name}
            </h3>
            <p className="text-xl text-white/80">
              Attendez votre tour pour jouer...
            </p>
          </div>
        )}

        {/* Scores uniquement pour l'hôte */}
        {isHost && <ScoreDisplay room={room} currentTeam={currentTeam} />}

        {gameData?.currentCategory ? (
          <QuestionDisplay
            question={
              millionaireQuestions[gameData.currentCategory][
                gameData.currentQuestionIndex
              ]
            }
            onAnswer={handleAnswer}
            onNextQuestion={handleNextQuestion}
            onQuit={handleQuit}
            onQuitWithPoints={handleQuitWithPoints}
            currentPoints={
              millionaireQuestions[gameData.currentCategory][
                gameData.currentQuestionIndex
              ].points
            }
            isHost={isHost}
            isCurrentTeam={isCurrentTeam}
            questionIndex={gameData.currentQuestionIndex}
            jokers={currentJokers}
            onUsePhoneCall={handleUsePhoneCall}
            onUseFiftyFifty={handleUseFiftyFifty}
            onUseDoubleAnswer={handleUseDoubleAnswer}
            selectedAnswer={
              gameData.selectedAnswer !== null
                ? parseInt(gameData.selectedAnswer)
                : null
            }
            answerState={gameData.answerState}
            selectedAnswers={gameData.selectedAnswers}
            onUpdateAnswerState={handleUpdateAnswerState}
            phoneCallModalOpen={gameData.phoneCallModalOpen || false}
            onPhoneCallModalChange={handlePhoneCallModalChange}
            hiddenAnswers={gameData.hiddenAnswers}
            onSetHiddenAnswers={handleSetHiddenAnswers}
            doubleAnswerActive={gameData.doubleAnswerActive}
            onSetDoubleAnswerActive={handleSetDoubleAnswerActive}
          />
        ) : (
          <>
            {/* Message d'attente pour l'hôte */}
            {isHost && (
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  L'équipe {room.teams[currentTeam]?.name} choisit sa catégorie
                </h3>
                <p className="text-xl text-white/80">
                  En attente de la sélection...
                </p>
              </div>
            )}
            <CategorySelector
              onSelectCategory={handleCategorySelect}
              usedCategories={gameData?.usedCategories || []}
              isHost={isHost}
              isCurrentTeam={isCurrentTeam}
            />
          </>
        )}
      </div>

      {/* Colonne latérale (1/4) - Paliers uniquement pour l'hôte */}
      {isHost && (
        <div className="w-1/4">
          <ProgressLadder
            currentQuestion={gameData?.currentQuestionIndex || 0}
          />
        </div>
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
