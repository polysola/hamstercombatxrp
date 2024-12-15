import React from "react";
import { toast } from "react-toastify";

interface ReferralUser {
  username: string;
  score: number;
  photoUrl?: string;
  totalRefEarnings: number;
  earnedFromRef?: number;
}

interface ReferralProps {
  users?: ReferralUser[];
  currentUser?: string;
  referralCode?: string;
}

const Referral: React.FC<ReferralProps> = ({
  users = [],
  currentUser,
  referralCode,
}) => {
  const handleCopyLink = () => {
    const botUsername = "HamterCombatXrp_bot";
    const miniAppLink = `https://t.me/${botUsername}/miniapp?startapp=${referralCode}`;

    navigator.clipboard.writeText(miniAppLink);
    console.log("Copied referral link:", miniAppLink);
    toast.success("Referral link copied!");
  };

  const ReferralStats = () => {
    // Calculate total referrals
    const totalReferrals = users.length;

    // Calculate total earnings (sum of all referral earnings)
    const totalEarned = users.reduce((sum, user) => {
      // Use totalRefEarnings if available, otherwise use earnedFromRef or 0
      const earnings = user.totalRefEarnings ?? user.earnedFromRef ?? 0;
      return sum + earnings;
    }, 0);

    return (
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-[#1c1f24] p-3 rounded-lg text-center">
          <p className="text-sm text-[#85827d]">Total Referrals</p>
          <p className="text-lg text-[#f3ba2f]">{totalReferrals}</p>
        </div>
        <div className="bg-[#1c1f24] p-3 rounded-lg text-center">
          <p className="text-sm text-[#85827d]">Total Earned</p>
          <p className="text-lg text-[#f3ba2f]">
            +{totalEarned.toLocaleString()}
          </p>
        </div>
      </div>
    );
  };

  if (!users.length) {
    return (
      <div className="bg-[#272a2f] rounded-lg p-4">
        <div className="mb-4">
          <h3 className="text-lg mb-2">Your Referral Code</h3>
          <div className="bg-[#1c1f24] p-3 rounded-lg flex justify-between items-center">
            <span className="text-[#f3ba2f]">{referralCode}</span>
            <button
              onClick={handleCopyLink}
              className="text-sm text-[#85827d] hover:text-[#f3ba2f]"
            >
              Copy Link
            </button>
          </div>
        </div>
        <ReferralStats />
        <p className="text-center text-gray-400 mt-4">No referrals yet</p>
      </div>
    );
  }

  return (
    <div className="bg-[#272a2f] rounded-lg p-4">
      <div className="mb-4">
        <h3 className="text-lg mb-2">Your Referral Code</h3>
        <div className="bg-[#1c1f24] p-3 rounded-lg flex justify-between items-center">
          <span className="text-[#f3ba2f]">{referralCode}</span>
          <button
            onClick={handleCopyLink}
            className="text-sm text-[#85827d] hover:text-[#f3ba2f]"
          >
            Copy Link
          </button>
        </div>
      </div>

      <h3 className="text-lg mb-4">Your Referrals</h3>
      <div className="space-y-2">
        {users.map((user, index) => (
          <div
            key={user.username}
            className={`flex items-center justify-between p-3 rounded-lg ${
              user.username === currentUser
                ? "bg-[#f3ba2f]/10 border border-[#f3ba2f]/50"
                : "bg-[#1c1f24]"
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
                +
                {(
                  user.totalRefEarnings ??
                  user.earnedFromRef ??
                  0
                ).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <ReferralStats />
    </div>
  );
};

export default Referral;
