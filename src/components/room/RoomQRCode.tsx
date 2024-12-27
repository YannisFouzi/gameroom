import { QRCodeSVG } from "qrcode.react";

type RoomQRCodeProps = {
  roomId: string;
};

export default function RoomQRCode({ roomId }: RoomQRCodeProps) {
  const joinUrl = `${window.location.origin}/room/join/${roomId}`;

  return (
    <div className="flex flex-col items-center p-4">
      <div className="bg-white p-4 rounded-lg">
        <QRCodeSVG value={joinUrl} size={200} />
      </div>
      <p className="mt-4 text-sm text-center">
        Scannez ce QR code pour rejoindre la partie
      </p>
      <p className="mt-2 text-xs text-gray-500 break-all">{joinUrl}</p>
    </div>
  );
}
