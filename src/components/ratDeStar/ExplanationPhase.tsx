type ExplanationPhaseProps = {
  isHost: boolean;
  onStart: () => void;
};

export function ExplanationPhase({ isHost, onStart }: ExplanationPhaseProps) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Rat de Star - Règles du jeu</h2>
      <div className="space-y-4 mb-6">
        <p>1. Une mosaïque de célébrités va s'afficher pendant 1 minute</p>
        <p>2. Mémorisez un maximum de personnalités</p>
        <p>3. À tour de rôle, chaque équipe devra nommer une célébrité</p>
        <p>4. Si la réponse est correcte, l'équipe continue</p>
        <p>
          5. Si la réponse est incorrecte ou déjà donnée, l'équipe est éliminée
        </p>
        <p>6. Le jeu continue jusqu'à ce qu'il ne reste qu'une équipe</p>
      </div>
      {isHost && (
        <button
          onClick={onStart}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700"
        >
          Commencer
        </button>
      )}
    </div>
  );
}
