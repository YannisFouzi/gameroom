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
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="space-y-2">
        {steps.map((step) => (
          <div key={step.level}>
            {step.isSecureLevel && (
              <div className="border-t-2 border-orange-300 my-3" />
            )}
            <motion.div
              className={`flex justify-between items-center p-2 rounded ${
                currentQuestion + 1 === step.level
                  ? "bg-blue-100 font-bold text-black"
                  : currentQuestion + 1 > step.level
                  ? "text-gray-500"
                  : "text-black"
              } ${
                step.isVictoryLevel
                  ? "bg-green-50 border-2 border-green-300 font-bold text-black"
                  : step.isSecureLevel
                  ? "bg-orange-50 border border-orange-200 text-black"
                  : ""
              }`}
              animate={{
                scale: currentQuestion + 1 === step.level ? 1.05 : 1,
              }}
            >
              <span>
                {step.level.toString().padStart(2, "0")}
                {currentQuestion + 1 === step.level && ""}
              </span>
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
