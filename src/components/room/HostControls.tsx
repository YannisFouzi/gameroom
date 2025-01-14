import VideoOverlay from "@/components/common/VideoOverlay";
import { roomService } from "@/lib/firebase/roomService";
import { Room } from "@/types/room";
import { motion } from "framer-motion";
import { useState } from "react";

type HostControlsProps = {
  room: Room;
  onVideoStart?: () => void;
  onVideoEnd?: () => void;
};

export default function HostControls({
  room,
  onVideoStart,
  onVideoEnd,
}: HostControlsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const isWaiting = room.status === "waiting";
  const numberOfTeams = Object.values(room.teams).filter(
    (team) => team.members && team.members.length > 0
  ).length;
  const teamsNeeded = 2 - numberOfTeams;

  if (teamsNeeded > 0) return null;

  const handleStartGame = async () => {
    try {
      setIsUpdating(true);
      setShowVideo(true);
      onVideoStart?.();
    } catch (error) {
      console.error("Erreur:", error);
      setIsUpdating(false);
    }
  };

  const handleVideoComplete = async () => {
    try {
      await roomService.startGame(room.id);
      setShowVideo(false);
      onVideoEnd?.();
    } finally {
      setIsUpdating(false);
    }
  };

  const getButtonContent = () => {
    if (isUpdating) {
      return (
        <span className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-7 w-7 text-yellow-200"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-yellow-100 text-lg">
            Préparation des pistes...
          </span>
        </span>
      );
    }

    if (teamsNeeded > 0) {
      return null;
    }

    return (
      <motion.div
        className="flex items-center justify-center space-x-4"
        whileHover={{ scale: 1.02 }}
      >
        <span className="text-2xl">⛷️</span>
        <span className="bg-gradient-to-r from-yellow-100 via-white to-yellow-100 text-transparent bg-clip-text font-extrabold text-xl">
          Clique ici pour démarrer la partie !
        </span>
        <motion.span
          animate={{
            y: [0, -3, 0],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-2xl"
        >
          🎿
        </motion.span>
      </motion.div>
    );
  };

  return (
    <div className="relative">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 rounded-xl blur-xl opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse" />
        <div className="absolute inset-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg blur-md opacity-20 group-hover:opacity-40 transition duration-1000" />
        <button
          onClick={handleStartGame}
          disabled={teamsNeeded > 0 || isUpdating}
          className={`
            relative w-full py-8 px-8 rounded-lg font-bold text-xl
            transition-all duration-300 backdrop-blur-sm
            ${
              teamsNeeded > 0
                ? "bg-gray-900/95 text-gray-400 cursor-not-allowed"
                : `bg-gradient-to-br from-amber-950/95 via-amber-900/95 to-amber-800/95
                   text-amber-100 hover:text-yellow-100
                   hover:from-amber-900/95 hover:via-amber-800/95 hover:to-amber-700/95
                   active:from-amber-950/95 active:via-amber-900/95 active:to-amber-800/95
                   transform hover:-translate-y-0.5 active:translate-y-0`
            }
            border-2 border-amber-500/30
            shadow-[0_0_25px_rgba(245,158,11,0.3)]
            hover:shadow-[0_0_35px_rgba(245,158,11,0.5)]
            hover:border-amber-400/50
            disabled:shadow-none
            disabled:hover:shadow-none
            disabled:hover:border-amber-500/30
            disabled:hover:translate-y-0
            disabled:opacity-60
          `}
        >
          <div className="relative z-10">
            <div className="absolute inset-0 rounded-lg overflow-hidden">
              <div className="absolute top-0 left-[-100%] h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent transform group-hover:translate-x-[400%] transition-transform duration-1000 ease-out" />
            </div>

            {getButtonContent()}
          </div>
        </button>
      </div>
      {showVideo && (
        <VideoOverlay
          publicId="v1710876847/n6kfbtqvlj2ki8sq6ptd.mp4"
          onComplete={handleVideoComplete}
        />
      )}
    </div>
  );
}
