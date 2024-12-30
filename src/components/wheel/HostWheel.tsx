import { wheelData } from "@/data/wheelData";
import { motion } from "framer-motion";
import { Wheel } from "react-custom-roulette";

type HostWheelProps = {
  mustSpin: boolean;
  prizeNumber: number;
  onStopSpinning: () => void;
};

export default function HostWheel({
  mustSpin,
  prizeNumber,
  onStopSpinning,
}: HostWheelProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center justify-center p-6"
    >
      <h2 className="text-2xl font-bold mb-8">La Roue des Thèmes</h2>
      <div className="relative">
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
    </motion.div>
  );
}
