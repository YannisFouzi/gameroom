import { motion } from "framer-motion";
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
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-8 bg-white/5 p-8 rounded-xl backdrop-blur-sm border border-white/10"
    >
      <div className="flex flex-col items-center space-y-4">
        <label className="block text-lg font-medium text-white text-center">
          Choisissez votre avatar d'équipe
        </label>
        <div className="w-full max-w-md">
          <AvatarSelector selectedAvatar={avatar} onSelect={setAvatar} />
        </div>
      </div>

      <div>
        <label className="block text-lg font-medium mb-3 text-white">
          Nom de votre équipe
        </label>
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          placeholder="Les Fêtards du Nouvel An..."
          required
          minLength={2}
          maxLength={30}
        />
      </div>

      <div className="space-y-4">
        <label className="block text-lg font-medium text-white">
          Qui participe ?
        </label>
        {members.map((member, index) => (
          <motion.div
            key={index}
            className="flex gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <input
              type="text"
              value={member}
              onChange={(e) => handleMemberChange(index, e.target.value)}
              className="flex-1 p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder={`Participant ${index + 1}`}
              required
              minLength={2}
              maxLength={20}
            />
            {members.length > 1 && (
              <motion.button
                type="button"
                onClick={() => handleRemoveMember(index)}
                className="px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ✕
              </motion.button>
            )}
          </motion.div>
        ))}
        <motion.button
          type="button"
          onClick={handleAddMember}
          className="w-full p-3 border border-white/20 rounded-lg text-white hover:bg-white/5 transition-all"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          + Ajouter un participant
        </motion.button>
      </div>

      <motion.button
        type="submit"
        disabled={
          isLoading || !teamName.trim() || members.every((m) => !m.trim())
        }
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Connexion...
          </span>
        ) : (
          "C'est parti ! 🎊"
        )}
      </motion.button>
    </motion.form>
  );
}
