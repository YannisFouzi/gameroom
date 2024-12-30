import { Room } from "@/types/room";

type ScoreBoardProps = {
  room: Room;
  teamId: string | null;
  isHost: boolean;
};

export default function ScoreBoard({ room, teamId, isHost }: ScoreBoardProps) {
  return (
    <div className="space-y-4">
      {Object.entries(room.teams).map(([tid, team]) => (
        <div
          key={tid}
          className={`flex items-center p-3 rounded-md ${
            tid === teamId ? "bg-white/10" : "bg-white/5"
          }`}
        >
          <div className="flex items-center gap-3">
            <img src={team.avatar} alt={team.name} className="w-12 h-12" />
            <div>
              <span className="font-medium text-white">{team.name}</span>
              <p className="text-sm text-gray-300">
                {team.members.map((member) => member.name).join(", ")}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
