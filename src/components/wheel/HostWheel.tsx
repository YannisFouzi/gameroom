import { wheelData } from "@/data/wheelData";
import { Team } from "@/types/room";
import { Wheel } from "react-custom-roulette";
import ScoreGauge from "./ScoreGauge";

type HostWheelProps = {
  mustSpin: boolean;
  prizeNumber: number;
  onStopSpinning: () => void;
  scores: Record<string, number>;
  teams: Record<string, Team>;
};

export default function HostWheel({
  mustSpin,
  prizeNumber,
  onStopSpinning,
  scores,
  teams,
}: HostWheelProps) {
  const teamIds = Object.keys(teams).sort();

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-around mb-8">
        {teamIds.map((teamId) => (
          <ScoreGauge
            key={teamId}
            score={scores[teamId] || 0}
            teamName={teams[teamId]?.name || "Équipe"}
          />
        ))}
      </div>

      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={wheelData}
        onStopSpinning={onStopSpinning}
        backgroundColors={wheelData.map((d) => d.style.backgroundColor)}
        textColors={wheelData.map((d) => d.style.textColor)}
        fontSize={24}
        outerBorderWidth={3}
        radiusLineWidth={2}
        spinDuration={0.8}
      />
    </div>
  );
}
