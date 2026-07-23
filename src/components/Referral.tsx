import React from "react";
import { toast } from "react-toastify";
import { ReferralUser } from "../types/user";
import { robinhood } from "../images";

interface ReferralProps {
  users?: ReferralUser[];
  currentUser?: string;
}

const Referral: React.FC<ReferralProps> = ({ users = [], currentUser }) => {
  const handleCopyLink = async () => {
    if (!currentUser) {
      console.error("No current user found");
      return;
    }

    try {
      const botUsername = "RobinhoodETH_Bot";
      const miniAppLink = `https://t.me/${botUsername}/miniapp?startapp=${currentUser}`;
      await navigator.clipboard.writeText(miniAppLink);
      toast.success("Referral link copied!");
    } catch (error) {
      console.error("Error copying link:", error);
      toast.error("Failed to copy link.");
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="space-y-6 pb-24 font-orbitron">
      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 rounded-[24px] text-center premium-shadow relative overflow-hidden group border-[rgba(155,0,255,0.3)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00ff7b]/10 to-transparent"></div>
          <div className="bg-[#00ff7b]/10 w-10 h-10 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-[#00ff7b]/30">
            <svg className="w-5 h-5 text-[#00ff7b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-[10px] text-[#f0eeff]/50 font-bold uppercase tracking-widest mb-1">Total Referrals</p>
          <p className="text-2xl font-black text-[#f0eeff] neon-green-glow">{users.length > 0 ? users[0].referrals.length : 0}</p>
        </div>

        <div className="glass-card p-4 rounded-[24px] text-center premium-shadow relative overflow-hidden group border-[rgba(155,0,255,0.3)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00ff7b]/10 to-transparent"></div>
          <div className="bg-[#00ff7b]/10 w-10 h-10 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-[#00ff7b]/30">
            <svg className="w-5 h-5 text-[#00ff7b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-[10px] text-[#f0eeff]/50 font-bold uppercase tracking-widest mb-1">Total Earned</p>
          <p className="text-2xl font-black text-[#ffe600] yellow-glow">
            {users.length > 0 ? users[0].totalRefEarnings.toLocaleString() : 0}
          </p>
        </div>
      </div>

      {/* Share Section */}
      <div className="glass-card p-5 rounded-[28px] premium-shadow border-t border-[rgba(155,0,255,0.3)]">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm font-black text-[#f0eeff] uppercase tracking-tight">Your Link</h3>
            <p className="text-[10px] text-[#f0eeff]/50 font-medium">Earn 5% from friend's points</p>
          </div>
          <div className="bg-[#00ff7b]/10 px-2.5 py-1 rounded-lg border border-[#00ff7b]/30">
            <span className="text-[9px] text-[#00ff7b] font-black tracking-tighter">PREMIUM BONUS</span>
          </div>
        </div>
        <div className="bg-[#070510]/80 p-4 rounded-2xl border border-[#00ff7b]/20 flex justify-between items-center">
          <p className="text-xs text-[#00ff7b] font-mono font-bold truncate max-w-[150px]">{currentUser || "Unknown"}</p>
          <button
            onClick={handleCopyLink}
            className="bg-gradient-to-r from-[#00ff7b] to-[#31ff00] hover:from-[#31ff00] hover:to-[#abff00] text-black text-[11px] font-black px-4 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(0,255,123,0.5)]"
          >
            COPY LINK
          </button>
        </div>
      </div>

      {/* Referral List */}
      <div>
        <h3 className="text-sm font-black text-[#f0eeff]/60 uppercase tracking-widest mb-4 px-2">Friends List</h3>
        <div className="space-y-3">
          {users.slice(1).length > 0 ? (
            users.slice(1).map((user) => {
              const avatarSrc = user.photoUrl && !user.photoUrl.includes("logo.png") ? user.photoUrl : robinhood;
              return (
                <div key={user.username} className="glass-card p-4 rounded-2xl flex items-center justify-between group hover:bg-white/5 transition-all border-[rgba(155,0,255,0.3)]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#070510] to-[#12092b] border border-[#00ff7b]/30 flex items-center justify-center overflow-hidden p-0.5">
                      <img src={avatarSrc} alt={user.username} className="w-full h-full object-contain rounded-full" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#f0eeff]">{user.username}</p>
                      <p className="text-[10px] text-[#f0eeff]/50 font-medium">{formatDate(user.lastUpdated)} • LVL {Math.floor(user.score / 10000) + 1}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-[#00ff7b] neon-green-glow">+{Math.floor(user.score * 0.05).toLocaleString()}</p>
                    <p className="text-[9px] text-[#f0eeff]/40 font-bold uppercase">Commission</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 glass-card rounded-3xl border-[rgba(155,0,255,0.3)]">
              <p className="text-[#f0eeff]/40 text-sm font-medium italic">No friends invited yet...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Referral;
