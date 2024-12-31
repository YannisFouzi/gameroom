import { motion } from "framer-motion";

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
  isHost: boolean;
  phoneCallModalOpen: boolean;
  onPhoneCallModalChange: (isOpen: boolean) => void;
};

export default function Jokers({
  jokers,
  onUsePhoneCall,
  onUseFiftyFifty,
  onUseDoubleAnswer,
  disabled = false,
  isHost,
  phoneCallModalOpen,
  onPhoneCallModalChange,
}: JokersProps) {
  const isFiftyFiftyDisabled = jokers.fiftyFifty;
  const isDoubleAnswerDisabled = jokers.doubleAnswer;

  // L'hôte ne peut pas cliquer sur les jokers
  const isButtonDisabled = disabled || isHost;

  return (
    <div className="flex gap-4 mb-6">
      <motion.button
        whileHover={
          !isButtonDisabled && !jokers.phoneCall ? { scale: 1.05 } : {}
        }
        className={`flex-1 p-4 rounded-lg ${
          jokers.phoneCall
            ? "bg-gray-100 cursor-not-allowed text-gray-500 line-through"
            : isHost
            ? "bg-blue-50 cursor-not-allowed text-black"
            : "bg-blue-50 hover:bg-blue-100 text-black"
        }`}
        onClick={() => !isHost && onPhoneCallModalChange(true)}
        disabled={isButtonDisabled || jokers.phoneCall}
      >
        <span className="text-2xl mb-2">📞</span>
        <p className="text-sm">Appel à un ami</p>
      </motion.button>

      <motion.button
        whileHover={
          !isButtonDisabled && !isFiftyFiftyDisabled ? { scale: 1.05 } : {}
        }
        className={`flex-1 p-4 rounded-lg ${
          isFiftyFiftyDisabled
            ? "bg-gray-100 cursor-not-allowed text-gray-500 line-through"
            : isHost
            ? "bg-blue-50 cursor-not-allowed text-black"
            : "bg-blue-50 hover:bg-blue-100 text-black"
        }`}
        onClick={onUseFiftyFifty}
        disabled={isButtonDisabled || isFiftyFiftyDisabled}
      >
        <span className="text-2xl mb-2">50:50</span>
        <p className="text-sm">Retirer deux mauvaises réponses</p>
      </motion.button>

      <motion.button
        whileHover={
          !isButtonDisabled && !isDoubleAnswerDisabled ? { scale: 1.05 } : {}
        }
        className={`flex-1 p-4 rounded-lg ${
          isDoubleAnswerDisabled
            ? "bg-gray-100 cursor-not-allowed text-gray-500 line-through"
            : isHost
            ? "bg-blue-50 cursor-not-allowed text-black"
            : "bg-blue-50 hover:bg-blue-100 text-black"
        }`}
        onClick={onUseDoubleAnswer}
        disabled={isButtonDisabled || isDoubleAnswerDisabled}
      >
        <span className="text-2xl mb-2">2️⃣</span>
        <p className="text-sm">Double réponse</p>
      </motion.button>

      {phoneCallModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-b from-blue-900 to-blue-800 rounded-xl p-8 max-w-md w-full text-white border border-blue-700 shadow-xl"
          >
            <h3 className="text-2xl font-bold mb-4">📞 Appel à un ami</h3>
            {isHost ? (
              <p className="mb-4 text-blue-100">
                L'équipe utilise son joker "Appel à un ami"...
              </p>
            ) : (
              <>
                <p className="mb-6 text-blue-100">
                  Vous pouvez maintenant appeler un(e) ami(e) pour vous aider à
                  répondre à la question.
                </p>
                <button
                  onClick={() => {
                    onPhoneCallModalChange(false);
                    onUsePhoneCall();
                  }}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-500 transition-colors font-bold"
                >
                  J'ai terminé mon appel
                </button>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
