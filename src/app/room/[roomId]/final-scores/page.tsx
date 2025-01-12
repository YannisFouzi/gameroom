"use client";

import { RoomProvider, useRoom } from "@/contexts/RoomContext";
import { GameScores } from "@/types/room";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function FinalScoresContent() {
  const { room } = useRoom();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) return;

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
  }, []);

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
          className="text-4xl font-bold text-center text-white mt-8"
        >
          🏆 Scores Finaux 🏆
        </motion.h1>

        {/* Section gagnant */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl p-8 text-center shadow-[0_0_30px_rgba(251,191,36,0.3)]"
        >
          <h3 className="text-3xl font-extrabold mb-6">🎉 Grand Gagnant 🎉</h3>
          <div className="flex items-center justify-center gap-6 mb-4">
            <img src={winner.avatar} alt={winner.name} className="w-24 h-24" />
            <div>
              <div className="text-4xl font-bold">{winner.name}</div>
              <div className="text-2xl font-semibold">
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
                    <span className="text-2xl text-white/80">#{index + 1}</span>
                    <img src={team.avatar} alt="" className="w-12 h-12" />
                    <span className="text-xl font-bold text-white">
                      {team.name}
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-white">
                    {team.totalScore} pts
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-4 text-sm text-white/70">
                  <div>
                    Qui veut gagner des millions : {team.millionaireScore} pts
                  </div>
                  <div>Tu te mets combien ? : {team.evaluationScore} pts</div>
                  <div>Undercover : {team.undercoverScore} pts</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
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
