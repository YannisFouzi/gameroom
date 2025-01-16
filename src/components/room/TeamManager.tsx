import { usePlayer } from "@/hooks/usePlayer";
import { roomService } from "@/lib/firebase/roomService";
import { Room } from "@/types/room";
import { useState } from "react";

type TeamManagerProps = {
  room: Room;
  showCreateTeam?: boolean;
};

export default function TeamManager({ room }: TeamManagerProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { teamId, isHost } = usePlayer(room.id);

  const handleCreateTeam = async () => {
    try {
      setIsUpdating(true);
      await roomService.addTeam(room.id, {
        name: `Équipe ${Object.keys(room.teams || {}).length + 1}`,
        members: [{ name: "Nouveau membre" }],
        avatar: "/avatars/avatar1.png",
      });
    } catch (error) {
      console.error("Erreur lors de la création de l'équipe:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(room.teams || {}).map(([tid, team]) => (
          <div
            key={tid}
            className={`border rounded-lg p-4 ${
              tid === teamId ? "bg-white/10" : "bg-white/5"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <img
                src={team.avatar}
                alt={team.name}
                className="w-10 h-10 rounded-full"
              />
              <h3 className="font-medium text-white">{team.name}</h3>
            </div>
            <div className="space-y-2">
              {team.members.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10"
                >
                  <span className="text-white">{member.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
