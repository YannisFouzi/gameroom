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
    const usedSubCategories =
      room.gameData?.wheelState?.usedSubCategories || {};
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

  useEffect(() => {
    if (room?.gameData?.wheelState) {
      setMustSpin(room.gameData.wheelState.isSpinning);
      setPrizeNumber(room.gameData.wheelState.prizeNumber || 0);
      setSelectedTheme(room.gameData.wheelState.selectedTheme);
      setSubCategory(room.gameData.wheelState.subCategory);
    }
  }, [room?.gameData?.wheelState]);

  return (
    <div className="container mx-auto p-4">
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
          selectedTheme={selectedTheme}
          subCategory={subCategory}
          isSpinning={mustSpin}
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
