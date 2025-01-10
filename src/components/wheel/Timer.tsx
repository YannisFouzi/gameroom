import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type TimerProps = {
  duration: number;
  onTimeUp: () => void;
  isActive: boolean;
};

export default function Timer({ duration, onTimeUp, isActive }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(duration);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, onTimeUp, isActive]);

  const getColor = () => {
    if (timeLeft > 10) return "text-white";
    return "text-red-500";
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`text-4xl font-bold ${getColor()} bg-black/20 backdrop-blur-sm px-8 py-4 rounded-xl`}
    >
      {timeLeft}s
    </motion.div>
  );
}
