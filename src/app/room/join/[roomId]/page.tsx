"use client";

import TeamForm from "@/components/room/TeamForm";
import { roomService } from "@/lib/firebase/roomService";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function JoinRoomPage() {
  const router = useRouter();
  const { roomId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoinRoom = async (teamData: {
    name: string;
    members: { name: string }[];
    avatar: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      const { teamId, deviceId } = await roomService.addTeam(
        roomId as string,
        teamData
      );

      // Stocker l'ID de l'équipe et du device
      localStorage.setItem(`team_${roomId}`, teamId);
      localStorage.setItem(`device_${roomId}`, deviceId);

      router.push(`/room/${roomId}`);
    } catch (err) {
      console.error("Erreur lors de la connexion à la room:", err);
      setError("Impossible de rejoindre la partie. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Rejoindre la partie</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <TeamForm onSubmit={handleJoinRoom} isLoading={isLoading} />
    </div>
  );
}
