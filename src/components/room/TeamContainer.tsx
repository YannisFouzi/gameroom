import { useDroppable } from "@dnd-kit/core";
import { motion } from "framer-motion";

type TeamContainerProps = {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
};

export function TeamContainer({
  id,
  title,
  children,
  className = "",
}: TeamContainerProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <motion.div
      ref={setNodeRef}
      className={`border rounded-lg p-4 transition-colors ${className} ${
        isOver ? "bg-blue-50 border-blue-500" : ""
      }`}
      initial={false}
      animate={{
        borderColor: isOver ? "#3B82F6" : "#E5E7EB",
        backgroundColor: isOver
          ? "#EFF6FF"
          : className.includes("bg-")
          ? ""
          : "#FFFFFF",
      }}
    >
      <h3 className="font-medium mb-4">{title}</h3>
      <div className="space-y-2">{children}</div>
    </motion.div>
  );
}
