import { motion } from "framer-motion";
import { useState } from "react";

type JokersProps = {
  jokers: {
    phoneCall: boolean;
    fiftyFifty: boolean;
  };
  onUsePhoneCall: () => void;
  onUseFiftyFifty: () => void;
  disabled?: boolean;
};

export default function Jokers({
  jokers,
  onUsePhoneCall,
  onUseFiftyFifty,
  disabled = false,
}: JokersProps) {
  const [showPhoneCallModal, setShowPhoneCallModal] = useState(false);

  return (
    <div className="flex gap-4 mb-6">
      <motion.button
        whileHover={!disabled && !jokers.phoneCall ? { scale: 1.05 } : {}}
        className={`flex-1 p-4 rounded-lg ${
          jokers.phoneCall
            ? "bg-gray-100 cursor-not-allowed"
            : "bg-blue-50 hover:bg-blue-100"
        }`}
        onClick={() => setShowPhoneCallModal(true)}
        disabled={disabled || jokers.phoneCall}
      >
        <span className="text-2xl mb-2">📞</span>
        <p className="text-sm">Appel à un ami</p>
      </motion.button>

      <motion.button
        whileHover={!disabled && !jokers.fiftyFifty ? { scale: 1.05 } : {}}
        className={`flex-1 p-4 rounded-lg ${
          jokers.fiftyFifty
            ? "bg-gray-100 cursor-not-allowed"
            : "bg-blue-50 hover:bg-blue-100"
        }`}
        onClick={onUseFiftyFifty}
        disabled={disabled || jokers.fiftyFifty}
      >
        <span className="text-2xl mb-2">50:50</span>
        <p className="text-sm">Retirer deux mauvaises réponses</p>
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
