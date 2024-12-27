import { Room } from "@/types/room";
import { AnimatePresence, motion } from "framer-motion";

type WaitingPlayersProps = {
  room: Room;
  currentPlayerId: string | null;
};

export default function WaitingPlayers({
  room,
  currentPlayerId,
}: WaitingPlayersProps) {
  return (
    <div className="bg-background p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">
        Joueurs en attente ({Object.keys(room.players).length}/
        {room.settings.maxPlayers})
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <AnimatePresence>
          {Object.entries(room.players).map(([pid, player]) => (
            <motion.div
              key={pid}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`p-3 rounded-lg ${
                pid === currentPlayerId
                  ? "bg-blue-50 border-blue-200"
                  : "bg-gray-50 border-gray-200"
              } border`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <img
                    src={player.avatar}
                    alt={player.name}
                    className="w-16 h-16 rounded-full mb-2"
                  />
                  <div
                    className={`absolute bottom-2 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      player.isOnline ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                </div>
                <span className="font-medium text-sm">{player.name}</span>
                {pid === room.hostId && (
                  <span className="text-xs text-blue-600 mt-1">
                    Maître du jeu
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
