import { roomService } from "@/lib/firebase/roomService";
import { Room } from "@/types/room";
import { useState } from "react";

type ScoreBoardProps = {
  room: Room;
  teamId: string | null;
  isHost: boolean;
};

export default function ScoreBoard({ room, teamId, isHost }: ScoreBoardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleScoreChange = async (targetTeamId: string, newScore: number) => {
    try {
      setIsUpdating(true);
      await roomService.updateTeamScore(room.id, targetTeamId, newScore);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du score:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const renderScoreControls = (targetTeamId: string, currentScore: number) => {
    if (!isHost) return null;

    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleScoreChange(targetTeamId, currentScore - 1)}
          disabled={isUpdating || currentScore <= 0}
          className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
        >
          -
        </button>
        <button
          onClick={() => handleScoreChange(targetTeamId, currentScore + 1)}
          disabled={isUpdating}
          className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
        >
          +
        </button>
      </div>
    );
  };

  return (
    <div className="bg-background p-6 rounded-lg border mb-6">
      <h2 className="text-xl font-semibold mb-4">Scores des équipes</h2>
      <div className="space-y-4">
        {Object.entries(room.teams).map(([tid, team]) => (
          <div
            key={tid}
            className={`flex items-center justify-between p-3 rounded-md ${
              tid === teamId ? "bg-blue-50" : "bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={team.avatar}
                alt={team.name}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <span className="font-medium">{team.name}</span>
                <p className="text-sm text-gray-600">
                  {team.members.map((member) => member.name).join(", ")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold">{team.score}</span>
              {renderScoreControls(tid, team.score)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
