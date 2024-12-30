import { baseRoomService } from "@/lib/firebase/services";
import { generateUUID } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateRoom() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRoom = async () => {
    try {
      setIsLoading(true);
      const hostId = generateUUID();
      const roomId = await baseRoomService.createRoom(hostId);
      localStorage.setItem(`host_${roomId}`, hostId);
      router.push(`/room/${roomId}`);
    } catch (error) {
      console.error("Erreur lors de la création de la room:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-12 w-full max-w-2xl"
      >
        <motion.h1
          className="text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent text-center leading-tight"
          animate={{
            scale: [1, 1.02, 1],
            rotate: [-1, 1, -1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Soirée du Nouvel An 2024
        </motion.h1>

        <AnimatePresence>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative"
          >
            <p className="text-2xl text-white mb-12 text-center">
              Prêt pour une soirée de folie ?
              <motion.span
                animate={{
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
        </AnimatePresence>

        <motion.button
          onClick={handleCreateRoom}
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-6 px-8 rounded-2xl font-bold text-2xl shadow-lg hover:shadow-xl transform transition-all duration-200 disabled:opacity-50 relative overflow-hidden"
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
            <motion.span
              className="flex items-center justify-center space-x-4"
              whileHover={{ scale: 1.05 }}
            >
              <span>Lancer la soirée</span>
              <motion.span
                className="text-4xl"
                animate={{
                  rotate: [0, 14, -14, 14, 0],
                  scale: [1, 1.3, 1.3, 1.3, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                🎊
              </motion.span>
            </motion.span>
          )}
        </motion.button>

        <motion.div
          className="text-base text-white text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Créez une room et invitez vos amis à la rejoindre !
        </motion.div>
      </motion.div>
    </div>
  );
}
