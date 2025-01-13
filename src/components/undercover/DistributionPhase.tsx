import { undercoverService } from "@/lib/firebase/services/undercoverService";
import { Team } from "@/types/room";
import { UndercoverGameData } from "@/types/undercover";
import { motion } from "framer-motion";
import { useState } from "react";

type DistributionPhaseProps = {
  gameData: UndercoverGameData;
  isHost: boolean;
  currentTeam: Team | null;
  teamId: string | null;
  roomId: string;
};

export default function DistributionPhase({
  gameData,
  isHost,
  currentTeam,
  teamId,
  roomId,
}: DistributionPhaseProps) {
  const [showWord, setShowWord] = useState(false);

  if (!teamId || !currentTeam) return null;

  const teamPlayers = gameData.players.filter((p) => p.teamId === teamId);
  const currentIndex = gameData.currentPlayerIndexByTeam[teamId];
  const currentPlayer = teamPlayers[currentIndex];

  const isCurrentPlayer = currentTeam.members.some(
    (member) => member.name === currentPlayer?.memberId
  );

  const handleShowWord = async () => {
    if (!teamId) return;
    await undercoverService.assignWordToCurrentPlayer(roomId, teamId);
    setShowWord(true);
  };

  const handleNextPlayer = async () => {
    if (!teamId) return;
    setShowWord(false);
    await undercoverService.nextPlayer(roomId, teamId);
  };

  if (isHost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Distribution des mots
          </h2>
          <p className="text-xl text-white/80">
            Les joueurs découvrent leur mot à tour de rôle...
          </p>
          <p className="text-2xl font-bold text-white mt-8">
            Au tour de : {currentPlayer?.name}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="max-w-md mx-auto space-y-8 text-center">
        {isCurrentPlayer ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20"
            >
              <h2 className="text-2xl font-bold text-white/80 mb-2">
                {currentPlayer.name}
              </h2>
              <h3 className="text-2xl font-bold text-white mb-4">
                {showWord ? "Ton mot secret" : "C'est ton tour !"}
              </h3>
              {!showWord ? (
                <button
                  onClick={handleShowWord}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-bold text-lg hover:opacity-90 transition-all"
                >
                  Découvrir mon mot
                </button>
              ) : (
                <div className="space-y-6">
                  <div className="text-3xl font-bold text-white">
                    {currentPlayer.role === "Mrwhite"
                      ? "Tu es Mr White !"
                      : currentPlayer.word || "En attente du mot..."}
                  </div>
                  <button
                    onClick={handleNextPlayer}
                    className="bg-blue-600 text-white py-3 px-6 rounded-xl font-bold text-lg hover:opacity-90 transition-all"
                  >
                    Passer au joueur suivant
                  </button>
                </div>
              )}
            </motion.div>
          </>
        ) : (
          <div className="text-xl text-white/80">
            Au tour de {currentPlayer?.name} de découvrir son mot...
          </div>
        )}
      </div>
    </div>
  );
}
