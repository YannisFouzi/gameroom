"use client";

import CreateRoom from "@/components/room/CreateRoom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <CreateRoom />
    </div>
  );
}
