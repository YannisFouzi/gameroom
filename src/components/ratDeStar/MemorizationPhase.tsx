import { ratDeStarService } from "@/lib/firebase/services";
import { Celebrity, Room } from "@/types/room";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type MemorizationPhaseProps = {
  celebrities: Record<string, Celebrity>;
  startTime: number;
  isHost: boolean;
  room: Room;
  teamId: string | null;
};

export function MemorizationPhase({
  celebrities,
  isHost,
  room,
  teamId,
}: MemorizationPhaseProps) {
  const [timeLeft, setTimeLeft] = useState(10);
  const currentTeam = teamId ? room.teams[teamId] : null;

  useEffect(() => {
    const start = room?.gameData?.startTime;
    if (!start) return;

    if (timeLeft === 0) {
      if (isHost) {
        ratDeStarService.startGuessingPhase(room.id);
      }
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - start) / 1000);
      const remaining = Math.max(0, 30 - elapsed);
      setTimeLeft(remaining);
    }, 100);

    return () => clearInterval(interval);
  }, [timeLeft, room, isHost]);

  if (!isHost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
        <div className="max-w-md mx-auto text-center space-y-12">
          {currentTeam && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  animate={{
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <img
                    src={currentTeam.avatar}
                    alt={currentTeam.name}
                    className="w-24 h-24 mx-auto"
                  />
                </motion.div>

                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent">
                  {currentTeam.name}
                </h1>
              </div>

              <div className="space-y-3">
                {currentTeam.members.map((member, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-xl text-white/80"
                  >
                    {member.name}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">
              Mémorisation en cours
            </h2>
            <p className="text-xl text-white/80">
              Regardez l'écran principal et mémorisez un maximum de célébrités !
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col p-2 overflow-hidden">
      <motion.div
        className="text-center mb-2"
        animate={{ scale: timeLeft <= 3 ? [1, 1.02, 1] : 1 }}
        transition={{
          duration: 0.5,
          repeat: timeLeft <= 3 ? Infinity : 0,
          repeatType: "reverse",
        }}
      >
        <div className="inline-block px-4 py-1 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
          <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent">
            {timeLeft}s
          </div>
        </div>
      </motion.div>
      <div className="flex-1 grid grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-1 auto-rows-fr">
        {Object.entries(celebrities).map(([id, celebrity]) => (
          <div key={id} className="flex items-center justify-center p-0.5">
            <div className="relative w-full h-full">
              <img
                src={celebrity.imageUrl}
                alt="Célébrité"
                className="absolute inset-0 w-full h-full object-contain"
                onError={(e) => {
                  console.error(
                    `Erreur de chargement de l'image: ${celebrity.imageUrl}`
                  );
                  e.currentTarget.src = "/ratDeStar/placeholder.jpg";
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
