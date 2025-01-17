import { AnimatePresence, motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

type RoomQRCodeProps = {
  roomId: string;
  fullUrl?: string;
  showButton?: boolean;
};

export default function RoomQRCode({
  roomId,
  fullUrl,
  showButton = true,
}: RoomQRCodeProps) {
  const [isVisible, setIsVisible] = useState(!showButton);
  const joinUrl = fullUrl || `${window.location.origin}/room/join/${roomId}`;
  const joinUrlPopUp = fullUrl || window.location.href;

  if (!showButton) {
    return (
      <div className="relative flex flex-col justify-center items-center p-4">
        <div className="bg-white p-3 rounded-lg">
          <QRCodeSVG value={joinUrl} size={160} />
        </div>
        <p className="mt-4 text-lg text-white">
          Scannez pour rejoindre la partie !
        </p>
        {/* <p className="text-xs text-white/50 break-all">{joinUrl}</p> */}
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-2xl">🔗</span>
      </motion.button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-4 bg-gray-900/95 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl"
          >
            <div className="flex flex-col items-center p-4">
              <div className="bg-white p-3 rounded-lg">
                <QRCodeSVG value={joinUrlPopUp} size={160} />
              </div>
              <p className="mt-4 text-lg text-center text-white">
                Scannez pour rejoindre la partie !
              </p>
              {/* <p className="mt-2 text-xs text-white/50 break-all max-w-[200px]">
                {joinUrlPopUp}
              </p> */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
