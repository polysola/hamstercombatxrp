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
      <div className="glass-card rounded-3xl p-8 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#f3ba2f]/20 border-t-[#f3ba2f] rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 font-medium">Loading legends...</p>
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="glass-card rounded-3xl p-8 text-center">
        <p className="text-gray-400">No rankings available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24">
      <div className="flex items-center justify-between mb-2 px-2">
        <h3 className="text-xl font-black text-white tracking-tight">Hall of Fame</h3>
        <div className="bg-[#f3ba2f]/10 px-3 py-1 rounded-full border border-[#f3ba2f]/20">
          <span className="text-[10px] text-[#f3ba2f] font-bold uppercase tracking-wider">Global Rank</span>
        </div>
      </div>

      <div className="space-y-3">
        {users.map((user, index) => (
          <div
            key={user.username}
            className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${user.username === currentUser
                ? "bg-gradient-to-r from-[#f3ba2f]/20 to-transparent border border-[#f3ba2f]/30 shadow-[0_0_15px_rgba(243,186,47,0.1)]"
                : "glass-card hover:bg-white/5"
              }`}
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-8">
                {index === 0 ? (
                  <span className="text-2xl">🥇</span>
                ) : index === 1 ? (
                  <span className="text-2xl">🥈</span>
                ) : index === 2 ? (
                  <span className="text-2xl">🥉</span>
                ) : (
                  <span className="font-black text-gray-500 text-sm">#{index + 1}</span>
                )}
              </div>

              <div className="relative">
                <div className="p-[1px] rounded-full bg-gradient-to-b from-white/20 to-transparent">
                  <img
                    src={user.photoUrl || "/images/logo.png"}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover bg-[#1d2025]"
                  />
                </div>
                {index < 3 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#f3ba2f] rounded-full border-2 border-[#1d2025]"></div>
                )}
              </div>

              <div className="flex flex-col">
                <span className="text-white font-bold text-sm truncate max-w-[120px]">
                  {user.username}
                </span>
                <span className="text-[10px] text-gray-500 font-medium">Player</span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[#f3ba2f] font-black text-sm gold-glow">
                {user.score.toLocaleString()}
              </p>
              <p className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter">Points</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
