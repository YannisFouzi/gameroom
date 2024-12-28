import { useState } from "react";
import AvatarSelector from "./AvatarSelector";

type TeamFormProps = {
  onSubmit: (teamData: {
    name: string;
    members: { name: string }[];
    avatar: string;
  }) => void;
  isLoading?: boolean;
};

export default function TeamForm({
  onSubmit,
  isLoading = false,
}: TeamFormProps) {
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState<string[]>([""]);
  const [avatar, setAvatar] = useState("/avatars/avatar1.png");

  const handleAddMember = () => {
    setMembers([...members, ""]);
  };

  const handleRemoveMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validMembers = members
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (validMembers.length > 0 && teamName.trim()) {
      onSubmit({
        name: teamName.trim(),
        members: validMembers.map((name) => ({ name })),
        avatar,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center">
        <label className="block text-sm font-medium mb-2">
          Avatar d'équipe
        </label>
        <AvatarSelector selectedAvatar={avatar} onSelect={setAvatar} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Nom de l'équipe
        </label>
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Entrez le nom de votre équipe"
          required
          minLength={2}
          maxLength={30}
        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium">Membres de l'équipe</label>
        {members.map((member, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={member}
              onChange={(e) => handleMemberChange(index, e.target.value)}
              className="flex-1 p-2 border rounded-md"
              placeholder={`Nom du membre ${index + 1}`}
              required
              minLength={2}
              maxLength={20}
            />
            {members.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveMember(index)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
              >
                Retirer
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddMember}
          className="w-full p-2 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 text-gray-600"
        >
          + Ajouter un membre
        </button>
      </div>

      <button
        type="submit"
        disabled={
          isLoading || !teamName.trim() || members.every((m) => !m.trim())
        }
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? "Connexion..." : "Rejoindre la partie"}
      </button>
    </form>
  );
}
