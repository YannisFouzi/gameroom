import { Player } from "@/types/room";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";

type PlayerCardProps = {
  player: Player & { playerId?: string };
  teamId: string;
};

export function PlayerCard({ player, teamId }: PlayerCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
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
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
    touchAction: "none",
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center gap-2 p-2 bg-white rounded border hover:shadow-md transition-shadow
        ${isDragging ? "shadow-lg border-blue-500" : "border-gray-200"}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <img
        src={player.avatar}
        alt={player.name}
        className="w-8 h-8 rounded-full"
        draggable={false}
      />
      <span className="select-none">{player.name}</span>
    </motion.div>
  );
}
