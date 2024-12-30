import { Theme } from "@/types/wheel";
import { motion } from "framer-motion";

type PlayerWheelProps = {
  isCurrentTeam: boolean;
  onSpinWheel: () => void;
  selectedTheme: Theme | null;
  subCategory: string | null;
  isSpinning: boolean;
};

export default function PlayerWheel({
  isCurrentTeam,
  onSpinWheel,
  selectedTheme,
  subCategory,
  isSpinning,
}: PlayerWheelProps) {
  if (!isCurrentTeam && !subCategory) {
    return (
      <div className="text-center p-8">
        <p className="text-xl">En attente du tour de l'autre équipe...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-col items-center justify-center p-8"
    >
      {isCurrentTeam ? (
        <>
          <h2 className="text-2xl font-bold mb-6">C'est votre tour !</h2>
          <button
            onClick={onSpinWheel}
            disabled={isSpinning}
            className="bg-blue-600 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {isSpinning ? "La roue tourne..." : "Tourner la roue"}
          </button>
        </>
      ) : (
        subCategory && (
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Votre catégorie :</h3>
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-2xl font-bold text-blue-800">{subCategory}</p>
            </div>
          </div>
        )
      )}
    </motion.div>
  );
}
