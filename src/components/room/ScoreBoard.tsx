import { roomService } from "@/lib/firebase/roomService";
import { Room } from "@/types/room";
import { useState } from "react";

type ScoreBoardProps = {
  room: Room;
  playerId: string | null;
  isHost: boolean;
};

export default function ScoreBoard({
  room,
  playerId,
  isHost,
}: ScoreBoardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleScoreUpdate = async (
    targetId: string,
    currentScore: number,
    increment: number
  ) => {
    try {
      setIsUpdating(true);
      const newScore = currentScore + increment;
      if (room.settings.gameMode === "team") {
        await roomService.updateTeamScore(room.id, targetId, newScore);
      } else {
        await roomService.updatePlayerScore(room.id, targetId, newScore);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du score:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const renderScoreControls = (id: string, currentScore: number) => {
    if (!isHost) return null;

    return (
      <div className="flex gap-2">
        <button
          onClick={() => handleScoreUpdate(id, currentScore, -1)}
          disabled={isUpdating}
          className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
        >
          -1
        </button>
        <button
          onClick={() => handleScoreUpdate(id, currentScore, 1)}
          disabled={isUpdating}
          className="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50"
        >
          +1
        </button>
      </div>
    );
  };

  if (room.settings.gameMode === "team") {
    return (
      <div className="bg-background p-6 rounded-lg border mb-6">
        <h2 className="text-xl font-semibold mb-4">Scores des équipes</h2>
        <div className="space-y-4">
          {Object.entries(room.teams || {}).map(([teamId, team]) => (
            <div
              key={teamId}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <div>
                <h3 className="font-medium">{team.name}</h3>
                <p className="text-sm text-gray-600">
                  {team.players.length} joueurs
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xl font-bold">{team.score}</span>
                {renderScoreControls(teamId, team.score)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background p-6 rounded-lg border mb-6">
      <h2 className="text-xl font-semibold mb-4">Scores des joueurs</h2>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {Object.entries(room.players).map(([pid, player]) => (
          <div
            key={pid}
            className={`flex items-center justify-between p-3 rounded-md ${
              pid === playerId ? "bg-blue-50" : "bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={player.avatar}
                alt={player.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="font-medium">{player.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold">{player.score}</span>
              {renderScoreControls(pid, player.score)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
