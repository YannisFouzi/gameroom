import { baseRoomService } from "@/lib/firebase/services";
import { generateUUID } from "@/lib/utils";
import "@/styles/components/Bounce.scss";
import "@/styles/components/ShinyButton.scss";
import "@/styles/components/SnowButton.scss";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SnowEffect from "../effects/SnowEffect";

export default function CreateRoom() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [audio] = useState(
    typeof window !== "undefined"
      ? new Audio("/sound/musique/Gilbert Montagné - Just Because of You.mp3")
      : null
  );

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [audio]);

  const handleCreateRoom = async () => {
    try {
      setIsLoading(true);
      const hostId = generateUUID();
      const roomId = await baseRoomService.createRoom(hostId);
      localStorage.setItem(`host_${roomId}`, hostId);
      if (audio) {
        audio.play();
      }
      router.push(`/room/${roomId}`);
    } catch (error) {
      console.error("Erreur lors de la création de la room:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <SnowEffect />
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-12 w-full max-w-2xl"
      >
        <h1>
          <span>L</span>
          <span>e</span>
          <span>s</span>
          <span>&nbsp;</span>
          <span>b</span>
          <span>r</span>
          <span>o</span>
          <span>n</span>
          <span>z</span>
          <span>é</span>
          <span>s</span>
          <br />
          <span>f</span>
          <span>o</span>
          <span>n</span>
          <span>t</span>
          <span>&nbsp;</span>
          <span>d</span>
          <span>u</span>
          <span>&nbsp;</span>
          <span>s</span>
          <span>k</span>
          <span>i</span>
        </h1>

        {/* <AnimatePresence>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative"
          >
            <p className="text-2xl text-white mb-12 text-center">
              Prêt pour une soirée de folie ?
              <motion.span
                animate={{-
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.2, 1.2, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                className="inline-block ml-2"
              >
                🎉
              </motion.span>
            </p>
          </motion.div>
        </AnimatePresence> */}

        <motion.button
          onClick={handleCreateRoom}
          disabled={isLoading}
          className="snow-button w-full"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-8 w-8 text-white"
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
              Création en cours...
            </span>
          ) : (
            <span className="flex items-center justify-center space-x-4">
              <span className="snow-text" data-text="Lancer le jeu">
                Lancer le jeu
              </span>
            </span>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}
