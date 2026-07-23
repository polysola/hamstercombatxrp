import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import XIcon from "../../icons/XIcon";
import TelegramIcon from "../../icons/TelegramIcon";

interface TokenLaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TokenLaunchModal: React.FC<TokenLaunchModalProps> = ({ isOpen, onClose }) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });

  const DEV_WALLET_DISPLAY = "0x????...????";
  const LAUNCHPAD_LINK = "https://www.ponsfamily.com/launchpad";

  useEffect(() => {
    if (!isOpen) return;

    const calculateCountdown = () => {
      const now = new Date();

      // Target: 02:00:00 UTC tomorrow
      const target = new Date();
      target.setUTCHours(2, 0, 0, 0);

      // If current UTC time is past today's 02:00 UTC, target tomorrow 02:00 UTC
      if (now.getTime() >= target.getTime()) {
        target.setUTCDate(target.getUTCDate() + 1);
      }

      const diff = target.getTime() - now.getTime();

      // Automatically close modal when timer expires (diff <= 0)
      if (diff <= 0) {
        onClose();
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyDevWallet = () => {
    toast.info("🔒 Dev Wallet address is confidential until launch!");
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in font-orbitron">
      <div className="w-full max-w-md bg-[#0a0f1d] border-2 border-[#00ff7b]/60 rounded-[30px] p-5 sm:p-6 text-[#f0eeff] shadow-[0_0_60px_rgba(0,255,123,0.35)] relative max-h-[95vh] overflow-y-auto">
        
        {/* Top Pons Image Badge */}
        <div className="flex flex-col items-center justify-center mb-3">
          <div className="p-1 rounded-2xl bg-gradient-to-r from-[#00ff7b] via-[#00e5ff] to-[#ffe600] shadow-[0_0_25px_rgba(0,255,123,0.5)] mb-2">
            <img
              src="/images/image.png"
              alt="Pons Family Launchpad"
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-xl bg-[#070510] p-1"
            />
          </div>
          <span className="px-3 py-0.5 rounded-full bg-[#00ff7b]/20 border border-[#00ff7b]/50 text-[#00ff7b] text-[9px] font-black tracking-widest uppercase shadow-[0_0_15px_rgba(0,255,123,0.4)] animate-pulse">
            🔥 OFFICIAL LAUNCH ON PONS FAMILY LAUNCHPAD
          </span>
        </div>

        {/* Title & Platform Link */}
        <div className="text-center mb-3">
          <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight leading-tight">
            EGGRUSH TOKEN LAUNCH
          </h2>
          <p className="text-[11px] text-gray-300 font-bold mt-1">
            Launching Platform:{" "}
            <a
              href={LAUNCHPAD_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00e5ff] underline hover:text-[#00ff7b] transition-all font-mono break-all"
            >
              {LAUNCHPAD_LINK}
            </a>
          </p>
        </div>

        {/* Live Countdown Clock to 02:00 AM UTC */}
        <div className="bg-[#070510] p-4 rounded-2xl border border-[#00ff7b]/40 mb-3 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#00ff7b]/10 via-transparent to-transparent pointer-events-none"></div>
          <p className="text-[9px] text-[#00ff7b] font-black uppercase tracking-widest mb-1.5 neon-green-glow">
            ⏱ LAUNCH COUNTDOWN (02:00 AM UTC TOMORROW)
          </p>

          <div className="flex justify-center items-center space-x-2 sm:space-x-3 my-2">
            <div className="bg-[#0a1424] px-3 py-2 rounded-xl border border-[#00ff7b]/30 min-w-[60px]">
              <span className="text-2xl sm:text-3xl font-black text-white leading-none block">
                {timeLeft.hours.toString().padStart(2, "0")}
              </span>
              <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider block mt-1">HOURS</span>
            </div>
            <span className="text-xl font-black text-[#00ff7b] animate-ping">:</span>
            <div className="bg-[#0a1424] px-3 py-2 rounded-xl border border-[#00ff7b]/30 min-w-[60px]">
              <span className="text-2xl sm:text-3xl font-black text-white leading-none block">
                {timeLeft.minutes.toString().padStart(2, "0")}
              </span>
              <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider block mt-1">MINUTES</span>
            </div>
            <span className="text-xl font-black text-[#00ff7b] animate-ping">:</span>
            <div className="bg-[#0a1424] px-3 py-2 rounded-xl border border-[#00ff7b]/30 min-w-[60px]">
              <span className="text-2xl sm:text-3xl font-black text-[#00ff7b] neon-green-glow leading-none block">
                {timeLeft.seconds.toString().padStart(2, "0")}
              </span>
              <span className="text-[8px] text-[#00ff7b] font-bold uppercase tracking-wider block mt-1">SECONDS</span>
            </div>
          </div>

          {/* Timezone & Platform Badges */}
          <div className="flex flex-wrap justify-center gap-1.5 mt-3 pt-2 border-t border-white/10">
            <div className="bg-[#00e5ff]/10 border border-[#00e5ff]/30 px-3 py-1 rounded-lg">
              <span className="text-[10px] text-[#00e5ff] font-black tracking-wider">🌐 LAUNCH TIME: 02:00 AM UTC</span>
            </div>
            <button
              onClick={() => window.open(LAUNCHPAD_LINK, "_blank")}
              className="bg-[#00ff7b]/15 hover:bg-[#00ff7b]/30 border border-[#00ff7b]/40 px-3 py-1 rounded-lg transition-all"
            >
              <span className="text-[10px] text-[#00ff7b] font-black tracking-wider">🚀 Visit Launchpad</span>
            </button>
          </div>
        </div>

        {/* Dev Wallet Address Card */}
        <div className="bg-[#070510] p-3.5 rounded-2xl border border-[#ffe600]/40 mb-3 space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-black text-[#ffe600] uppercase tracking-wider yellow-glow flex items-center space-x-1">
              <span>💳</span> <span>OFFICIAL DEV WALLET ADDRESS</span>
            </p>
            <span className="text-[8px] font-bold text-gray-400 uppercase">EVM CHAIN</span>
          </div>

          <div className="bg-[#0a1424] p-2.5 rounded-xl border border-[#ffe600]/30 font-mono text-xs sm:text-sm text-[#ffe600] font-black break-all text-center tracking-widest shadow-[0_0_10px_rgba(255,230,0,0.2)]">
            {DEV_WALLET_DISPLAY}
          </div>

          <button
            onClick={handleCopyDevWallet}
            className="w-full py-2 rounded-xl bg-[#ffe600]/20 hover:bg-[#ffe600] hover:text-black border border-[#ffe600]/50 text-[#ffe600] font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(255,230,0,0.3)] flex items-center justify-center space-x-1.5"
          >
            <span>🔒</span>
            <span>Dev Wallet Address Confidential</span>
          </button>
        </div>

        {/* Security Warning Box */}
        <div className="bg-red-500/10 border border-red-500/40 rounded-2xl p-3 mb-3 space-y-1 text-center">
          <p className="text-[11px] font-black text-red-400 uppercase tracking-wider flex items-center justify-center space-x-1">
            <span>⚠️</span>
            <span>BEWARE OF FAKE CONTRACT ADDRESSES</span>
          </p>
          <p className="text-[10px] text-gray-300 font-medium leading-relaxed">
            Do not trust any unverified contract addresses! Official token contract address will ONLY be published on our verified channels when the countdown reaches 00:00:00.
          </p>
        </div>

        {/* Official Social Channels */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={() => window.open("https://x.com/EggRushRH", "_blank")}
            className="py-3 rounded-2xl bg-[#0a1424] hover:bg-[#00ff7b]/20 border border-[#00ff7b]/40 text-[#00ff7b] font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 group"
          >
            <XIcon size={16} />
            <span>Follow on X</span>
          </button>
          <button
            onClick={() => window.open("https://t.me/EggRush_RobinHood", "_blank")}
            className="py-3 rounded-2xl bg-[#0a1424] hover:bg-[#00e5ff]/20 border border-[#00e5ff]/40 text-[#00e5ff] font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 group"
          >
            <TelegramIcon size={16} />
            <span>Join Telegram</span>
          </button>
        </div>

        {/* Close Button / Enter Game */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-[#00ff7b] text-black font-black text-sm uppercase tracking-wider shadow-[0_0_25px_#00ff7b] hover:bg-[#31ff00] transition-all"
        >
          🚀 Enter EggRush Game
        </button>

      </div>
    </div>
  );
};

export default TokenLaunchModal;
