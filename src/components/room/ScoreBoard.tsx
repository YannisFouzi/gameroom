import { Room } from "@/types/room";
import { motion } from "framer-motion";

type ScoreBoardProps = {
  room: Room;
  teamId?: string;
  isHost: boolean;
};

export default function ScoreBoard({ room, teamId, isHost }: ScoreBoardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Object.entries(room.teams).map(([id, team]) => (
        <motion.div
          key={id}
          className={`p-4 rounded-xl backdrop-blur-sm border ${
            id === teamId
              ? "border-purple-500 bg-white/10"
              : "border-white/10 bg-white/5"
          }`}
        >
          <div className="flex items-center space-x-4">
            <img
              src={team.avatar}
              alt={team.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold text-white">{team.name}</h3>
              <p className="text-sm text-white/60">
                {team.members.map((m) => m.name).join(", ")}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
