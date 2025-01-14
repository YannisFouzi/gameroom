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
        className={`flex-1 p-4 rounded-xl flex flex-col items-center justify-center gap-2 ${
          jokers.phoneCall
            ? "bg-gradient-to-br from-gray-700 to-gray-800 cursor-not-allowed opacity-75 shadow-inner border-2 border-gray-600"
            : "bg-gradient-to-br from-yellow-500 to-amber-600 border-2 border-yellow-400 shadow-lg"
        } transition-all duration-200`}
        onClick={() => !isHost && onPhoneCallModalChange(true)}
        disabled={isButtonDisabled || jokers.phoneCall}
      >
        <p
          className={`font-semibold ${
            jokers.phoneCall ? "text-gray-400" : "text-white"
          }`}
        >
          Appel à un ami
        </p>
      </motion.button>

      <motion.button
        whileHover={
          !isButtonDisabled && !isFiftyFiftyDisabled ? { scale: 1.05 } : {}
        }
        className={`flex-1 p-4 rounded-xl flex flex-col items-center justify-center gap-2 ${
          isFiftyFiftyDisabled
            ? "bg-gradient-to-br from-gray-700 to-gray-800 cursor-not-allowed opacity-75 shadow-inner border-2 border-gray-600"
            : "bg-gradient-to-br from-yellow-500 to-amber-600 border-2 border-yellow-400 shadow-lg"
        } transition-all duration-200`}
        onClick={onUseFiftyFifty}
        disabled={isButtonDisabled || isFiftyFiftyDisabled}
      >
        <p
          className={`font-semibold ${
            isFiftyFiftyDisabled ? "text-gray-400" : "text-white"
          }`}
        >
          50/50
        </p>
      </motion.button>

      {/* <motion.button
        whileHover={
          !isButtonDisabled && !isDoubleAnswerDisabled ? { scale: 1.05 } : {}
        }
        className={`flex-1 p-4 rounded-xl flex flex-col items-center justify-center gap-2 ${
          isDoubleAnswerDisabled
            ? "bg-gradient-to-br from-gray-700 to-gray-800 cursor-not-allowed opacity-75 shadow-inner border-2 border-gray-600"
            : "bg-gradient-to-br from-yellow-500 to-amber-600 border-2 border-yellow-400 shadow-lg"
        } transition-all duration-200`}
        onClick={onUseDoubleAnswer}
        disabled={isButtonDisabled || isDoubleAnswerDisabled}
      >
        <p
          className={`font-semibold ${
            isDoubleAnswerDisabled ? "text-gray-400" : "text-white"
          }`}
        >
          Double réponse
        </p>
      </motion.button> */}

      {phoneCallModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-b from-blue-900 to-blue-800 rounded-xl p-8 max-w-md w-full text-white border border-blue-700 shadow-xl"
          >
            <h3 className="text-2xl font-bold mb-4">Appel à un ami</h3>
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
