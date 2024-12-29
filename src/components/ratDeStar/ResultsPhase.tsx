import { Celebrity, Team } from "@/types/room";

type ResultsPhaseProps = {
  celebrities: Record<string, Celebrity>;
  teams: Record<string, Team>;
  remainingTeams: string[];
  isHost: boolean;
  onNextGame: () => void;
};

export function ResultsPhase({
  celebrities,
  teams,
  remainingTeams,
  isHost,
  onNextGame,
}: ResultsPhaseProps) {
  const winningTeam = teams[remainingTeams[0]];

  return (
    <div className="container mx-auto p-4">
      <div className="mb-12 text-center">
        <div className="inline-block bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-white mb-4">
            🏆 Équipe Gagnante 🏆
          </h2>
          <div className="flex items-center justify-center gap-4 mb-4">
            <img
              src={winningTeam.avatar}
              alt={winningTeam.name}
              className="w-16 h-16 rounded-full border-4 border-white"
            />
            <div>
              <div className="text-2xl font-bold text-white">
                {winningTeam.name}
              </div>
              <div className="text-sm text-yellow-100">
                {winningTeam.members.map((member) => member.name).join(", ")}
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-center">
        Récapitulatif des trouvailles
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Object.entries(celebrities).map(([id, celebrity]) => (
          <div key={id} className="space-y-2">
            <img
              src={celebrity.imageUrl}
              alt={celebrity.name}
              className="w-full aspect-square object-cover rounded-lg"
            />
            {celebrity.foundBy && (
              <div className="text-sm text-center text-green-600">
                Trouvé par {teams[celebrity.foundBy]?.name || "équipe inconnue"}
              </div>
            )}
          </div>
        ))}
      </div>

      {isHost && (
        <div className="mt-8 text-center">
          <button
            onClick={onNextGame}
            className="bg-blue-600 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Passer au jeu suivant : Qui veut gagner des millions
          </button>
        </div>
      )}
    </div>
  );
}
