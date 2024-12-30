import { Room } from "@/types/room";
import { motion } from "framer-motion";

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
  const currentTeam = teamId ? room.teams[teamId] : null;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {!isHost && currentTeam && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 mb-12"
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
                className="w-40 h-40 mx-auto"
              />
            </motion.div>

            <div>
              <h1 className="text-4xl font-bold text-white">
                {currentTeam.name}
              </h1>
            </div>
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

      <h2 className="text-2xl font-bold mb-4 text-white">
        Rat de Star - Règles du jeu
      </h2>
      <div className="space-y-4 mb-6 text-white/80">
        <p>1. Une mosaïque de célébrités va s'afficher pendant 1 minute</p>
        <p>2. Mémorisez un maximum de personnalités</p>
        <p>3. À tour de rôle, chaque équipe devra nommer une célébrité</p>
        <p>4. Si la réponse est correcte, l'équipe continue</p>
        <p>
          5. Si la réponse est incorrecte ou déjà donnée, l'équipe est éliminée
        </p>
        <p>6. Le jeu continue jusqu'à ce qu'il ne reste qu'une équipe</p>
      </div>

      {isHost && (
        <button
          onClick={onStart}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
        >
          Commencer
        </button>
      )}
    </div>
  );
}
