import { useDroppable } from "@dnd-kit/core";

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
    <div
      ref={setNodeRef}
      className={`border rounded-lg p-4 transition-all duration-200 ${className} ${
        isOver ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
      }`}
    >
      <h3 className="font-medium mb-4">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
