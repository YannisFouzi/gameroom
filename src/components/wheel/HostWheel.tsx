import { wheelData } from "@/data/wheelData";
import { Team } from "@/types/room";
import { Wheel } from "react-custom-roulette";

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
  return (
    <div className="flex flex-col items-center">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Scores :</h2>
        {Object.entries(teams).map(([teamId, team]) => (
          <div key={teamId} className="flex justify-between mb-2">
            <span className="font-semibold">{team.name}:</span>
            <span>{scores[teamId] || 0} points</span>
          </div>
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
