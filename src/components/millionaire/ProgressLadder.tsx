import { motion } from "framer-motion";

type ProgressLadderProps = {
  currentQuestion: number;
};

type Step = {
  level: number;
  points: number;
  isPalier: boolean;
};

export default function ProgressLadder({
  currentQuestion,
}: ProgressLadderProps) {
  const steps: Step[] = [
    // Palier 3
    { level: 15, points: 4, isPalier: false },
    { level: 14, points: 4, isPalier: false },
    { level: 13, points: 3, isPalier: false },
    { level: 12, points: 3, isPalier: false },
    { level: 11, points: 3, isPalier: true },
    // Palier 2
    { level: 10, points: 3, isPalier: false },
    { level: 9, points: 2, isPalier: false },
    { level: 8, points: 2, isPalier: false },
    { level: 7, points: 2, isPalier: false },
    { level: 6, points: 2, isPalier: true },
    // Palier 1
    { level: 5, points: 2, isPalier: false },
    { level: 4, points: 1, isPalier: false },
    { level: 3, points: 1, isPalier: false },
    { level: 2, points: 1, isPalier: false },
    { level: 1, points: 1, isPalier: true },
  ];

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="space-y-2">
        {steps.map((step) => (
          <div key={step.level}>
            {step.isPalier && (
              <div className="border-t border-blue-300 my-3 text-sm text-blue-600 pt-2">
                Palier {Math.ceil(step.level / 5)}
              </div>
            )}
            <motion.div
              className={`flex justify-between items-center p-2 rounded ${
                currentQuestion + 1 === step.level
                  ? "bg-blue-100 font-bold"
                  : currentQuestion + 1 > step.level
                  ? "text-gray-400"
                  : ""
              }`}
              animate={{
                scale: currentQuestion + 1 === step.level ? 1.05 : 1,
              }}
            >
              <span>
                {step.level.toString().padStart(2, "0")}
                {currentQuestion + 1 === step.level && " ←"}
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
