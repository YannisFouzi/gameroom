"use client";

import HostWheel from "@/components/wheel/HostWheel";
import PlayerWheel from "@/components/wheel/PlayerWheel";
import { RoomProvider, useRoom } from "@/contexts/RoomContext";
import { getRandomSubCategory, wheelData } from "@/data/wheelData";
import { usePlayer } from "@/hooks/usePlayer";
import { wheelService } from "@/lib/firebase/services";
import { Theme } from "@/types/wheel";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function WheelContent() {
  const { room } = useRoom();
  const { isHost, teamId } = usePlayer(room?.id || "");
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [subCategory, setSubCategory] = useState<string | null>(null);

  const isCurrentTeam = room?.gameData?.currentTeamId === teamId;
  const wheelState = room?.gameData?.wheelState;

  useEffect(() => {
    if (wheelState) {
      setMustSpin(wheelState.isSpinning);
      setPrizeNumber(wheelState.prizeNumber || 0);
    }
  }, [wheelState]);

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
    await wheelService.answerQuestion(room.id, isCorrect);
  };

  return (
    <div className="container mx-auto px-4">
      {isHost ? (
        <HostWheel
          mustSpin={mustSpin}
          prizeNumber={prizeNumber}
          onStopSpinning={handleStopSpinning}
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
