import { useState } from "react";

type GuessingPhaseProps = {
  isCurrentTeam: boolean;
  onSubmit: (guess: string) => Promise<boolean>;
};

export function GuessingPhase({ isCurrentTeam, onSubmit }: GuessingPhaseProps) {
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim()) {
      try {
        const isCorrect = await onSubmit(guess);
        setFeedback({
          type: isCorrect ? "success" : "error",
          message: isCorrect
            ? "Bonne réponse ! Continuez !"
            : "Mauvaise réponse... Votre équipe est éliminée.",
        });
        setGuess("");

        setTimeout(() => {
          setFeedback(null);
        }, 3000);
      } catch (error) {
        console.error("Erreur lors de la soumission:", error);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Phase de réponse</h2>
      {isCurrentTeam ? (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="Nom de la célébrité"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Valider
            </button>
          </form>
          {feedback && (
            <div
              className={`mt-4 p-4 rounded-lg text-center ${
                feedback.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {feedback.message}
            </div>
          )}
        </>
      ) : (
        <p className="text-center">
          En attente de la réponse de l'équipe active...
        </p>
      )}
    </div>
  );
}
