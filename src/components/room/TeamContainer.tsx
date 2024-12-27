import { useDroppable } from "@dnd-kit/core";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Fonction utilitaire locale si l'import ne fonctionne pas
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
  className,
}: TeamContainerProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className={cn("border rounded-lg p-4", className)}>
      <h3 className="font-medium mb-4">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
