import { baseRoomService } from "@/lib/firebase/services";
import { generateUUID } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Ajout des styles pour le bouton brillant
const buttonStyles = `
  @property --gradient-angle {
    syntax: "<angle>";
    initial-value: 0deg;
    inherits: false;
  }

  @property --gradient-angle-offset {
    syntax: "<angle>";
    initial-value: 0deg;
    inherits: false;
  }

  @property --gradient-percent {
    syntax: "<percentage>";
    initial-value: 5%;
    inherits: false;
  }

  @property --gradient-shine {
    syntax: "<color>";
    initial-value: white;
    inherits: false;
  }

  .shiny-cta {
    --animation: gradient-angle linear infinite;
    --duration: 3s;
    --shadow-size: 2px;
    isolation: isolate;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    outline-offset: 4px;
    padding: 1.25rem 2.5rem;
    font-family: inherit;
    font-size: 1.5rem;
    font-weight: bold;
    line-height: 1.2;
    border: 1px solid transparent;
    border-radius: 360px;
    color: white;
    background: linear-gradient(#000000, #000000) padding-box,
      conic-gradient(
        from calc(var(--gradient-angle) - var(--gradient-angle-offset)),
        transparent,
        #8B5CF6 var(--gradient-percent),
        white calc(var(--gradient-percent) * 2),
        #8B5CF6 calc(var(--gradient-percent) * 3),
        transparent calc(var(--gradient-percent) * 4)
      )
      border-box;
    box-shadow: inset 0 0 0 1px #1a1818;
    --transition: 800ms cubic-bezier(0.25, 1, 0.5, 1);
    transition: var(--transition);
    transition-property: --gradient-angle-offset, --gradient-percent, --gradient-shine;
  }

  .shiny-cta::before,
  .shiny-cta::after,
  .shiny-cta span::before {
    content: "";
    pointer-events: none;
    position: absolute;
    inset-inline-start: 50%;
    inset-block-start: 50%;
    translate: -50% -50%;
    z-index: -1;
  }

  @keyframes gradient-angle {
    to {
      --gradient-angle: 360deg;
    }
  }

  @keyframes shimmer {
    to {
      rotate: 360deg;
    }
  }

  @keyframes breathe {
    from, to {
      scale: 1;
    }
    50% {
      scale: 1.2;
    }
  }

  /* Animation des points */
  .shiny-cta::before {
    --size: calc(100% - var(--shadow-size) * 3);
    --position: 2px;
    --space: calc(var(--position) * 2);
    width: var(--size);
    height: var(--size);
    background: radial-gradient(
      circle at var(--position) var(--position),
      white calc(var(--position) / 4),
      transparent 0
    ) padding-box;
    background-size: var(--space) var(--space);
    background-repeat: space;
    mask-image: conic-gradient(
      from calc(var(--gradient-angle) + 45deg),
      black,
      transparent 10% 90%,
      black
    );
    border-radius: inherit;
    opacity: 0.4;
    z-index: -1;
  }

  /* Animation de brillance intérieure */
  .shiny-cta::after {
    --animation: shimmer linear infinite;
    width: 100%;
    aspect-ratio: 1;
    background: linear-gradient(
      -50deg,
      transparent,
      #8B5CF6,
      transparent
    );
    mask-image: radial-gradient(circle at bottom, transparent 40%, black);
    opacity: 0.6;
  }

  /* Animation au survol */
  .shiny-cta:hover {
    --gradient-percent: 20%;
    --gradient-angle-offset: 95deg;
    --gradient-shine: #9333EA;
  }

  /* Application des animations */
  .shiny-cta,
  .shiny-cta::before,
  .shiny-cta::after {
    animation: var(--animation) var(--duration),
      var(--animation) calc(var(--duration) / 0.4) reverse paused;
    animation-composition: add;
  }

  .shiny-cta:hover,
  .shiny-cta:hover::before,
  .shiny-cta:hover::after {
    animation-play-state: running;
  }

  /* État désactivé */
  .shiny-cta:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    animation: none;
  }
  .shiny-cta:disabled::before,
  .shiny-cta:disabled::after {
    animation: none;
  }

  /* Animation de l'effet de brillance */
  .shiny-cta span::before {
    --size: calc(100% + 1rem);
    width: var(--size);
    height: var(--size);
    box-shadow: inset 0 -1ex 2rem 4px #8B5CF6;
    opacity: 0;
    transition: opacity var(--transition);
    animation: calc(var(--duration) * 1.5) breathe linear infinite;
  }

  /* Amélioration de l'effet au survol */
  .shiny-cta:is(:hover, :focus-visible) {
    --gradient-percent: 20%;
    --gradient-angle-offset: 95deg;
    --gradient-shine: #9333EA;
  }

  .shiny-cta:is(:hover, :focus-visible) span::before {
    opacity: 1;
  }
`;

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
    <>
      <style jsx>{buttonStyles}</style>
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
            className="shiny-cta w-full"
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
                <span>Lancer la soirée</span>
                <span className="text-4xl">🎊</span>
              </span>
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
    </>
  );
}
