import { motion } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const avatarSounds = {
  "/images/avatar/bruno.jpg": "/sound/avatar/bruno.mp3",
  "/images/avatar/clavier.jpg": "/sound/avatar/christian.mp3",
  "/images/avatar/dominique.jpg": "/sound/avatar/dominique.mp3",
  "/images/avatar/gerard.jpg": "/sound/avatar/gerard.mp3",
  "/images/avatar/michel.jpg": "/sound/avatar/michel.mp3",
  "/images/avatar/josianne.jpg": "/sound/avatar/josianne.mp3",
  "/images/avatar/marie.jpg": "/sound/avatar/marie.mp3",
  "/images/avatar/thierry.jpg": "/sound/avatar/thierry.mp3",
} as const;

const avatars = Object.keys(avatarSounds);

type AvatarSelectorProps = {
  selectedAvatar: string;
  onSelect: (avatar: string) => void;
};

export default function AvatarSelector({
  selectedAvatar,
  onSelect,
}: AvatarSelectorProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleAvatarClick = (avatar: string) => {
    onSelect(avatar);
    const soundPath = avatarSounds[avatar as keyof typeof avatarSounds];
    if (audioRef.current) {
      audioRef.current.src = soundPath;
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .catch((error) => console.log("Erreur de lecture audio:", error));
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      <audio ref={audioRef} preload="auto" />

      {avatars.map((avatar) => (
        <motion.button
          key={avatar}
          type="button"
          onClick={() => handleAvatarClick(avatar)}
          className={`relative aspect-square overflow-hidden rounded-full border-2 transition-all ${
            selectedAvatar === avatar
              ? "border-purple-500 scale-105"
              : "border-transparent hover:border-purple-300"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Image
            src={avatar}
            alt="Avatar"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 25vw, 100px"
          />
        </motion.button>
      ))}
    </div>
  );
}
