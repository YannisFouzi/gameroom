import { useState } from "react";
import AvatarSelector from "./AvatarSelector";

type PlayerFormProps = {
  onSubmit: (playerData: { name: string; avatar: string }) => void;
  isLoading?: boolean;
};

export default function PlayerForm({
  onSubmit,
  isLoading = false,
}: PlayerFormProps) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("/avatars/avatar1.png");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({ name: name.trim(), avatar });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center">
        <label className="block text-sm font-medium mb-2">Votre avatar</label>
        <AvatarSelector selectedAvatar={avatar} onSelect={setAvatar} />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Votre nom
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded-md bg-background"
          placeholder="Entrez votre nom"
          required
          minLength={2}
          maxLength={20}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !name.trim()}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? "Connexion..." : "Rejoindre la partie"}
      </button>
    </form>
  );
}
