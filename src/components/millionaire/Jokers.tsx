import { motion } from "framer-motion";
import { useState } from "react";

type JokersProps = {
  jokers: {
    phoneCall: boolean;
    fiftyFifty: boolean;
    doubleAnswer: boolean;
  };
  onUsePhoneCall: () => void;
  onUseFiftyFifty: () => void;
  onUseDoubleAnswer: () => void;
  disabled?: boolean;
};

export default function Jokers({
  jokers,
  onUsePhoneCall,
  onUseFiftyFifty,
  onUseDoubleAnswer,
  disabled = false,
}: JokersProps) {
  const [showPhoneCallModal, setShowPhoneCallModal] = useState(false);

  const isFiftyFiftyDisabled = disabled || jokers.fiftyFifty;

  const isDoubleAnswerDisabled = disabled || jokers.doubleAnswer;

  return (
    <div className="flex gap-4 mb-6">
      <motion.button
        whileHover={!disabled && !jokers.phoneCall ? { scale: 1.05 } : {}}
        className={`flex-1 p-4 rounded-lg ${
          jokers.phoneCall
            ? "bg-gray-100 cursor-not-allowed text-gray-500"
            : "bg-blue-50 hover:bg-blue-100 text-black"
        }`}
        onClick={() => setShowPhoneCallModal(true)}
        disabled={disabled || jokers.phoneCall}
      >
        <span className="text-2xl mb-2">📞</span>
        <p className="text-sm">Appel à un ami</p>
      </motion.button>

      <motion.button
        whileHover={!disabled && !isFiftyFiftyDisabled ? { scale: 1.05 } : {}}
        className={`flex-1 p-4 rounded-lg ${
          isFiftyFiftyDisabled
            ? "bg-gray-100 cursor-not-allowed text-gray-500"
            : "bg-blue-50 hover:bg-blue-100 text-black"
        }`}
        onClick={onUseFiftyFifty}
        disabled={isFiftyFiftyDisabled}
      >
        <span className="text-2xl mb-2">50:50</span>
        <p className="text-sm">Retirer deux mauvaises réponses</p>
      </motion.button>

      <motion.button
        whileHover={!disabled && !isDoubleAnswerDisabled ? { scale: 1.05 } : {}}
        className={`flex-1 p-4 rounded-lg ${
          isDoubleAnswerDisabled
            ? "bg-gray-100 cursor-not-allowed text-gray-500"
            : "bg-blue-50 hover:bg-blue-100 text-black"
        }`}
        onClick={onUseDoubleAnswer}
        disabled={isDoubleAnswerDisabled}
      >
        <span className="text-2xl mb-2">2️⃣</span>
        <p className="text-sm">Double réponse</p>
      </motion.button>

      {showPhoneCallModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold mb-4">Appel à un ami</h3>
            <p className="mb-6">
              Vous pouvez maintenant appeler un ami pour vous aider à répondre à
              cette question.
            </p>
            <button
              onClick={() => {
                setShowPhoneCallModal(false);
                onUsePhoneCall();
              }}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              OK
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
