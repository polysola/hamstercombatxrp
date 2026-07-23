import React from "react";
import { toast } from "react-toastify";
import { logo } from "../../images";

export interface SelectedRankingUser {
  rank: number;
  username: string;
  score: number;
  displayName?: string;
  telegramHandle?: string;
  photoUrl?: string;
}

interface UserDetailModalProps {
  user: SelectedRankingUser | null;
  onClose: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, onClose }) => {
  if (!user) return null;

  const isRealTelegramUser = Boolean(
    user.telegramHandle || (user.photoUrl && user.photoUrl.startsWith("http"))
  );

  const telegramUsername = user.telegramHandle
    ? user.telegramHandle.replace(/^@/, "")
    : user.username.startsWith("@")
    ? user.username.replace(/^@/, "")
    : "";

  const handleOpenTelegramChat = () => {
    if (telegramUsername) {
      const chatUrl = `https://t.me/${telegramUsername}`;
      const tg = (window as any).Telegram?.WebApp;
      if (tg && typeof tg.openTelegramLink === "function") {
        tg.openTelegramLink(chatUrl);
      } else {
        window.open(chatUrl, "_blank");
      }
      toast.info(`Opening Telegram chat with @${telegramUsername}...`);
    } else {
      toast.warning("This user has no Telegram handle.");
    }
  };

  const apiAvatar = `https://api.dicebear.com/7.x/bottts/png?seed=${encodeURIComponent(user.username)}&size=96`;
  const avatarSrc = user.photoUrl || apiAvatar;

  const formattedPoints = user.score.toLocaleString(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in font-orbitron">
      <div className="w-full max-w-sm bg-[#0a0f1d] border border-[#00ff7b]/40 rounded-[28px] p-5 text-[#f0eeff] shadow-[0_0_60px_rgba(0,255,123,0.3)] relative max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🏆</span>
            <h3 className="text-base sm:text-lg font-black uppercase tracking-tight neon-green-glow">
              Player Cyber Profile
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#00ff7b]/20 transition-all shrink-0"
          >
            ✕
          </button>
        </div>

        {/* User Card */}
        <div className="bg-[#070510] p-4 rounded-2xl border border-[#00ff7b]/30 mb-4 text-center space-y-2 relative overflow-hidden">
          {/* Avatar with rank badge */}
          <div className="relative inline-block mx-auto">
            <div className="p-1 rounded-full bg-gradient-to-tr from-[#00ff7b] via-[#00e5ff] to-[#ab00ff] shadow-[0_0_20px_rgba(0,255,123,0.4)]">
              <img
                src={avatarSrc}
                alt={user.username}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== logo) {
                    target.src = logo;
                  }
                }}
                className="w-16 h-16 rounded-full object-cover bg-[#070510]"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#00ff7b] text-black font-black text-[10px] px-2 py-0.5 rounded-full shadow-[0_0_10px_#00ff7b]">
              #{user.rank}
            </div>
          </div>

          {/* Full Name & Username */}
          <div className="space-y-0.5">
            <h4 className="text-base font-black text-white truncate">
              {user.displayName || user.username}
            </h4>
            <p className="text-xs font-mono text-[#00e5ff] font-bold">
              {user.username.startsWith("@") ? user.username : `@${user.username}`}
            </p>
          </div>

          {/* Verified Badge */}
          <div className="pt-1">
            {isRealTelegramUser ? (
              <span className="inline-flex items-center space-x-1 text-[10px] text-[#00ff7b] bg-[#00ff7b]/10 px-2.5 py-0.5 rounded-full border border-[#00ff7b]/30 font-bold">
                <span>Verified Telegram Legend</span>
                <span>✓</span>
              </span>
            ) : (
              <span className="inline-block text-[10px] text-gray-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10 font-bold">
                Web Cyber Cadet
              </span>
            )}
          </div>
        </div>

        {/* Player Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-[#070510] p-3 rounded-2xl border border-white/10 text-center">
            <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">TOTAL EGG SCORE</p>
            <p className="text-sm sm:text-base font-black text-[#00ff7b] neon-green-glow truncate">
              {formattedPoints}
            </p>
          </div>
          <div className="bg-[#070510] p-3 rounded-2xl border border-white/10 text-center">
            <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">GLOBAL RANK</p>
            <p className="text-sm sm:text-base font-black text-[#ffe600] yellow-glow">
              Rank #{user.rank}
            </p>
          </div>
        </div>

        {/* Telegram Direct Chat Action Button */}
        {isRealTelegramUser && telegramUsername ? (
          <button
            onClick={handleOpenTelegramChat}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0088cc] to-[#00b2ff] text-white font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,136,204,0.5)] hover:scale-[1.02] transition-all flex items-center justify-center space-x-2 mb-2"
          >
            <span>💬</span>
            <span>Chat on Telegram (@{telegramUsername})</span>
          </button>
        ) : (
          <div className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 font-bold text-xs uppercase tracking-wider text-center mb-2">
            🔒 Telegram Chat Unavailable (Guest)
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-xs uppercase tracking-wider transition-all"
        >
          Close Profile
        </button>

      </div>
    </div>
  );
};

export default UserDetailModal;
