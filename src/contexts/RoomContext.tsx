import { db } from "@/lib/firebase/config";
import { Room } from "@/types/room";
import { doc, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

type RoomContextType = {
  room: Room | null;
  loading: boolean;
  error: string | null;
};

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({
  children,
  roomId,
}: {
  children: React.ReactNode;
  roomId: string;
}) {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) return;

    const unsubscribe = onSnapshot(
      doc(db, "rooms", roomId),
      (doc) => {
        if (doc.exists()) {
          setRoom({ ...doc.data(), id: doc.id } as Room);
        } else {
          setError("Room not found");
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching room:", error);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [roomId]);

  return (
    <RoomContext.Provider value={{ room, loading, error }}>
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error("useRoom must be used within a RoomProvider");
  }
  return context;
}
