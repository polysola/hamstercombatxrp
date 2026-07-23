import React from "react";
import { toast } from "react-toastify";

interface AutoBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  botEarnings: number;
  onCollect: () => void;
}

const AutoBotModal: React.FC<AutoBotModalProps> = ({
  isOpen,
  onClose,
  botEarnings,
  onCollect,
}) => {
  if (!isOpen) return null;

  const handleCollectEarnings = () => {
    if (botEarnings <= 0) {
      toast.info("Auto Bot is currently mining! Check back soon for accumulated coins.");
      return;
    }
    onCollect();
    toast.success(`🤖 Claimed +${botEarnings.toLocaleString()} Real-time Offline Mining ETH Coins!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-orbitron">
      <div className="w-full max-w-md bg-[#0a1424] border border-[#00ff7b]/40 rounded-[28px] p-6 text-[#f0eeff] shadow-[0_0_50px_rgba(0,255,123,0.25)] relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🤖</span>
            <h3 className="text-xl font-black uppercase tracking-tight cyan-glow">AI Mining Bot</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#00ff7b]/20 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Bot Info Panel */}
        <div className="bg-[#060a12] p-4 rounded-2xl border border-[#00ff7b]/30 mb-4 text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-[#00ff7b]/20 border border-[#00ff7b] flex items-center justify-center mx-auto text-3xl shadow-[0_0_20px_#00ff7b]">
            🤖
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Unclaimed Offline Mining Coins</p>
            <p className="text-3xl font-black text-[#00ff7b] neon-green-glow mt-1">
              +{botEarnings.toLocaleString()}
            </p>
          </div>
          <div className="flex justify-center items-center space-x-2 text-[10px] text-gray-400">
            <span className="w-2 h-2 rounded-full bg-[#00ff7b] animate-ping"></span>
            <span>Mining Rate: +1,200 ETH Coins / Hour</span>
          </div>
        </div>

        {/* 📖 DETAILED PROTOCOL GUIDE */}
        <div className="bg-[#060a12] p-4 rounded-2xl border border-[#00e5ff]/30 mb-4 space-y-2 text-xs">
          <p className="font-black text-[#00e5ff] uppercase flex items-center space-x-1.5">
            <span>📖</span> <span>DETAILED AUTO-BOT PROTOCOL GUIDE</span>
          </p>
          <ul className="text-gray-300 space-y-1.5 text-[11px] list-disc list-inside">
            <li>Your AI Mining Bot auto-accumulates ETH points continuously while you are offline.</li>
            <li>Calculated from real Firestore timestamp up to a max of <strong>3 hours per session</strong>.</li>
            <li>Press <strong>Claim Offline Mining Profit</strong> to add coins to your balance.</li>
          </ul>
        </div>

        {/* Collect Button */}
        <button
          onClick={handleCollectEarnings}
          disabled={botEarnings <= 0}
          className={`w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all ${
            botEarnings <= 0
              ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-white/10"
              : "bg-gradient-to-r from-[#00ff7b] via-[#31ff00] to-[#00e5ff] text-black shadow-[0_0_25px_#00ff7b] hover:scale-[1.02]"
          }`}
        >
          {botEarnings <= 0 ? "Mining In Progress..." : "Claim Offline Mining Profit"}
        </button>
      </div>
    </div>
  );
};

export default AutoBotModal;
