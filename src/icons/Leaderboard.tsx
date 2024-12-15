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
        <p className="text-center text-gray-400">Đang tải bảng xếp hạng...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#272a2f] rounded-lg p-4">
      <h3 className="text-lg mb-4">Bảng xếp hạng</h3>
      <div className="space-y-2">
        {users.map((user, index) => (
          <div
            key={user.username}
            className={`flex items-center justify-between p-2 rounded ${
              user.username === currentUser ? "bg-[#1c1f24]" : ""
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg font-bold">{index + 1}</span>
              <span>{user.username}</span>
            </div>
            <span>{user.score.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
