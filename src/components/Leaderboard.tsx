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
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  users = [],
  currentUser,
}) => {
  if (!users.length) {
    return (
      <div className="bg-[#272a2f] rounded-lg p-4">
        <p className="text-center text-gray-400">Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#272a2f] rounded-lg p-4">
      <h3 className="text-lg mb-4">Leaderboard</h3>
      <div className="space-y-2">
        {users.map((user, index) => (
          <div
            key={user.username}
            className={`flex items-center justify-between p-3 rounded-lg ${
              user.username === currentUser
                ? "bg-[#f3ba2f]/10 border border-[#f3ba2f]/50"
                : "bg-[#272a2f]"
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-[#f3ba2f] font-bold w-6">#{index + 1}</span>
              <img
                src={user.photoUrl || "/src/images/suit.png"}
                alt={user.username}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-white">{user.username}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[#f3ba2f]">
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
