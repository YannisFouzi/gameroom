"use client";

import TeamForm from "@/components/room/TeamForm";
import { roomService } from "@/lib/firebase/roomService";
import { motion } from "framer-motion";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-center"
            >
              {error}
            </motion.div>
          )}

          <TeamForm onSubmit={handleJoinRoom} isLoading={isLoading} />
        </motion.div>
      </div>
    </div>
  );
}
