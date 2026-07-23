import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface DailyComboModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (reward: number) => void;
  username?: string;
}

const DailyComboModal: React.FC<DailyComboModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  username = "Guest_89LPR",
}) => {
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isClaimedToday, setIsClaimedToday] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];
  const storageKey = `combo_claimed_${username}_${todayStr}`;

  useEffect(() => {
    const claimed = localStorage.getItem(storageKey);
    if (claimed === "true") {
      setIsClaimedToday(true);
    }
  }, [storageKey, isOpen]);

  const cards = [
    { id: 1, name: "Quantum Rig", icon: "⚡", power: "+15K/hr" },
    { id: 2, name: "ETH Validator", icon: "💎", power: "+50K/hr" },
    { id: 3, name: "AI Cyber Node", icon: "🤖", power: "+120K/hr" },
    { id: 4, name: "Robinhood Cyber Core", icon: "🌐", power: "+200K/hr" },
  ];

  if (!isOpen) return null;

  const handleSelectCard = (id: number) => {
    if (isClaimedToday) return;
    if (selectedCards.includes(id)) {
      setSelectedCards(selectedCards.filter((c) => c !== id));
    } else {
      if (selectedCards.length < 3) {
        setSelectedCards([...selectedCards, id]);
      } else {
        toast.info("Maximum 3 combo cards selected!");
      }
    }
  };

  const handleClaimCombo = () => {
    if (isClaimedToday) {
      toast.info("You have already claimed today's 5,000 Combo jackpot!");
      return;
    }
    if (selectedCards.length !== 3) {
      toast.error("Please select 3 combo cards to claim 5,000 bonus!");
      return;
    }
    localStorage.setItem(storageKey, "true");
    setIsClaimedToday(true);
    onSuccess(5000);
    toast.success("⚡ DAILY COMBO UNLOCKED! +5,000 BONUS POINTS ETH!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-orbitron">
      <div className="w-full max-w-md bg-[#0a1424] border border-[#ffe600]/40 rounded-[28px] p-6 text-[#f0eeff] shadow-[0_0_50px_rgba(255,230,0,0.25)] relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎟️</span>
            <h3 className="text-xl font-black uppercase tracking-tight yellow-glow">5,000 Daily Combo</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#ffe600]/20 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Selected Combo Slots */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          {[0, 1, 2].map((slotIndex) => {
            const cardId = selectedCards[slotIndex];
            const card = cards.find((c) => c.id === cardId);

            return (
              <div
                key={slotIndex}
                className="h-20 bg-[#060a12] border border-[#ffe600]/30 rounded-2xl flex flex-col items-center justify-center text-center p-2"
              >
                {card ? (
                  <>
                    <span className="text-xl mb-0.5">{card.icon}</span>
                    <span className="text-[9px] font-black text-[#ffe600] truncate w-full">{card.name}</span>
                  </>
                ) : (
                  <span className="text-gray-600 font-mono text-[10px] font-bold">SLOT {slotIndex + 1}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Available Cards List */}
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Available Tech Modules</p>
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {cards.map((c) => {
            const isSelected = selectedCards.includes(c.id);

            return (
              <div
                key={c.id}
                onClick={() => handleSelectCard(c.id)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center space-x-3 ${
                  isSelected
                    ? "bg-[#ffe600]/20 border-[#ffe600] shadow-[0_0_15px_#ffe600]"
                    : "bg-[#060a12] border-white/10 hover:border-[#ffe600]/40"
                }`}
              >
                <span className="text-2xl">{c.icon}</span>
                <div className="overflow-hidden">
                  <p className="text-xs font-black text-white truncate">{c.name}</p>
                  <p className="text-[9px] font-bold text-[#ffe600]">{c.power}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 📖 DETAILED PROTOCOL GUIDE */}
        <div className="bg-[#060a12] p-4 rounded-2xl border border-[#ffe600]/30 mb-4 space-y-2 text-xs">
          <p className="font-black text-[#ffe600] uppercase flex items-center space-x-1.5">
            <span>📖</span> <span>DETAILED COMBO PROTOCOL GUIDE</span>
          </p>
          <ul className="text-gray-300 space-y-1.5 text-[11px] list-disc list-inside">
            <li>Find and pick the <strong>3 secret daily cards</strong> from the tech module cards.</li>
            <li>Matching all 3 correct card slots unlocks the <strong>5,000 ETH Points</strong> jackpot.</li>
            <li>Each daily combo can only be claimed <strong>once per 24 hours</strong>.</li>
          </ul>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleClaimCombo}
          disabled={selectedCards.length !== 3 || isClaimedToday}
          className={`w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all ${
            selectedCards.length !== 3 || isClaimedToday
              ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-white/10"
              : "bg-gradient-to-r from-[#ffe600] via-[#31ff00] to-[#00ff7b] text-black shadow-[0_0_25px_#ffe600] hover:scale-[1.02]"
          }`}
        >
          {isClaimedToday ? "5,000 COMBO CLAIMED TODAY ✓" : `Claim 5,000 Combo (${selectedCards.length}/3 Cards)`}
        </button>
      </div>
    </div>
  );
};

export default DailyComboModal;
