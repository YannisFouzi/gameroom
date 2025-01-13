"use client";

import SnowEffect from "@/components/effects/SnowEffect";
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
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isHost || isInitialized) return;

    const audio = new Audio(
      "/sound/musique/Gilbert Montagné - Just Because of You.mp3"
    );
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    audio.addEventListener(
      "canplaythrough",
      () => {
        if (!isInitialized) {
          audio
            .play()
            .then(() => {
              setIsInitialized(true);
            })
            .catch((error) => {
              console.log("Erreur de lecture audio:", error);
            });
        }
      },
      { once: true }
    );

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
      setIsInitialized(false);
    };
  }, [isHost]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (room?.status === "playing") {
      console.log("Redirection vers la page de jeu...");
      router.push(`/room/${roomId}/game`);
    }
  }, [room?.status, roomId, router]);

  const getConnectedTeamsCount = (room: any) => {
    if (!room || !room.teams) return 0;
    return Object.values(room.teams).filter(
      (team: any) => team.members && team.members.length > 0
    ).length;
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black relative">
      <SnowEffect />
      {isHost && (
        <>
          <motion.img
            src="/images/bronze/christian.png"
            alt="Bronze 1"
            className="absolute top-[8%] left-8 w-40 h-40 object-contain"
            animate={{ rotate: [-15, 15, -15] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.img
            src="/images/bronze/gerard.png"
            alt="Bronze 2"
            className="absolute top-[42%] left-56 w-40 h-40 object-contain"
            animate={{ rotate: [-15, 15, -15] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
          />
          <motion.img
            src="/images/bronze/josiane.png"
            alt="Bronze 3"
            className="absolute bottom-[18%] left-24 w-40 h-40 object-contain"
            animate={{ rotate: [-15, 15, -15] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6,
            }}
          />
          <motion.img
            src="/images/bronze/marie.png"
            alt="Bronze 4"
            className="absolute top-[12%] right-64 w-40 h-40 object-contain"
            animate={{ rotate: [-15, 15, -15] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.9,
            }}
          />
          <motion.img
            src="/images/bronze/michel.png"
            alt="Bronze 5"
            className="absolute top-[73%] right-12 w-40 h-40 object-contain"
            animate={{ rotate: [-15, 15, -15] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.2,
            }}
          />
          <motion.img
            src="/images/bronze/thierry.png"
            alt="Bronze 6"
            className="absolute bottom-[45%] right-32 w-40 h-40 object-contain"
            animate={{ rotate: [-15, 15, -15] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            }}
          />
        </>
      )}

      <div className="container mx-auto p-4 min-h-screen flex flex-col">
        <div className="flex-1 w-full">
          <div
            className={`mx-auto space-y-8 mb-8 ${
              getConnectedTeamsCount(room) === 2 ? "max-w-5xl" : "max-w-2xl"
            }`}
          >
            {isHost ? (
              <>
                <div className="relative">
                  <div className="absolute inset-0 opacity-20">
                    <SnowEffect />
                  </div>
                  <div className="relative z-10">
                    <HostControls room={room} />
                    <div className="mt-8">
                      <ScoreBoard room={room} teamId={teamId} isHost={isHost} />
                    </div>
                    {getConnectedTeamsCount(room) < 2 && (
                      <div className="mt-6">
                        <RoomQRCode
                          roomId={roomId as string}
                          showButton={false}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="relative">
                <div className="absolute inset-0 opacity-20">
                  <SnowEffect />
                </div>
                {renderPlayerView()}
              </div>
            )}
          </div>

          {isHost && (
            <div className="w-full max-w-5xl mx-auto mt-4">
              <img
                src="/images/bronze_jeu.png"
                alt="Les Bronzés font du ski"
                className="w-full h-auto object-contain"
              />
            </div>
          )}
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
