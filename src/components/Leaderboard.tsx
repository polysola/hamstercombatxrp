import React from "react";
import { logo } from "../images";

export interface LeaderboardUser {
  username: string;
  score: number;
  displayName?: string;
  telegramHandle?: string;
  photoUrl?: string;
}

interface LeaderboardProps {
  users?: LeaderboardUser[];
  currentUser?: string;
  isLoading?: boolean;
  onSelectUser?: (user: LeaderboardUser & { rank: number }) => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  users = [],
  currentUser,
  isLoading = false,
  onSelectUser,
}) => {
  if (isLoading) {
    return (
      <div className="glass-card rounded-3xl p-8 flex flex-col items-center justify-center border-[rgba(155,0,255,0.3)]">
        <div className="w-10 h-10 border-2 border-[#00ff7b]/20 border-t-[#00ff7b] rounded-full animate-spin mb-4 shadow-[0_0_15px_#00ff7b]"></div>
        <p className="text-[#f0eeff]/60 font-medium">Loading cyber legends...</p>
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="glass-card rounded-3xl p-8 text-center border-[rgba(155,0,255,0.3)]">
        <p className="text-[#f0eeff]/60">No rankings available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24 font-orbitron">
      <div className="flex items-center justify-between mb-2 px-2">
        <h3 className="text-xl font-black text-[#f0eeff] tracking-tight neon-green-glow">Hall of Fame</h3>
        <div className="bg-[#00ff7b]/10 px-3 py-1 rounded-full border border-[#00ff7b]/30">
          <span className="text-[10px] text-[#00ff7b] font-bold uppercase tracking-wider">Global Rank</span>
        </div>
      </div>
      <div className="space-y-3">
        {users.map((user, index) => {
          const isRealTelegramAvatar =
            user.photoUrl &&
            user.photoUrl.startsWith("http") &&
            !user.photoUrl.includes("logo");

          const apiAvatar = `https://api.dicebear.com/7.x/bottts/png?seed=${encodeURIComponent(user.username)}&size=96`;
          const avatarSrc = isRealTelegramAvatar ? user.photoUrl! : apiAvatar;

          const formattedFullName = user.displayName || user.username;
          const formattedUsername = user.username.startsWith("@")
            ? user.username
            : `@${user.username}`;

          return (
            <div
              key={user.username}
              onClick={() => onSelectUser && onSelectUser({ rank: index + 1, ...user })}
              className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl transition-all duration-300 cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${
                user.username === currentUser
                  ? "bg-gradient-to-r from-[#00ff7b]/20 via-[#00ff7b]/10 to-transparent border border-[#00ff7b]/40 shadow-[0_0_20px_rgba(0,255,123,0.2)]"
                  : "glass-card hover:bg-white/10 border-[rgba(155,0,255,0.3)]"
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <div className="flex items-center justify-center w-7">
                  {index === 0 ? (
                    <span className="text-2xl">🥇</span>
                  ) : index === 1 ? (
                    <span className="text-2xl">🥈</span>
                  ) : index === 2 ? (
                    <span className="text-2xl">🥉</span>
                  ) : (
                    <span className="font-black text-[#00ff7b]/70 text-sm">#{index + 1}</span>
                  )}
                </div>

                <div className="relative">
                  <div className="p-[1px] rounded-full bg-gradient-to-b from-[#00ff7b]/40 to-transparent">
                    <img
                      src={avatarSrc}
                      alt={user.username}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== logo) {
                          target.src = logo;
                        }
                      }}
                      className="w-10 h-10 rounded-full object-cover bg-[#070510]"
                    />
                  </div>
                  {index < 3 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00ff7b] rounded-full border-2 border-[#070510] shadow-[0_0_8px_#00ff7b]"></div>
                  )}
                </div>

                <div className="flex flex-col min-w-0 pr-1">
                  {/* TOP LINE: INTERNATIONAL FULL NAME */}
                  <span className="text-[#f0eeff] font-black text-xs sm:text-sm truncate max-w-[130px] sm:max-w-[170px] leading-tight">
                    {formattedFullName}
                  </span>
                  {/* BOTTOM LINE: @USERNAME & BADGE */}
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span className="text-[10px] font-mono text-[#00e5ff] font-bold truncate max-w-[100px]">
                      {formattedUsername}
                    </span>
                    {isRealTelegramAvatar ? (
                      <span className="text-[9px] text-[#00ff7b] font-bold shrink-0">✓</span>
                    ) : (
                      <span className="text-[8px] text-gray-400 bg-white/5 px-1 rounded border border-white/10 shrink-0">
                        CADET
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-[#00ff7b] font-black text-xs sm:text-sm neon-green-glow">
                  {user.score.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                </p>
                <p className="text-[8px] text-[#f0eeff]/40 font-bold uppercase tracking-tighter">Points</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;
