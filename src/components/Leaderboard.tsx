// src/components/Leaderboard.tsx
import React from "react";

interface LeaderboardUser {
  username: string;
  score: number;
  photoUrl?: string;
}

interface LeaderboardProps {
  users?: LeaderboardUser[];
  currentUser?: string;
  isLoading?: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  users = [],
  currentUser,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="bg-[#272a2f] rounded-lg p-4">
        <p className="text-center text-gray-400">Loading leaderboard...</p>
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="bg-[#272a2f] rounded-lg p-4">
        <p className="text-center text-gray-400">No rankings available yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#272a2f] rounded-lg p-4">
      <h3 className="text-lg mb-4 text-[#f3ba2f]">Top Players</h3>
      <div className="space-y-2">
        {users.map((user, index) => (
          <div
            key={user.username}
            className={`flex items-center justify-between p-3 rounded-lg ${
              user.username === currentUser
                ? "bg-[#f3ba2f]/20 border border-[#f3ba2f]/50"
                : "bg-[#1d2025]"
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className={`font-bold w-6 ${index < 3 ? "text-[#f3ba2f]" : "text-gray-500"}`}>
                #{index + 1}
              </span>
              <img
                src={user.photoUrl || "/images/suit.png"}
                alt={user.username}
                className="w-8 h-8 rounded-full border border-gray-700"
              />
              <span className="text-white truncate max-w-[120px]">{user.username}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[#f3ba2f] font-mono">
                {user.score.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
