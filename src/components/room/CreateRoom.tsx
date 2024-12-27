import { roomService } from "@/lib/firebase/roomService";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateRoom() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRoom = async () => {
    try {
      setIsLoading(true);
      const hostId = crypto.randomUUID();
      const roomId = await roomService.createRoom(hostId);

      // Stocker l'ID de l'hôte avec un préfixe différent
      localStorage.setItem(`host_${roomId}`, hostId);

      router.push(`/room/${roomId}`);
    } catch (error) {
      console.error("Erreur lors de la création de la room:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <button
        onClick={handleCreateRoom}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? "Création..." : "Créer une nouvelle room"}
      </button>
    </div>
  );
}
