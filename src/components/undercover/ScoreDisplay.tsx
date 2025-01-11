import { Team } from "@/types/room";
import { motion } from "framer-motion";

type ScoreDisplayProps = {
  scores: Record<string, number>;
  teams: Record<string, Team>;
};

export default function ScoreDisplay({ scores, teams }: ScoreDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-white/10 shadow-lg"
    >
      <h3 className="text-lg font-bold text-white mb-3">Scores en direct</h3>
      <div className="space-y-2">
        {Object.entries(teams).map(([teamId, team]) => (
          <div
            key={teamId}
            className="flex items-center justify-between gap-4 text-white/90"
          >
            <div className="flex items-center gap-2">
              <img src={team.avatar} alt="" className="w-6 h-6" />
              <span>{team.name}</span>
            </div>
            <span className="font-bold text-lg">{scores[teamId] || 0} pts</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
