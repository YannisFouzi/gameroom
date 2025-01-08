import { motion } from "framer-motion";
import Image from "next/image";

const avatars = [
  "/images/avatar/bruno.jpg",
  "/images/avatar/clavier.jpg",
  "/images/avatar/dominique.jpg",
  "/images/avatar/gerard.jpg",
  "/images/avatar/michel.jpg",
  "/images/avatar/josianne.jpg",
  "/images/avatar/marie.jpg",
  "/images/avatar/thierry.jpg",
];

type AvatarSelectorProps = {
  selectedAvatar: string;
  onSelect: (avatar: string) => void;
};

export default function AvatarSelector({
  selectedAvatar,
  onSelect,
}: AvatarSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {avatars.map((avatar) => (
        <motion.button
          key={avatar}
          type="button"
          onClick={() => onSelect(avatar)}
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
