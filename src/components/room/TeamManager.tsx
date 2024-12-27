import { usePlayer } from "@/hooks/usePlayer";
import { roomService } from "@/lib/firebase/roomService";
import { Room } from "@/types/room";
import { useState } from "react";

type TeamManagerProps = {
  room: Room;
};

export default function TeamManager({ room }: TeamManagerProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { playerId, isHost } = usePlayer(room.id);

  const handleCreateTeam = async () => {
    try {
      setIsUpdating(true);
      await roomService.createTeam(room.id, {
        name: `Équipe ${Object.keys(room.teams || {}).length + 1}`,
        score: 0,
        players: [],
      });
    } catch (error) {
      console.error("Erreur lors de la création de l'équipe:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAssignPlayer = async (playerId: string, teamId: string) => {
    try {
      setIsUpdating(true);
      await roomService.assignPlayerToTeam(room.id, playerId, teamId);
    } catch (error) {
      console.error("Erreur lors de l'assignation du joueur:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Obtenir les joueurs sans équipe
  const unassignedPlayers = Object.entries(room.players)
    .filter(([_, player]) => !player.teamId)
    .map(([id, playerData]) => ({
      ...playerData,
      id,
    }));

  if (room.settings.gameMode !== "team") return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Équipes</h2>
        {isHost && (
          <button
            onClick={handleCreateTeam}
            disabled={isUpdating}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Nouvelle équipe
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Zone des joueurs non assignés */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="font-medium mb-4">Joueurs non assignés</h3>
          <div className="space-y-2">
            {unassignedPlayers.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-2 bg-white rounded border"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={player.avatar}
                    alt={player.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{player.name}</span>
                </div>
                {isHost && room.teams && Object.keys(room.teams).length > 0 && (
                  <select
                    onChange={(e) =>
                      handleAssignPlayer(player.id, e.target.value)
                    }
                    className="ml-2 p-1 border rounded text-sm"
                    disabled={isUpdating}
                  >
                    <option value="">Assigner à une équipe</option>
                    {Object.entries(room.teams).map(([teamId, team]) => (
                      <option key={teamId} value={teamId}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Équipes */}
        {Object.entries(room.teams || {}).map(([teamId, team]) => (
          <div key={teamId} className="border rounded-lg p-4">
            <h3 className="font-medium mb-4">{team.name}</h3>
            <div className="space-y-2">
              {team.players.map((playerId) => {
                const player = room.players[playerId];
                if (!player) return null;
                return (
                  <div
                    key={playerId}
                    className="flex items-center justify-between p-2 bg-white rounded border"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={player.avatar}
                        alt={player.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span>{player.name}</span>
                    </div>
                    {isHost && (
                      <button
                        onClick={() =>
                          handleAssignPlayer(playerId, "unassigned")
                        }
                        className="text-red-600 hover:text-red-800 text-sm"
                        disabled={isUpdating}
                      >
                        Retirer
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
