import React from "react";
import { toast } from "react-toastify";
import { ReferralUser } from "../types/user";

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
      const botUsername = "VortexTon_Bot";
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
    <div className="space-y-6 pb-24">
      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 rounded-[24px] text-center premium-shadow relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f3ba2f]/5 to-transparent"></div>
          <div className="bg-[#f3ba2f]/10 w-10 h-10 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-[#f3ba2f]/20">
             <svg className="w-5 h-5 text-[#f3ba2f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
             </svg>
          </div>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total Referrals</p>
          <p className="text-2xl font-black text-white gold-glow">{users.length > 0 ? users[0].referrals.length : 0}</p>
        </div>
        
        <div className="glass-card p-4 rounded-[24px] text-center premium-shadow relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f3ba2f]/5 to-transparent"></div>
          <div className="bg-[#f3ba2f]/10 w-10 h-10 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-[#f3ba2f]/20">
             <svg className="w-5 h-5 text-[#f3ba2f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
          </div>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total Earned</p>
          <p className="text-2xl font-black text-[#f3ba2f] gold-glow">
            {users.length > 0 ? users[0].totalRefEarnings.toLocaleString() : 0}
          </p>
        </div>
      </div>

      {/* Share Section */}
      <div className="glass-card p-5 rounded-[28px] premium-shadow border-t border-white/5">
        <div className="flex justify-between items-center mb-4">
           <div>
              <h3 className="text-sm font-black text-white uppercase tracking-tight">Your Link</h3>
              <p className="text-[10px] text-gray-500 font-medium">Earn 5% from friend's points</p>
           </div>
           <div className="bg-[#f3ba2f]/10 px-2 py-1 rounded-lg border border-[#f3ba2f]/20">
              <span className="text-[9px] text-[#f3ba2f] font-black tracking-tighter">PREMIUM BONUS</span>
           </div>
        </div>
        <div className="bg-black/30 p-4 rounded-2xl border border-white/5 flex justify-between items-center">
           <p className="text-xs text-[#f3ba2f] font-mono font-bold truncate max-w-[150px]">{currentUser || "Unknown"}</p>
           <button 
             onClick={handleCopyLink}
             className="bg-[#f3ba2f] hover:bg-[#ffcf4d] text-black text-[11px] font-black px-4 py-2 rounded-xl transition-all shadow-[0_4px_10px_rgba(243,186,47,0.3)]"
           >
             COPY LINK
           </button>
        </div>
      </div>

      {/* Referral List */}
      <div>
        <h3 className="text-sm font-black text-white/60 uppercase tracking-widest mb-4 px-2">Friends List</h3>
        <div className="space-y-3">
          {users.slice(1).length > 0 ? (
            users.slice(1).map((user, index) => (
              <div key={user.username} className="glass-card p-4 rounded-2xl flex items-center justify-between group hover:bg-white/5 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1d2025] to-black border border-white/5 flex items-center justify-center overflow-hidden">
                    <img src={user.photoUrl || "/images/suit.png"} alt={user.username} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{user.username}</p>
                    <p className="text-[10px] text-gray-500 font-medium">{formatDate(user.lastUpdated)} • LVL {Math.floor(user.score / 10000) + 1}</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-xs font-black text-[#f3ba2f]">+{Math.floor(user.score * 0.05).toLocaleString()}</p>
                   <p className="text-[9px] text-gray-600 font-bold uppercase">Commission</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 glass-card rounded-3xl">
               <p className="text-gray-500 text-sm font-medium italic">No friends invited yet...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Referral;
