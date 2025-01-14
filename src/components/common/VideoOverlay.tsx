import { useRef, useState } from "react";

interface VideoOverlayProps {
  publicId: string;
  onComplete: () => void;
}

export default function VideoOverlay({
  publicId,
  onComplete,
}: VideoOverlayProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center">
        <video
          ref={videoRef}
          src={`https://res.cloudinary.com/dcdlryvf3/video/upload/${publicId}`}
          className="w-[100vw] h-[100vh] object-contain"
          autoPlay
          controls={false}
          onEnded={onComplete}
          playsInline
        />
      </div>

      <div className="absolute bottom-8 right-8 flex gap-4">
        <button
          onClick={togglePlayPause}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 
          text-white rounded-lg backdrop-blur-sm border border-white/20 
          transition-all duration-300 font-semibold z-10"
        >
          {isPlaying ? "⏸️ Pause" : "▶️ Play"}
        </button>
        <button
          onClick={onComplete}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 
          text-white rounded-lg backdrop-blur-sm border border-white/20 
          transition-all duration-300 font-semibold z-10"
        >
          Passer ⏭️
        </button>
      </div>
    </div>
  );
}
