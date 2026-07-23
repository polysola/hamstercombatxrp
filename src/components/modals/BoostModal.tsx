import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface BoostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFullEnergy: () => void;
  onTurboBoost: () => void;
  username?: string;
}

const BoostModal: React.FC<BoostModalProps> = ({
  isOpen,
  onClose,
  onFullEnergy,
  onTurboBoost,
  username = "Guest_89LPR",
}) => {
  const [refillsLeft, setRefillsLeft] = useState(6);
  const maxRefillsPerDay = 6;

  const todayStr = new Date().toISOString().split("T")[0];
  const storageKey = `energy_refills_${username}_${todayStr}`;

  useEffect(() => {
    const used = localStorage.getItem(storageKey);
    if (used) {
      setRefillsLeft(Math.max(0, maxRefillsPerDay - parseInt(used, 10)));
    } else {
      setRefillsLeft(maxRefillsPerDay);
    }
  }, [storageKey, isOpen]);

  if (!isOpen) return null;

  const handleRefillEnergy = () => {
    if (refillsLeft <= 0) {
      toast.info("You have used all 6 free energy refills for today!");
      return;
    }
    const used = maxRefillsPerDay - refillsLeft + 1;
    localStorage.setItem(storageKey, used.toString());
    setRefillsLeft(maxRefillsPerDay - used);

    onFullEnergy();
    toast.success(`⚡ Energy Bar Refilled to 100% (1000/1000)! (${maxRefillsPerDay - used}/${maxRefillsPerDay} Left)`);
    onClose();
  };

  const handleActivateTurbo = () => {
    onTurboBoost();
    toast.success("🚀 Turbo Tap Activated! 2X Multiplier active for 30 seconds!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-orbitron">
      <div className="w-full max-w-md bg-[#0a1424] border border-[#00ff7b]/40 rounded-[28px] p-6 text-[#f0eeff] shadow-[0_0_50px_rgba(0,255,123,0.25)] relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⚡</span>
            <h3 className="text-xl font-black uppercase tracking-tight neon-green-glow">Cyber Turbo Boosters</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#00ff7b]/20 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Boost Cards */}
        <div className="space-y-3 mb-4">
          <div
            onClick={handleRefillEnergy}
            className="p-3.5 rounded-2xl bg-[#060a12] border border-[#00ff7b]/30 hover:border-[#00ff7b] cursor-pointer transition-all flex items-center justify-between group hover:bg-[#00ff7b]/10"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#00ff7b]/20 flex items-center justify-center text-xl border border-[#00ff7b]/40 group-hover:rotate-12 transition-transform">
                🔋
              </div>
              <div>
                <p className="text-xs font-black text-white">Full Energy Refill</p>
                <p className="text-[10px] text-gray-400">Instantly restores energy bar to 1000/1000</p>
              </div>
            </div>
            <span className="text-xs font-black bg-[#00ff7b] text-black px-3 py-1.5 rounded-xl shadow-[0_0_10px_#00ff7b]">
              {refillsLeft}/{maxRefillsPerDay} FREE
            </span>
          </div>

          <div
            onClick={handleActivateTurbo}
            className="p-3.5 rounded-2xl bg-[#060a12] border border-[#00e5ff]/30 hover:border-[#00e5ff] cursor-pointer transition-all flex items-center justify-between group hover:bg-[#00e5ff]/10"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#00e5ff]/20 flex items-center justify-center text-xl border border-[#00e5ff]/40 group-hover:rotate-12 transition-transform">
                🚀
              </div>
              <div>
                <p className="text-xs font-black text-white">Turbo Tap 2X Multiplier</p>
                <p className="text-[10px] text-gray-400">Earn 2x points per tap for 30s</p>
              </div>
            </div>
            <span className="text-xs font-black bg-[#00e5ff] text-black px-3 py-1.5 rounded-xl shadow-[0_0_10px_#00e5ff]">ACTIVATE</span>
          </div>
        </div>

        {/* 📖 DETAILED PROTOCOL GUIDE */}
        <div className="bg-[#060a12] p-4 rounded-2xl border border-[#00ff7b]/30 mb-4 space-y-2 text-xs">
          <p className="font-black text-[#00ff7b] uppercase flex items-center space-x-1.5">
            <span>📖</span> <span>DETAILED BOOST PROTOCOL GUIDE</span>
          </p>
          <ul className="text-gray-300 space-y-1.5 text-[11px] list-disc list-inside">
            <li><strong>Full Energy Refill</strong>: Restores energy bar to 1000/1000 instantly ({refillsLeft} refills left today).</li>
            <li><strong>Turbo Tap 2X</strong>: Multiplies all tap points by 2X for 30 seconds.</li>
          </ul>
        </div>

        {/* Cancel */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-white/10 hover:bg-white/20 text-gray-300 rounded-2xl text-xs font-black uppercase transition-all"
        >
          Close Booster Menu
        </button>
      </div>
    </div>
  );
};

export default BoostModal;
