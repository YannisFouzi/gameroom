"use client";

import HostWheel from "@/components/wheel/HostWheel";
import PlayerWheel from "@/components/wheel/PlayerWheel";
import { RoomProvider, useRoom } from "@/contexts/RoomContext";
import { getRandomSubCategory, wheelData } from "@/data/wheelData";
import { usePlayer } from "@/hooks/usePlayer";
import { gameTransitionService, wheelService } from "@/lib/firebase/services";
import { Theme } from "@/types/wheel";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function WheelContent() {
  const { room } = useRoom();
  const router = useRouter();
  const { isHost, teamId } = usePlayer(room?.id || "");
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [, setSelectedTheme] = useState<Theme | null>(null);
  const [, setSubCategory] = useState<string | null>(null);
  const currentTeam = teamId && room ? room.teams[teamId] : null;
  const [localScores, setLocalScores] = useState<Record<string, number>>({});

  const isCurrentTeam = room?.gameData?.currentTeamId === teamId;
  const wheelState = room?.gameData?.wheelState;

  useEffect(() => {
    if (wheelState) {
      setMustSpin(wheelState.isSpinning);
      setPrizeNumber(wheelState.prizeNumber || 0);
    }
  }, [wheelState]);

  useEffect(() => {
    if (room?.gamePhase === "wheel-results") {
      router.push(`/room/${room.id}/wheel-results`);
    }
  }, [room?.gamePhase, room?.id, router]);

  useEffect(() => {
    if (wheelState?.scores) {
      setLocalScores(wheelState.scores);
    }
  }, [wheelState?.scores]);

  if (room?.gamePhase === "wheel-results") {
    return null;
  }

  const handleSpinWheel = async () => {
    if (!room || mustSpin) return;

    const newPrizeNumber = Math.floor(Math.random() * wheelData.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);

    await wheelService.startSpin(room.id, newPrizeNumber);
  };

  const handleStopSpinning = async () => {
    if (!room) return;

    const _selectedTheme = wheelData[prizeNumber].option as Theme;
    setSelectedTheme(_selectedTheme);
    const usedSubCategories = wheelState?.usedSubCategories || {};
    const _subCategory = getRandomSubCategory(
      _selectedTheme,
      usedSubCategories
    );
    setSubCategory(_subCategory);

    await wheelService.stopSpin(
      room.id,
      _selectedTheme,
      _subCategory,
      usedSubCategories
    );
    setMustSpin(false);
  };

  const handleSelectDifficulty = async (difficulty: 2 | 4 | 7 | 10) => {
    if (!room) return;
    await wheelService.selectDifficulty(room.id, difficulty);
  };

  const handleAnswerQuestion = async (isCorrect: boolean) => {
    console.log("1. handleAnswerQuestion called", { isCorrect });
    if (!room) return;

    const teamId = room.gameData?.currentTeamId;
    const difficulty = wheelState?.selectedDifficulty || 2;

    console.log("2. Current state:", { teamId, difficulty, localScores });

    if (isCorrect && teamId) {
      const newScore = (localScores[teamId] || 0) + difficulty;
      console.log("3. Calculating new score:", { newScore });

      setLocalScores((prev) => {
        console.log("4. Updating scores:", { prev, newScore });
        return {
          ...prev,
          [teamId]: newScore,
        };
      });

      try {
        console.log("5. Calling services");
        await wheelService.answerQuestion(room.id, true, teamId, difficulty);
        await gameTransitionService.switchTeam(room.id);
        console.log("6. Services called successfully");
      } catch (error) {
        console.error("7. Error:", error);
        setLocalScores((prev) => ({
          ...prev,
          [teamId]: prev[teamId] || 0,
        }));
      }
    } else {
      await wheelService.answerQuestion(
        room.id,
        false,
        teamId || "",
        difficulty
      );
      await gameTransitionService.switchTeam(room.id);
    }
  };

  const handleStartTimer = async () => {
    if (!room) return;
    await wheelService.startTimer(room.id);
  };

  const handleTimeUp = async () => {
    if (!room) return;
    await wheelService.stopTimer(room.id);
    handleAnswerQuestion(false);
  };

  const handleHideVraiButton = async () => {
    if (!room) return;
    await wheelService.hideVraiButton(room.id);
  };

  return (
    <div className="min-h-screen">
      {isHost ? (
        <HostWheel
          mustSpin={mustSpin}
          prizeNumber={prizeNumber}
          onStopSpinning={handleStopSpinning}
          scores={localScores}
          teams={room?.teams || {}}
          wheelState={room?.gameData?.wheelState || null}
          room={room}
        />
      ) : (
        <PlayerWheel
          isCurrentTeam={isCurrentTeam}
          onSpinWheel={handleSpinWheel}
          selectedTheme={wheelState?.selectedTheme || null}
          subCategory={wheelState?.subCategory || null}
          isSpinning={wheelState?.isSpinning || false}
          onSelectDifficulty={handleSelectDifficulty}
          onAnswerQuestion={handleAnswerQuestion}
          showQuestion={wheelState?.showQuestion || false}
          selectedDifficulty={wheelState?.selectedDifficulty || null}
          questionAnswered={wheelState?.questionAnswered || false}
          currentTeam={currentTeam}
          scores={localScores}
          teams={room?.teams || {}}
          isTimerActive={wheelState?.isTimerActive || false}
          onTimeUp={handleTimeUp}
          onStartTimer={handleStartTimer}
          onHideVraiButton={handleHideVraiButton}
          wheelState={room?.gameData?.wheelState || null}
          roomId={room?.id || ""}
        />
      )}
    </div>
  );
}

export default function WheelPage() {
  const { roomId } = useParams();

  return (
    <RoomProvider roomId={roomId as string}>
      <WheelContent />
    </RoomProvider>
  );
}
