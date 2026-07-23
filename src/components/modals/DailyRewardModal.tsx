import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface DailyRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim: (amount: number) => void;
  username?: string;
}

const DailyRewardModal: React.FC<DailyRewardModalProps> = ({
  isOpen,
  onClose,
  onClaim,
  username = "Guest_89LPR",
}) => {
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [isClaimedToday, setIsClaimedToday] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];
  const dateKey = `reward_claimed_date_${username}`;
  const dayKey = `reward_streak_day_${username}`;

  useEffect(() => {
    const savedDate = localStorage.getItem(dateKey);
    const savedDay = localStorage.getItem(dayKey);

    const dayNum = savedDay ? parseInt(savedDay, 10) : 1;
    setCurrentDay(dayNum);

    if (savedDate === todayStr) {
      setIsClaimedToday(true);
    } else {
      setIsClaimedToday(false);
    }
  }, [dateKey, dayKey, todayStr, isOpen]);

  const rewards = [
    { day: 1, points: 100, label: "100" },
    { day: 2, points: 250, label: "250" },
    { day: 3, points: 500, label: "500" },
    { day: 4, points: 1000, label: "1.0K" },
    { day: 5, points: 2500, label: "2.5K" },
    { day: 6, points: 5000, label: "5.0K" },
    { day: 7, points: 10000, label: "10K" },
  ];

  if (!isOpen) return null;

  const handleClaimToday = () => {
    if (isClaimedToday) {
      toast.info("You have already claimed today's daily streak reward!");
      return;
    }
    const reward = rewards.find((r) => r.day === currentDay) || rewards[0];

    localStorage.setItem(dateKey, todayStr);
    const nextDay = currentDay >= 7 ? 1 : currentDay + 1;
    localStorage.setItem(dayKey, nextDay.toString());

    setIsClaimedToday(true);
    onClaim(reward.points);
    toast.success(`Claimed Day ${currentDay} Reward: +${reward.points.toLocaleString()} Points!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-orbitron">
      <div className="w-full max-w-md bg-[#0a1424] border border-[#00ff7b]/40 rounded-[28px] p-6 text-[#f0eeff] shadow-[0_0_50px_rgba(0,255,123,0.25)] relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎁</span>
            <h3 className="text-xl font-black uppercase tracking-tight neon-green-glow">Daily Cyber Streak</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#00ff7b]/20 transition-all"
          >
            ✕
          </button>
        </div>

        {/* 7 Days Grid */}
        <div className="grid grid-cols-4 gap-2.5 mb-5">
          {rewards.map((r) => {
            const isPast = r.day < currentDay;
            const isCurrent = r.day === currentDay;

            return (
              <div
                key={r.day}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                  r.day === 7 ? "col-span-2" : ""
                } ${
                  isPast || (isCurrent && isClaimedToday)
                    ? "bg-[#00ff7b]/10 border-[#00ff7b]/40 text-[#00ff7b]"
                    : isCurrent
                    ? "bg-[#00e5ff]/20 border-[#00e5ff] text-white animate-pulse shadow-[0_0_15px_#00e5ff]"
                    : "bg-[#060a12] border-white/10 text-gray-500"
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-wider block mb-1">Day {r.day}</span>
                <span className="text-sm font-black block text-[#ffe600]">{r.label}</span>
                {(isPast || (isCurrent && isClaimedToday)) && <span className="text-[9px] font-bold text-[#00ff7b] mt-1">CLAIMED ✓</span>}
              </div>
            );
          })}
        </div>

        {/* 📖 DETAILED PROTOCOL GUIDE */}
        <div className="bg-[#060a12] p-4 rounded-2xl border border-[#00ff7b]/30 mb-5 space-y-2 text-xs">
          <p className="font-black text-[#00ff7b] uppercase flex items-center space-x-1.5">
            <span>📖</span> <span>DETAILED STREAK PROTOCOL GUIDE</span>
          </p>
          <ul className="text-gray-300 space-y-1.5 text-[11px] list-disc list-inside">
            <li>Log in consecutive days to multiply your daily points exponentially.</li>
            <li>Reach the <strong>Day 7 Milestone</strong> to unlock <strong>10,000 ETH Points</strong>.</li>
            <li>Claiming is available <strong>once every 24 hours</strong>.</li>
          </ul>
        </div>

        {/* Claim Button */}
        <button
          onClick={handleClaimToday}
          disabled={isClaimedToday}
          className={`w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all ${
            isClaimedToday
              ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-white/10"
              : "bg-gradient-to-r from-[#00ff7b] via-[#31ff00] to-[#00e5ff] text-black shadow-[0_0_25px_#00ff7b] hover:scale-[1.02]"
          }`}
        >
          {isClaimedToday ? "Today's Reward Claimed ✓" : `Claim Day ${currentDay} (${rewards[currentDay - 1].label} Points)`}
        </button>
      </div>
    </div>
  );
};

export default DailyRewardModal;
