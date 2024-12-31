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
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [subCategory, setSubCategory] = useState<string | null>(null);
  const currentTeam = teamId && room ? room.teams[teamId] : null;

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

    const theme = wheelData[prizeNumber].option as Theme;
    setSelectedTheme(theme);
    const usedSubCategories = wheelState?.usedSubCategories || {};
    const randomSubCategory = getRandomSubCategory(theme, usedSubCategories);
    setSubCategory(randomSubCategory);

    await wheelService.stopSpin(
      room.id,
      theme,
      randomSubCategory,
      usedSubCategories
    );
    setMustSpin(false);
  };

  const handleSelectDifficulty = async (difficulty: 1 | 3 | 5 | 8) => {
    if (!room) return;
    await wheelService.selectDifficulty(room.id, difficulty);
  };

  const handleAnswerQuestion = async (isCorrect: boolean) => {
    if (!room) return;
    await wheelService.answerQuestion(
      room.id,
      isCorrect,
      room.gameData?.currentTeamId || "",
      wheelState?.selectedDifficulty || 1
    );
    await gameTransitionService.switchTeam(room.id);
  };

  return (
    <div className="container mx-auto px-4">
      {isHost ? (
        <HostWheel
          mustSpin={mustSpin}
          prizeNumber={prizeNumber}
          onStopSpinning={handleStopSpinning}
          scores={wheelState?.scores || {}}
          teams={room?.teams || {}}
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
