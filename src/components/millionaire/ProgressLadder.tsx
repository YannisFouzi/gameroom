import { motion } from "framer-motion";

type ProgressLadderProps = {
  currentQuestion: number;
};

type Step = {
  level: number;
  points: number;
  isSecureLevel: boolean;
  isVictoryLevel?: boolean;
};

export default function ProgressLadder({
  currentQuestion,
}: ProgressLadderProps) {
  const steps: Step[] = [
    // Palier victoire
    { level: 15, points: 20, isSecureLevel: false, isVictoryLevel: true },
    { level: 14, points: 18, isSecureLevel: false },
    { level: 13, points: 16, isSecureLevel: false },
    { level: 12, points: 15, isSecureLevel: false },
    { level: 11, points: 14, isSecureLevel: false },
    // Palier sécurité 2
    { level: 10, points: 12, isSecureLevel: true },
    { level: 9, points: 10, isSecureLevel: false },
    { level: 8, points: 9, isSecureLevel: false },
    { level: 7, points: 8, isSecureLevel: false },
    { level: 6, points: 7, isSecureLevel: false },
    // Palier sécurité 1
    { level: 5, points: 5, isSecureLevel: true },
    { level: 4, points: 4, isSecureLevel: false },
    { level: 3, points: 3, isSecureLevel: false },
    { level: 2, points: 2, isSecureLevel: false },
    { level: 1, points: 1, isSecureLevel: false },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-900 to-blue-950 p-1.5 rounded-lg">
      <div className="space-y-1">
        {steps.map((step) => (
          <div key={step.level} className="px-1">
            <motion.div
              className={`flex justify-between items-center px-4 py-1.5 rounded ${
                step.isVictoryLevel
                  ? "bg-yellow-500 text-white font-extrabold border-2 border-yellow-400 shadow-[0_0_10px_2px_rgba(234,179,8,0.3)]"
                  : step.isSecureLevel
                  ? "bg-blue-800 text-white font-extrabold border-2 border-yellow-500 shadow-[0_0_10px_2px_rgba(234,179,8,0.3)]"
                  : currentQuestion + 1 === step.level
                  ? "bg-blue-800 text-white font-bold border-2 border-white shadow-[0_0_10px_2px_rgba(255,255,255,0.3)]"
                  : "bg-blue-900/50 text-white/90 font-semibold"
              }`}
              animate={{
                scale: currentQuestion + 1 === step.level ? 1.02 : 1,
              }}
            >
              <span className="text-base">{step.level}</span>
              <span>
                {step.points} point{step.points > 1 ? "s" : ""}
              </span>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
