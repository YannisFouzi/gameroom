import { useRoom } from "@/contexts/RoomContext";
import { ratDeStarService } from "@/lib/firebase/services";
import { Celebrity } from "@/types/room";
import { useEffect, useState } from "react";

type MemorizationPhaseProps = {
  celebrities: Record<string, Celebrity>;
  startTime: number;
  isHost: boolean;
};

export function MemorizationPhase({
  celebrities,
  startTime,
  isHost,
}: MemorizationPhaseProps) {
  const [timeLeft, setTimeLeft] = useState(10);
  const { room } = useRoom();

  useEffect(() => {
    const start = room?.gameData?.startTime;
    if (!start) return;

    if (timeLeft === 0) {
      if (isHost) {
        ratDeStarService.startGuessingPhase(room.id);
      }
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - start) / 1000);
      const remaining = Math.max(0, 10 - elapsed);
      setTimeLeft(remaining);
    }, 100);

    return () => clearInterval(interval);
  }, [timeLeft, room, isHost]);

  if (!isHost) {
    return (
      <div className="container mx-auto p-4">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Mémorisation en cours</h2>
          <p className="text-xl">Regardez l'écran principal</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-6">
        <div className="text-4xl font-bold">{timeLeft}s</div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Object.entries(celebrities).map(([id, celebrity]) => (
          <div key={id} className="aspect-square">
            <img
              src={celebrity.imageUrl}
              alt="Célébrité"
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                console.error(
                  `Erreur de chargement de l'image: ${celebrity.imageUrl}`
                );
                e.currentTarget.src = "/ratDeStar/placeholder.jpg";
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
