import RoomQRCode from "@/components/room/RoomQRCode";
import { Room } from "@/types/room";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

type ExplanationPhaseProps = {
  isHost: boolean;
  onStart: () => void;
  room: Room;
  teamId: string | null;
};

export function ExplanationPhase({
  isHost,
  onStart,
  room,
  teamId,
}: ExplanationPhaseProps) {
  const pathname = usePathname();
  const currentUrl = `${window.location.origin}${pathname}`;
  const currentTeam = teamId ? room.teams[teamId] : null;

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen flex flex-col items-center justify-center">
      {!isHost && currentTeam && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
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
              className="w-32 h-32 mx-auto mb-4"
            />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-4">
            {currentTeam.name}
          </h1>
          <div className="flex flex-wrap justify-center gap-4">
            {currentTeam.members.map((member, index) => (
              <span key={index} className="text-white/80 text-xl">
                {member.name}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-16"
      >
        <h2 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent">
          Rat de Star
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
        >
          <div className="text-6xl mb-6">👀</div>
          <h3 className="text-3xl font-bold text-white mb-4">1. Observation</h3>
          <p className="text-2xl text-white/80 leading-relaxed">
            30 secondes pour retenir les célébrités ! Ouvrez grand les yeux 🔍
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
        >
          <div className="text-6xl mb-6">🎯</div>
          <h3 className="text-3xl font-bold text-white mb-4">2. Action</h3>
          <p className="text-2xl text-white/80 leading-relaxed">
            Citez les stars à tour de rôle. Soyez rapides et précis ⚡️
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
        >
          <div className="text-6xl mb-6">🏆</div>
          <h3 className="text-3xl font-bold text-white mb-4">3. Élimination</h3>
          <p className="text-2xl text-white/80 leading-relaxed">
            La première équipe à faire une erreure perd ! Restez en vie pour la
            victoire 🔥
          </p>
        </motion.div>
      </div>

      {isHost && (
        <div className="mt-8 space-y-8 w-full max-w-2xl">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={onStart}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-xl font-bold text-2xl shadow-lg hover:shadow-xl transition-all hover:opacity-90"
          >
            Lancer le jeu 🎮
          </motion.button>
          <RoomQRCode roomId={room.id} fullUrl={currentUrl} showButton={true} />
        </div>
      )}
    </div>
  );
}
