"use client";

import { usePlayer } from "@/hooks/usePlayer";
import RoomQRCode from "./RoomQRCode";

export default function QRCodeClient() {
  const roomId = window.location.pathname.split("/")[2];
  const { isHost } = usePlayer(roomId);

  if (!roomId || !window.location.pathname.includes("/room/")) return null;
  if (!isHost) return null;

  return <RoomQRCode roomId={roomId} showButton />;
}
