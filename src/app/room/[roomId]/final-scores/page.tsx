"use client";

import { RoomProvider, useRoom } from "@/contexts/RoomContext";
import { usePlayer } from "@/hooks/usePlayer";
import { GameScores } from "@/types/room";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function FinalScoresContent() {
  const { room } = useRoom();
  const { isHost } = usePlayer(room?.id || "");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState(0.2);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const colors = [
      "#FFD700",
      "#FF1493",
      "#00FF00",
      "#00BFFF",
      "#FF4500",
      "#9400D3",
    ];

    const firework = (x: number) => {
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x, y: 0.6 },
          colors,
          shapes: ["star", "circle"],
          scalar: 2,
        });
      }, 250);
    };

    const bigExplosion = () => {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors,
        shapes: ["star"],
        scalar: 2,
        ticks: 300,
        gravity: 1.2,
        drift: 0,
        startVelocity: 35,
      });
    };

    const sideCannons = () => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.6 },
        colors,
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.6 },
        colors,
      });
    };

    // Séquence d'animations
    const runAnimation = () => {
      // Explosion initiale
      bigExplosion();

      // Canons latéraux après 500ms
      setTimeout(sideCannons, 500);

      // Feux d'artifice après 1s
      setTimeout(() => {
        firework(0.25);
        setTimeout(() => firework(0.75), 200);
      }, 1000);
    };

    // Lancer la première séquence
    runAnimation();

    // Répéter la séquence toutes les 2 secondes pendant 5 secondes
    const interval = setInterval(runAnimation, 2000);
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  console.log("Room data:", room);
  console.log("Scores data:", room?.gameData?.scores);

  if (!room?.gameData?.scores) {
    console.log("Scores manquants");
    return <div>Chargement...</div>;
  }

  const scores = room.gameData.scores as GameScores;
  console.log("Scores après cast:", scores);

  const { millionaire = {}, evaluation = {}, undercover = {} } = scores;

  // Calculer les scores totaux
  const totalScores: Record<string, number> = {};
  Object.keys(room.teams).forEach((teamId) => {
    totalScores[teamId] =
      (millionaire[teamId] || 0) +
      (evaluation[teamId] || 0) +
      (undercover[teamId] || 0);
  });

  // Trier les équipes par score total
  const sortedTeams = Object.entries(room.teams)
    .map(([id, team]) => ({
      id,
      name: team.name,
      avatar: team.avatar,
      millionaireScore: millionaire[id] || 0,
      evaluationScore: evaluation[id] || 0,
      undercoverScore: undercover[id] || 0,
      totalScore: totalScores[id],
    }))
    .sort((a, b) => b.totalScore - a.totalScore);

  const winner = sortedTeams[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`text-center text-white mt-8 ${
            isHost ? "text-6xl" : "text-4xl"
          } font-bold`}
        >
          🏆 Scores Finaux 🏆
        </motion.h1>

        {/* Section gagnant */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl p-8 text-center shadow-[0_0_30px_rgba(251,191,36,0.3)]"
        >
          <h3
            className={`${
              isHost ? "text-5xl" : "text-3xl"
            } font-extrabold mb-6`}
          >
            🎉 Grand Gagnant 🎉
          </h3>
          <div className="flex items-center justify-center gap-6 mb-4">
            <img
              src={winner.avatar}
              alt={winner.name}
              className={`${isHost ? "w-32 h-32" : "w-24 h-24"}`}
            />
            <div>
              <div className={`${isHost ? "text-6xl" : "text-4xl"} font-bold`}>
                {winner.name}
              </div>
              <div
                className={`${isHost ? "text-4xl" : "text-2xl"} font-semibold`}
              >
                {winner.totalScore} points
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tableau des scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
        >
          <div className="space-y-4">
            {sortedTeams.map((team, index) => (
              <div
                key={team.id}
                className="bg-white/5 p-4 rounded-lg border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span
                      className={`${
                        isHost ? "text-4xl" : "text-2xl"
                      } text-white/80`}
                    >
                      #{index + 1}
                    </span>
                    <img
                      src={team.avatar}
                      alt=""
                      className={`${isHost ? "w-16 h-16" : "w-12 h-12"}`}
                    />
                    <span
                      className={`${
                        isHost ? "text-3xl" : "text-xl"
                      } font-bold text-white`}
                    >
                      {team.name}
                    </span>
                  </div>
                  <span
                    className={`${
                      isHost ? "text-4xl" : "text-2xl"
                    } font-bold text-white`}
                  >
                    {team.totalScore} pts
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-4 text-white/70">
                  <div
                    className={`${
                      isHost ? "text-2xl" : "text-lg"
                    } font-medium text-white/90 flex flex-col items-center`}
                  >
                    <span className="mb-1">Qui veut gagner des millions</span>
                    <span
                      className={`${
                        isHost ? "text-3xl" : "text-xl"
                      } font-bold text-white`}
                    >
                      {team.millionaireScore} pts
                    </span>
                  </div>
                  <div
                    className={`${
                      isHost ? "text-2xl" : "text-lg"
                    } font-medium text-white/90 flex flex-col items-center`}
                  >
                    <span className="mb-1">Tu te mets combien ?</span>
                    <span
                      className={`${
                        isHost ? "text-3xl" : "text-xl"
                      } font-bold text-white`}
                    >
                      {team.evaluationScore} pts
                    </span>
                  </div>
                  <div
                    className={`${
                      isHost ? "text-2xl" : "text-lg"
                    } font-medium text-white/90 flex flex-col items-center`}
                  >
                    <span className="mb-1">Undercover</span>
                    <span
                      className={`${
                        isHost ? "text-3xl" : "text-xl"
                      } font-bold text-white`}
                    >
                      {team.undercoverScore} pts
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {isHost && (
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
      )}
    </div>
  );
}

export default function FinalScoresPage() {
  const { roomId } = useParams();
  return (
    <RoomProvider roomId={roomId as string}>
      <FinalScoresContent />
    </RoomProvider>
  );
}
