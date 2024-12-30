import { motion } from "framer-motion";

type AvatarSelectorProps = {
  selectedAvatar: string;
  onSelect: (avatar: string) => void;
};

const avatars = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
  "/avatars/avatar6.png",
  "/avatars/avatar7.png",
  "/avatars/avatar8.png",
];

export default function AvatarSelector({
  selectedAvatar,
  onSelect,
}: AvatarSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-4 p-4 w-full max-w-md">
      {avatars.map((avatar, index) => (
        <motion.div
          key={avatar}
          className={`relative cursor-pointer rounded-xl overflow-hidden 
            ${
              selectedAvatar === avatar
                ? "ring-4 ring-purple-500"
                : "hover:ring-2 ring-white/50"
            }
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { delay: index * 0.1 },
          }}
          onClick={() => onSelect(avatar)}
        >
          <div className="aspect-square">
            <img
              src={avatar}
              alt={`Avatar ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
          {selectedAvatar === avatar && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-purple-500/20 flex items-center justify-center"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-2xl"
              >
                ✓
              </motion.span>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
