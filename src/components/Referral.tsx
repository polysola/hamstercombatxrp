import React from "react";
import { toast } from "react-toastify";
import { ReferralUser } from "../types/user";

interface ReferralProps {
  users?: ReferralUser[];
  currentUser?: string;
}

const Referral: React.FC<ReferralProps> = ({ users = [], currentUser }) => {
  const handleCopyLink = () => {
    if (!currentUser) return;

    const botUsername = "HamterCombatXrp_bot";
    const miniAppLink = `https://t.me/${botUsername}/miniapp?startapp=${currentUser}`;
    navigator.clipboard.writeText(miniAppLink);
    toast.success("Referral link copied!");
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const ReferralStats = () => {
    const totalReferrals = users.reduce(
      (sum, user) => sum + user.referralCount,
      0
    );
    const totalEarned = users.reduce((sum, user) => sum + user.totalEarned, 0);

    return (
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-[#1c1f24] to-[#272a2f] p-4 rounded-xl text-center shadow-lg">
          <div className="bg-[#f3ba2f]/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg
              className="w-6 h-6 text-[#f3ba2f]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <p className="text-sm text-[#85827d] mb-1">Total Referrals</p>
          <p className="text-2xl font-bold text-[#f3ba2f]">{totalReferrals}</p>
          <p className="text-xs text-[#85827d] mt-1">Direct: {users.length}</p>
        </div>
        <div className="bg-gradient-to-br from-[#1c1f24] to-[#272a2f] p-4 rounded-xl text-center shadow-lg">
          <div className="bg-[#f3ba2f]/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg
              className="w-6 h-6 text-[#f3ba2f]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-sm text-[#85827d] mb-1">Total Earned</p>
          <p className="text-2xl font-bold text-[#f3ba2f]">
            +{totalEarned.toLocaleString()}
          </p>
          <p className="text-xs text-[#85827d] mt-1">From all levels</p>
        </div>
      </div>
    );
  };

  const ReferralCode = () => (
    <div className="mb-6">
      <h3 className="text-lg mb-3 flex items-center">
        <span>Your Referral Code</span>
        <div className="ml-2 bg-[#f3ba2f]/10 px-2 py-1 rounded-full">
          <span className="text-xs text-[#f3ba2f]">Earn 5% per referral</span>
        </div>
      </h3>
      <div className="bg-gradient-to-r from-[#1c1f24] to-[#272a2f] p-4 rounded-xl">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-[#85827d] mb-1">Share your code</p>
            <p className="text-lg text-[#f3ba2f] font-mono">{currentUser}</p>
          </div>
          <button
            onClick={handleCopyLink}
            className="bg-[#f3ba2f]/10 hover:bg-[#f3ba2f]/20 text-[#f3ba2f] px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );

  const ReferralList = () => (
    <div>
      <h3 className="text-lg mb-4">Your Referrals</h3>
      <div className="space-y-3">
        {users.map((user, index) => (
          <div
            key={user.username}
            className={`bg-gradient-to-r ${
              user.username === currentUser
                ? "from-[#f3ba2f]/10 to-[#272a2f] border border-[#f3ba2f]/20"
                : "from-[#1c1f24] to-[#272a2f]"
            } p-4 rounded-xl transition-all duration-200 hover:transform hover:translate-x-1`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#f3ba2f] to-[#f3ba2f]/50 rounded-full blur-sm opacity-20"></div>
                  <span className="relative text-[#f3ba2f] font-bold">
                    #{index + 1}
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-[#f3ba2f]/20 rounded-full blur-sm"></div>
                  <img
                    src={user.photoUrl || "/src/images/suit.png"}
                    alt={user.username}
                    className="relative w-10 h-10 rounded-full border-2 border-[#f3ba2f]/20"
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="text-white font-medium">{user.username}</p>
                    {user.referrer && (
                      <span className="text-xs bg-[#f3ba2f]/10 text-[#f3ba2f] px-2 py-0.5 rounded-full">
                        via {user.referrer}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-[#85827d]">
                      {formatDate(user.lastUpdated)}
                    </p>
                    {user.referralCount > 0 && (
                      <span className="text-xs bg-[#f3ba2f]/10 text-[#f3ba2f] px-2 py-0.5 rounded-full">
                        {user.referralCount} refs
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[#f3ba2f] font-bold">
                  +{user.totalEarned.toLocaleString()}
                </p>
                <div className="flex items-center justify-end space-x-1">
                  <p className="text-xs text-[#85827d]">earned</p>
                  {user.totalEarned > user.earnedFromRef && (
                    <span className="text-xs bg-[#f3ba2f]/10 text-[#f3ba2f] px-1 rounded">
                      +
                      {(user.totalEarned - user.earnedFromRef).toLocaleString()}{" "}
                      bonus
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-[#272a2f] rounded-lg p-4">
      <ReferralStats />
      <ReferralCode />
      {users.length > 0 ? (
        <ReferralList />
      ) : (
        <div className="text-center py-8">
          <div className="bg-[#1c1f24] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-[#85827d]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <p className="text-[#85827d] mb-2">No referrals yet</p>
          <p className="text-sm text-[#85827d]/80">
            Share your referral link to start earning rewards!
          </p>
        </div>
      )}
    </div>
  );
};

export default Referral;
