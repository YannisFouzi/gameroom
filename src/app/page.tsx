"use client";

import CreateRoom from "@/components/room/CreateRoom";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">GameRoom</h1>
        <CreateRoom />
      </div>
    </div>
  );
}
