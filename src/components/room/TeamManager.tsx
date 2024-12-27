import { roomService } from "@/lib/firebase/roomService";
import { Room } from "@/types/room";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useState } from "react";
import { PlayerCard } from "./PlayerCard";
import { TeamContainer } from "./TeamContainer";

type TeamManagerProps = {
  room: Room;
};

export default function TeamManager({ room }: TeamManagerProps) {
  const [isUpdating, setIsUpdating] = useState(false);

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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const playerId = active.id;
    const targetTeamId = over.id;

    // Si le joueur est déplacé dans la même équipe, ne rien faire
    const sourceTeamId = (active.data.current as any)?.teamId;
    if (sourceTeamId === targetTeamId) return;

    try {
      setIsUpdating(true);
      await roomService.assignPlayerToTeam(
        room.id,
        playerId.toString(),
        targetTeamId.toString()
      );
    } catch (error) {
      console.error("Erreur lors du déplacement du joueur:", error);
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
      playerId: id, // Utiliser l'ID comme playerId
    }));

  if (room.settings.gameMode !== "team") return null;

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Équipes</h2>
          <button
            onClick={handleCreateTeam}
            disabled={isUpdating}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Nouvelle équipe
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Zone des joueurs non assignés */}
          <TeamContainer
            id="unassigned"
            title="Joueurs non assignés"
            className="bg-gray-50"
          >
            <SortableContext
              items={unassignedPlayers.map((p) => p.playerId)}
              strategy={rectSortingStrategy}
            >
              {unassignedPlayers.map((player) => (
                <PlayerCard
                  key={player.playerId}
                  player={player}
                  teamId="unassigned"
                />
              ))}
            </SortableContext>
          </TeamContainer>

          {/* Équipes */}
          {Object.entries(room.teams || {}).map(([teamId, team]) => (
            <TeamContainer key={teamId} id={teamId} title={team.name}>
              <SortableContext
                items={team.players}
                strategy={rectSortingStrategy}
              >
                {team.players.map((playerId) => {
                  const player = room.players[playerId];
                  if (!player) return null;
                  return (
                    <PlayerCard
                      key={playerId}
                      player={{ ...player, id: playerId, playerId }}
                      teamId={teamId}
                    />
                  );
                })}
              </SortableContext>
            </TeamContainer>
          ))}
        </div>
      </div>
    </DndContext>
  );
}
