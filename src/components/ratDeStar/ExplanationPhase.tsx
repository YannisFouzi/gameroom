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
    <div className="max-w-4xl mx-auto p-6">
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
                className="w-24 h-24 mx-auto"
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent">
          Rat de Star
        </h2>
        <p className="text-xl text-white/80">Prêt à tester votre mémoire ?</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10"
        >
          <div className="text-3xl mb-4">👀</div>
          <h3 className="text-xl font-bold text-white mb-2">
            Phase 1: Observation
          </h3>
          <p className="text-white/80">
            Une mosaïque de célébrités va s'afficher pendant 1 minute.
            Mémorisez-en un maximum !
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10"
        >
          <div className="text-3xl mb-4">🎯</div>
          <h3 className="text-xl font-bold text-white mb-2">Phase 2: Action</h3>
          <p className="text-white/80">
            À tour de rôle, chaque équipe nomme une célébrité. Soyez
            stratégiques !
          </p>
          <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
            <p className="text-sm text-white/70">
              <span className="text-yellow-400">⚠️ Important :</span> Vous
              pouvez entrer soit le nom complet, soit uniquement le nom de
              famille. Seule l'orthographe compte, pas les majuscules !
            </p>
            <p className="text-sm text-white/70 mt-2">
              Exemples : "alain delon" ou "delon"
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10"
        >
          <div className="text-3xl mb-4">🏆</div>
          <h3 className="text-xl font-bold text-white mb-2">
            Phase 3: Élimination
          </h3>
          <p className="text-white/80">
            Une erreur ou une répétition élimine l'équipe. Dernière équipe en
            lice gagne !
          </p>
          <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
            <p className="text-sm text-white/70">
              <span className="text-yellow-400">🎲 Bonus :</span> L'équipe
              gagnante commencera le prochain jeu en premier !
            </p>
          </div>
        </motion.div>
      </div>

      {isHost && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={onStart}
          className="w-full mt-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all hover:opacity-90"
        >
          Lancer le jeu 🎮
        </motion.button>
      )}
    </div>
  );
}
