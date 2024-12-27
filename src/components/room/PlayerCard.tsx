import { Player } from "@/types/room";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type PlayerCardProps = {
  player: Player & { playerId?: string };
  teamId: string;
};

export function PlayerCard({ player, teamId }: PlayerCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: player.playerId || player.id,
      data: {
        type: "player",
        teamId,
        player,
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center gap-2 p-2 bg-white rounded border cursor-move hover:bg-gray-50"
    >
      <img
        src={player.avatar}
        alt={player.name}
        className="w-8 h-8 rounded-full"
      />
      <span>{player.name}</span>
    </div>
  );
}
