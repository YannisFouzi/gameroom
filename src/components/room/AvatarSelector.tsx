import Image from "next/image";
import { useState } from "react";

const DEFAULT_AVATARS = ["/avatars/avatar1.png", "/avatars/avatar2.png"];

type AvatarSelectorProps = {
  selectedAvatar: string;
  onSelect: (avatar: string) => void;
};

export default function AvatarSelector({
  selectedAvatar,
  onSelect,
}: AvatarSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500 hover:border-blue-600 transition-colors"
      >
        <Image
          src={selectedAvatar}
          alt="Selected avatar"
          width={80}
          height={80}
          className="object-cover"
          priority
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-white rounded-lg shadow-lg border grid grid-cols-2 gap-2 z-10">
          {DEFAULT_AVATARS.map((avatar) => (
            <button
              key={avatar}
              type="button"
              onClick={() => {
                onSelect(avatar);
                setIsOpen(false);
              }}
              className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-colors ${
                selectedAvatar === avatar
                  ? "border-blue-500"
                  : "border-transparent hover:border-blue-300"
              }`}
            >
              <Image
                src={avatar}
                alt="Avatar option"
                width={64}
                height={64}
                className="object-cover"
                priority
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
