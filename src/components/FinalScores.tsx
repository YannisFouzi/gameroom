import { Room } from "@/types/room";
import { motion } from "framer-motion";

type FinalScoresProps = {
  room: Room;
  isHost: boolean;
  teamId?: string;
};

export function FinalScores({ room, isHost, teamId }: FinalScoresProps) {
  const scores = room.gameData?.scores || {};
  const teams = room.teams || {};

  // Calculer les scores totaux
  const totalScores = Object.entries(teams)
    .map(([id, team]) => ({
      teamId: id,
      name: team.name,
      avatar: team.avatar,
      millionaireScore: scores.millionaire?.[id] || 0,
      evaluationScore: scores.evaluation?.[id] || 0,
      totalScore:
        (scores.millionaire?.[id] || 0) + (scores.evaluation?.[id] || 0),
    }))
    .sort((a, b) => b.totalScore - a.totalScore);

  const winner = totalScores[0];

  if (isHost) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Section gagnant */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl p-8 text-center shadow-[0_0_30px_rgba(251,191,36,0.3)]"
        >
          <h3 className="text-3xl font-extrabold mb-6">🏆 Grand Gagnant 🏆</h3>
          <div className="flex items-center justify-center gap-6 mb-4">
            <img src={winner.avatar} alt={winner.name} className="w-24 h-24" />
            <div>
              <div className="text-4xl font-bold">{winner.name}</div>
              <div className="text-2xl font-semibold">
                {winner.totalScore} points
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-lg">
            <div>
              Qui veut gagner des millions : {winner.millionaireScore} pts
            </div>
            <div>Tu te mets combien : {winner.evaluationScore} pts</div>
          </div>
        </motion.div>

        {/* Autres équipes */}
        {totalScores.slice(1).map((team, index) => (
          <motion.div
            key={team.teamId}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-white/80">
                #{index + 2}
              </span>
              <img src={team.avatar} alt={team.name} className="w-12 h-12" />
              <div>
                <span className="text-xl font-medium text-white block">
                  {team.name}
                </span>
                <span className="text-sm text-white/70">
                  Millions: {team.millionaireScore} pts • Évaluation:{" "}
                  {team.evaluationScore} pts
                </span>
              </div>
            </div>
            <span className="text-xl font-bold text-white">
              {team.totalScore} points
            </span>
          </motion.div>
        ))}
      </div>
    );
  }

  // Vue joueur
  const playerTeam = totalScores.find((team) => team.teamId === teamId);
  const playerRank =
    totalScores.findIndex((team) => team.teamId === teamId) + 1;

  return (
    <div className="max-w-md mx-auto p-6 text-center space-y-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-blue-900/50 backdrop-blur-sm p-8 rounded-xl border border-blue-400"
      >
        <h2 className="text-3xl font-bold text-white mb-6">
          {playerTeam?.name}
        </h2>
        <div className="space-y-6">
          <img
            src={playerTeam?.avatar}
            alt={playerTeam?.name}
            className="w-20 h-20 mx-auto"
          />
          <div className="space-y-4">
            <div className="text-2xl font-bold text-white">
              {playerTeam?.totalScore} points au total
            </div>
            <div className="space-y-2 text-lg text-white/80">
              <div>Millions : {playerTeam?.millionaireScore} pts</div>
              <div>Évaluation : {playerTeam?.evaluationScore} pts</div>
            </div>
            <div className="text-xl text-white/80">
              #{playerRank} au classement final
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
