import React from "react";
import { toast } from "react-toastify";

interface ReferralUser {
  username: string;
  score: number;
  photoUrl?: string;
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
    const miniAppLink = `https://t.me/${botUsername}/miniapp?tgWebAppStartParam=${referralCode}`;

    navigator.clipboard.writeText(miniAppLink);
    toast.success("Referral link copied!");
  };

  const ReferralStats = () => {
    const totalEarned = users.reduce(
      (sum, user) => sum + (user.earnedFromRef || 0),
      0
    );
    const totalReferrals = users.length;

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
            <span className="text-[#f3ba2f]">
              {referralCode || currentUser}
            </span>
            <button
              onClick={handleCopyLink}
              className="text-sm text-[#85827d] hover:text-[#f3ba2f]"
            >
              Copy Link
            </button>
          </div>
        </div>
        <p className="text-center text-gray-400">No referrals yet</p>
      </div>
    );
  }

  return (
    <div className="bg-[#272a2f] rounded-lg p-4">
      <div className="mb-4">
        <h3 className="text-lg mb-2">Your Referral Code</h3>
        <div className="bg-[#1c1f24] p-3 rounded-lg flex justify-between items-center">
          <span className="text-[#f3ba2f]">{referralCode || currentUser}</span>
          <button className="text-sm text-[#85827d]">Copy</button>
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
                +{user.earnedFromRef?.toLocaleString() || 0}
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
