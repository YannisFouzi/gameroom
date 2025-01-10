"use client";

import HostControls from "@/components/room/HostControls";
import RoomQRCode from "@/components/room/RoomQRCode";
import ScoreBoard from "@/components/room/ScoreBoard";
import { RoomProvider, useRoom } from "@/contexts/RoomContext";
import { usePlayer } from "@/hooks/usePlayer";
import { usePresence } from "@/hooks/usePresence";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function RoomContent() {
  const { roomId } = useParams();
  const { room, loading, error } = useRoom();
  const { teamId, isHost } = usePlayer(roomId as string);
  const router = useRouter();
  usePresence(roomId as string);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    const audio = new Audio(
      "/sound/musique/Gilbert Montagné - Just Because of You.mp3"
    );
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    if (!loading && room) {
      audio.play().catch((error) => {
        console.log("Erreur de lecture audio:", error);
      });
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [loading, room]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (room?.status === "playing") {
      router.push(`/room/${room.id}/game`);
    }
  }, [room?.status, room?.id, router]);

  const renderPlayerView = () => {
    if (!room) return null;
    const currentTeam = room.teams[teamId || ""];
    if (!currentTeam) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="space-y-4">
          <motion.div
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <img
              src={currentTeam.avatar}
              alt={currentTeam.name}
              className="w-40 h-40 mx-auto rounded-full object-cover"
            />
          </motion.div>

          <div>
            <h1 className="text-4xl font-bold text-white">
              {currentTeam.name}
            </h1>
          </div>
        </div>

        <div className="space-y-3">
          {currentTeam.members.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-xl text-white/80"
            >
              {member.name}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mt-12 text-purple-300/80 text-lg"
        >
          En attente du lancement de la partie...
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="inline-block ml-1"
          >
            🎮
          </motion.span>
        </motion.div>
      </motion.div>
    );
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error || "Room introuvable"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="container mx-auto p-4 min-h-screen flex flex-col items-center">
        <div className="flex-1 w-full flex items-center justify-center">
          <div className="max-w-2xl w-full space-y-8">
            {isHost ? (
              // Vue de l'hôte
              <>
                <HostControls room={room} />
                <ScoreBoard room={room} teamId={teamId} isHost={isHost} />
                <div className="mt-8">
                  <RoomQRCode roomId={roomId as string} showButton={false} />
                </div>
              </>
            ) : (
              // Vue des joueurs
              renderPlayerView()
            )}
          </div>
        </div>
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-gray-800/80 p-3 rounded-lg">
          <span className="text-white text-sm font-medium">Volume</span>
          <span className="text-white">🔈</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-48 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 hover:[&::-webkit-slider-thumb]:bg-purple-600"
          />
          <span className="text-white">🔊</span>
        </div>
      </div>
    </div>
  );
}

export default function RoomPage() {
  const { roomId } = useParams();

  return (
    <RoomProvider roomId={roomId as string}>
      <RoomContent />
    </RoomProvider>
  );
}
