import { Room } from "@/types/room";
import { motion } from "framer-motion";

type ScoreDisplayProps = {
  room: Room;
  currentTeam: string;
};

export default function ScoreDisplay({ room, currentTeam }: ScoreDisplayProps) {
  const scores = room.gameData?.scores || {};

  return (
    <div className="bg-gray-50 p-3 rounded-lg mb-4">
      <h3 className="text-base font-semibold mb-2 text-black">Scores</h3>
      <div className="space-y-1">
        {Object.entries(room.teams).map(([teamId, team]) => (
          <motion.div
            key={teamId}
            className={`p-2 rounded-lg ${
              teamId === currentTeam ? "bg-blue-50" : "bg-white"
            } text-black`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img
                    src={team.avatar}
                    alt={team.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <span className="font-medium text-sm text-black">
                  {team.name}
                </span>
              </div>
              <span className="text-base font-bold text-black">
                {scores[teamId] || 0} point
                {(scores[teamId] || 0) > 1 ? "s" : ""}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
