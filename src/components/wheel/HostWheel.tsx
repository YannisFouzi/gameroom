import VideoOverlay from "@/components/common/VideoOverlay";
import { wheelData } from "@/data/wheelData";
import { db } from "@/lib/firebase";
import { Room, Team } from "@/types/room";
import { WheelState } from "@/types/wheel";
import { doc, updateDoc } from "firebase/firestore";
import { Wheel } from "react-custom-roulette";
import ScoreGauge from "./ScoreGauge";

type HostWheelProps = {
  mustSpin: boolean;
  prizeNumber: number;
  onStopSpinning: () => void;
  scores: Record<string, number>;
  teams: Record<string, Team>;
  wheelState: WheelState | null;
  room: Room | null;
};

export default function HostWheel({
  mustSpin,
  prizeNumber,
  onStopSpinning,
  scores,
  teams,
  wheelState,
  room,
}: HostWheelProps) {
  const teamIds = Object.keys(teams).sort();

  return (
    <div className="flex flex-col items-center overflow-x-hidden">
      <div className="flex justify-around mb-8">
        {teamIds.map((teamId) => (
          <ScoreGauge
            key={teamId}
            score={scores[teamId] || 0}
            teamName={teams[teamId]?.name || "Équipe"}
            avatar={teams[teamId]?.avatar || ""}
          />
        ))}
      </div>

      <div className="text-white text-xl font-semibold mb-8 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl">
        Premier à 25 points remporte la partie !
      </div>

      <div className="overflow-hidden">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={wheelData}
          onStopSpinning={onStopSpinning}
          backgroundColors={wheelData.map((d) => d.style.backgroundColor)}
          textColors={wheelData.map((d) => d.style.textColor)}
          fontSize={24}
          outerBorderWidth={5}
          radiusLineWidth={4}
          spinDuration={0.8}
          innerBorderColor="white"
          innerBorderWidth={10}
          outerBorderColor="white"
          radiusLineColor="white"
        />
      </div>

      {wheelState?.showSpecialVideo && wheelState.specialVideoId && room && (
        <VideoOverlay
          publicId={wheelState.specialVideoId}
          onComplete={async () => {
            await updateDoc(doc(db, "rooms", room.id), {
              "gameData.wheelState.showSpecialVideo": false,
              "gameData.wheelState.waitingForVideo": false,
            });
          }}
        />
      )}
    </div>
  );
}
