import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface DailyCipherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (reward: number) => void;
  username?: string;
}

const DailyCipherModal: React.FC<DailyCipherModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  username = "Guest_89LPR",
}) => {
  const [morseSequence, setMorseSequence] = useState("");
  const [isClaimedToday, setIsClaimedToday] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];
  const storageKey = `cipher_claimed_${username}_${todayStr}`;

  useEffect(() => {
    const claimed = localStorage.getItem(storageKey);
    if (claimed === "true") {
      setIsClaimedToday(true);
    }
  }, [storageKey, isOpen]);

  if (!isOpen) return null;

  const handleDot = () => {
    if (isClaimedToday) return;
    setMorseSequence((prev) => prev + ".");
  };

  const handleDash = () => {
    if (isClaimedToday) return;
    setMorseSequence((prev) => prev + "-");
  };

  const handleClear = () => {
    setMorseSequence("");
  };

  const handleClaimCipher = () => {
    if (isClaimedToday) {
      toast.info("You have already claimed today's 2,500 Cipher reward!");
      return;
    }
    localStorage.setItem(storageKey, "true");
    setIsClaimedToday(true);
    onSuccess(2500);
    toast.success("🔑 Morse Cyber Cipher Deciphered! +2,500 ETH Points!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-orbitron">
      <div className="w-full max-w-md bg-[#0a1424] border border-[#00e5ff]/40 rounded-[28px] p-6 text-[#f0eeff] shadow-[0_0_50px_rgba(0,229,255,0.25)] relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🔐</span>
            <h3 className="text-xl font-black uppercase tracking-tight cyan-glow">Morse Cyber Cipher</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#00e5ff]/20 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Display Screen */}
        <div className="bg-[#060a12] p-3.5 rounded-2xl border border-[#00e5ff]/30 mb-4 text-center space-y-1">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Decipher Display Terminal</p>
          <div className="h-9 flex items-center justify-center font-mono text-2xl font-black text-[#00e5ff] tracking-widest cyan-glow">
            {morseSequence || "• • — •"}
          </div>
          <p className="text-[10px] text-[#ffe600]">Reward: 2,500 ETH Points</p>
        </div>

        {/* Quick Morse Input Pad */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={handleDot}
            disabled={isClaimedToday}
            className="py-3.5 bg-[#060a12] hover:bg-[#00ff7b]/20 border border-[#00ff7b]/40 rounded-2xl text-xl font-black text-[#00ff7b] transition-all active:scale-95 shadow-[0_0_15px_rgba(0,255,123,0.15)] disabled:opacity-40"
          >
            • (DOT)
          </button>
          <button
            onClick={handleDash}
            disabled={isClaimedToday}
            className="py-4 bg-[#060a12] hover:bg-[#00e5ff]/20 border border-[#00e5ff]/40 rounded-2xl text-xl font-black text-[#00e5ff] transition-all active:scale-95 shadow-[0_0_15px_rgba(0,229,255,0.15)] disabled:opacity-40"
          >
            — (DASH)
          </button>
        </div>

        {/* 📖 DETAILED PROTOCOL GUIDE */}
        <div className="bg-[#060a12] p-4 rounded-2xl border border-[#00e5ff]/30 mb-4 space-y-2 text-xs">
          <p className="font-black text-[#00e5ff] uppercase flex items-center space-x-1.5">
            <span>📖</span> <span>DETAILED CIPHER PROTOCOL GUIDE</span>
          </p>
          <ul className="text-gray-300 space-y-1.5 text-[11px] list-disc list-inside">
            <li>Use <strong>DOT (Short Tap •)</strong> and <strong>DASH (Long Press —)</strong> keys to input the daily Morse sequence.</li>
            <li>Deciphering unlocks the <strong>2,500 ETH Points</strong> bonus.</li>
            <li>Each daily cipher can only be claimed <strong>once per 24 hours</strong>.</li>
          </ul>
        </div>

        {/* Submit & Clear */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleClear}
            className="py-3 bg-white/10 hover:bg-white/20 text-gray-300 rounded-xl text-xs font-black uppercase transition-all"
          >
            CLEAR CIPHER
          </button>
          <button
            onClick={handleClaimCipher}
            disabled={isClaimedToday}
            className={`py-3 rounded-xl text-xs font-black uppercase transition-all ${
              isClaimedToday
                ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-white/10"
                : "bg-[#00e5ff] hover:bg-[#31ff00] text-black shadow-[0_0_20px_#00e5ff]"
            }`}
          >
            {isClaimedToday ? "CLAIMED TODAY ✓" : "CLAIM 2.5K CODE"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyCipherModal;
