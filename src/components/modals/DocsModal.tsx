import React, { useState } from "react";

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type DocCategory = "overview" | "boost" | "autobot" | "quests" | "combo" | "web3" | "referral" | "leaderboard";

const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<DocCategory>("overview");

  if (!isOpen) return null;

  const categories: { id: DocCategory; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "🎮" },
    { id: "boost", label: "Boosters", icon: "⚡" },
    { id: "autobot", label: "Auto Bot", icon: "🤖" },
    { id: "quests", label: "Daily Quests", icon: "🎁" },
    { id: "combo", label: "Combo Modules", icon: "🎟️" },
    { id: "web3", label: "Web3 & Token", icon: "💳" },
    { id: "referral", label: "Referrals", icon: "👥" },
    { id: "leaderboard", label: "Leaderboard", icon: "📊" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in font-orbitron">
      <div className="w-full max-w-lg bg-[#0a0f1d] border border-[#00e5ff]/50 rounded-[28px] p-5 text-[#f0eeff] shadow-[0_0_60px_rgba(0,229,255,0.3)] relative max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl animate-pulse">📖</span>
            <div>
              <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight cyan-glow leading-none">
                EggRush Web3 Docs
              </h3>
              <span className="text-[9px] text-[#00e5ff] font-black tracking-widest uppercase">
                OFFICIAL WHITEPAPER & TELEGRAM GAME GUIDE
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#00e5ff]/20 transition-all shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Category Navigation Bar */}
        <div className="flex space-x-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none border-b border-white/10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-black text-[10px] sm:text-xs whitespace-nowrap transition-all flex items-center space-x-1 shrink-0 ${
                selectedCategory === cat.id
                  ? "bg-[#00e5ff] text-black shadow-[0_0_15px_#00e5ff]"
                  : "bg-[#070510] text-gray-400 hover:text-white border border-white/5"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Category Content */}
        <div className="bg-[#070510] p-4 rounded-2xl border border-white/10 text-xs space-y-3 max-h-[52vh] overflow-y-auto pr-1">
          
          {selectedCategory === "overview" && (
            <div className="space-y-2.5">
              <h4 className="text-sm font-black text-[#00ff7b] uppercase flex items-center space-x-1.5">
                <span>🎮</span> <span>1. OVERVIEW & EXACT POINTS PER CLICK</span>
              </h4>
              <p className="text-gray-300 leading-relaxed text-[11px]">
                <strong>EggRush</strong> is a Web3 Tap-to-Earn GameFi ecosystem powered by the <strong>Robinhood EVM Chain</strong>.
              </p>
              
              <div className="bg-[#0a1424] p-3 rounded-xl border border-[#00ff7b]/30 space-y-1">
                <p className="font-black text-[#00ff7b] text-[10px] uppercase">⚡ TAP MINING FORMULA</p>
                <p className="font-mono text-gray-200 text-[10px]">
                  Points Earned Per Click = (Level Index + 1) × 2 × Turbo Multiplier
                </p>
              </div>

              <p className="font-black text-white text-[11px] uppercase">📊 PER-CLICK REWARDS TABLE BY LEVEL:</p>
              <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
                <div className="bg-[#0a1424] p-1.5 rounded border border-white/10">Lv 1 Bronze: <span className="text-[#00ff7b] font-bold">+2 / tap</span></div>
                <div className="bg-[#0a1424] p-1.5 rounded border border-white/10">Lv 2 Silver: <span className="text-[#00ff7b] font-bold">+4 / tap</span></div>
                <div className="bg-[#0a1424] p-1.5 rounded border border-white/10">Lv 3 Gold: <span className="text-[#00ff7b] font-bold">+6 / tap</span></div>
                <div className="bg-[#0a1424] p-1.5 rounded border border-white/10">Lv 4 Platinum: <span className="text-[#00ff7b] font-bold">+8 / tap</span></div>
                <div className="bg-[#0a1424] p-1.5 rounded border border-white/10">Lv 5 Diamond: <span className="text-[#00ff7b] font-bold">+10 / tap</span></div>
                <div className="bg-[#0a1424] p-1.5 rounded border border-white/10">Lv 6 Epic: <span className="text-[#00ff7b] font-bold">+12 / tap</span></div>
                <div className="bg-[#0a1424] p-1.5 rounded border border-white/10">Lv 7 Legendary: <span className="text-[#00ff7b] font-bold">+14 / tap</span></div>
                <div className="bg-[#0a1424] p-1.5 rounded border border-white/10">Lv 8 Master: <span className="text-[#00ff7b] font-bold">+16 / tap</span></div>
                <div className="bg-[#0a1424] p-1.5 rounded border border-white/10">Lv 9 GrandMaster: <span className="text-[#00ff7b] font-bold">+18 / tap</span></div>
                <div className="bg-[#0a1424] p-1.5 rounded border border-white/10">Lv 10 Lord: <span className="text-[#00ff7b] font-bold">+20 / tap</span></div>
              </div>

              <div className="bg-[#ffe600]/10 p-2 rounded-xl border border-[#ffe600]/30 text-[10px] text-[#ffe600] font-bold">
                💥 Egg Hatching Jackpot: Every 15 Taps = Shell Cracks & Burst Sparkles +100 EGG Bonus!
              </div>
            </div>
          )}

          {selectedCategory === "combo" && (
            <div className="space-y-2.5">
              <h4 className="text-sm font-black text-[#ffe600] uppercase flex items-center space-x-1.5">
                <span>🎟️</span> <span>DAILY COMBO TECH MODULES & POWER</span>
              </h4>
              <p className="text-gray-300 leading-relaxed text-[11px]">
                Match the 3 secret tech module cards to unlock the <strong>+5,000 EGG Points Jackpot</strong> daily!
              </p>

              <div className="space-y-1.5">
                <div className="bg-[#0a1424] p-2 rounded-xl border border-[#00ff7b]/30 flex justify-between items-center">
                  <span className="font-bold text-white text-[11px]">⚡ Quantum Rig</span>
                  <span className="font-mono text-[#00ff7b] font-black text-[10px]">Power: +15K / hr</span>
                </div>
                <div className="bg-[#0a1424] p-2 rounded-xl border border-[#00e5ff]/30 flex justify-between items-center">
                  <span className="font-bold text-white text-[11px]">💎 ETH Validator</span>
                  <span className="font-mono text-[#00e5ff] font-black text-[10px]">Power: +50K / hr</span>
                </div>
                <div className="bg-[#0a1424] p-2 rounded-xl border border-[#ab00ff]/30 flex justify-between items-center">
                  <span className="font-bold text-white text-[11px]">🤖 AI Cyber Node</span>
                  <span className="font-mono text-[#ab00ff] font-black text-[10px]">Power: +120K / hr</span>
                </div>
                <div className="bg-[#0a1424] p-2 rounded-xl border border-[#ffe600]/30 flex justify-between items-center">
                  <span className="font-bold text-white text-[11px]">🌐 Robinhood Cyber Core</span>
                  <span className="font-mono text-[#ffe600] font-black text-[10px]">Power: +200K / hr</span>
                </div>
              </div>

              <p className="text-[10px] text-gray-400 italic">* Selecting all 3 correct card slots claims +5,000 EGG bonus (Refreshes at 12:00 UTC).</p>
            </div>
          )}

          {selectedCategory === "boost" && (
            <div className="space-y-2.5">
              <h4 className="text-sm font-black text-[#ffe600] uppercase flex items-center space-x-1.5">
                <span>⚡</span> <span>2. BOOSTERS & ENERGY SYSTEM</span>
              </h4>
              <p className="text-gray-300 leading-relaxed text-[11px]">
                Maximize your mining output using free daily boosters and auto-restoring energy bars.
              </p>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#0a1424] p-2.5 rounded-xl border border-[#00ff7b]/30">
                  <p className="font-black text-[#00ff7b] text-[11px]">🔋 Full Energy Refill</p>
                  <p className="text-[10px] text-gray-400 mt-1">Restores 1000/1000 energy. 6 free refills available per day.</p>
                </div>
                <div className="bg-[#0a1424] p-2.5 rounded-xl border border-[#00e5ff]/30">
                  <p className="font-black text-[#00e5ff] text-[11px]">🚀 Turbo Tap 2X</p>
                  <p className="text-[10px] text-gray-400 mt-1">Multiplies all tap mining gains by 2x for 30 seconds.</p>
                </div>
              </div>

              <p className="text-[10px] text-gray-400 italic">* Energy auto-restores at +3 Energy per second.</p>
            </div>
          )}

          {selectedCategory === "autobot" && (
            <div className="space-y-2.5">
              <h4 className="text-sm font-black text-[#ab00ff] uppercase flex items-center space-x-1.5">
                <span>🤖</span> <span>3. AI AUTO BOT OFFLINE MINING</span>
              </h4>
              <p className="text-gray-300 leading-relaxed text-[11px]">
                Your AI Mining Bot works continuously while you are away from the game.
              </p>

              <ul className="text-gray-300 space-y-1.5 text-[11px] list-disc list-inside">
                <li><strong>Fixed Mining Rate</strong>: Earns <strong>1,200 EGG coins / hour</strong> (+20 EGG/min).</li>
                <li><strong>Anti-Inflation Cap</strong>: Maximum <strong>3 hours (3,600 EGG)</strong> per offline session.</li>
                <li><strong>Firestore Sync</strong>: Pressing Claim syncs points directly to your Cloud Firestore Database.</li>
              </ul>
            </div>
          )}

          {selectedCategory === "quests" && (
            <div className="space-y-2.5">
              <h4 className="text-sm font-black text-[#00ff7b] uppercase flex items-center space-x-1.5">
                <span>🎁</span> <span>4. DAILY QUESTS & REWARDS</span>
              </h4>

              <div className="space-y-2">
                <div className="bg-[#0a1424] p-2.5 rounded-xl border border-[#00ff7b]/30">
                  <p className="font-black text-[#00ff7b] text-[11px]">🎁 Daily Cyber Streak (Up to 10K)</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Check-in 7 consecutive days to unlock 10,000 EGG Jackpot.</p>
                </div>

                <div className="bg-[#0a1424] p-2.5 rounded-xl border border-[#00e5ff]/30">
                  <p className="font-black text-[#00e5ff] text-[11px]">🔐 Daily Morse Cipher (+2.5K)</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Decipher today's Morse sequence (Dot • & Dash —) for +2,500 EGG.</p>
                </div>
              </div>
            </div>
          )}

          {selectedCategory === "web3" && (
            <div className="space-y-2.5">
              <h4 className="text-sm font-black text-[#00e5ff] uppercase flex items-center space-x-1.5">
                <span>💳</span> <span>5. WEB3 WALLET & TOKEN LAUNCH</span>
              </h4>

              <p className="text-gray-300 leading-relaxed text-[11px]">
                Official Token launch is scheduled on the <strong>Pons.family Launchpad</strong>:
              </p>

              <div className="bg-[#0a1424] p-3 rounded-xl border border-[#00e5ff]/40 space-y-1 text-center">
                <p className="text-[10px] text-gray-400 font-bold">OFFICIAL LAUNCHPAD URL</p>
                <a
                  href="https://www.ponsfamily.com/launchpad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono font-black text-[#00e5ff] underline block"
                >
                  https://www.ponsfamily.com/launchpad
                </a>
                <p className="text-[10px] text-[#00ff7b] font-black mt-1">GLOBAL LAUNCH TIME: 14:00 UTC</p>
              </div>

              <div className="bg-[#0a1424] p-2.5 rounded-xl border border-white/10 space-y-1">
                <p className="text-[9px] text-[#ffe600] font-black">💳 OFFICIAL DEV WALLET ADDRESS</p>
                <p className="font-mono text-[10px] text-white break-all">0xF66F42154321F1d36594099302b6f6c926e7B51C</p>
              </div>

              <p className="text-[10px] text-gray-300">
                Playing in Telegram Mini App? Tap <strong>Open in MetaMask Mobile App</strong> to connect directly via Deep Link!
              </p>
            </div>
          )}

          {selectedCategory === "referral" && (
            <div className="space-y-2.5">
              <h4 className="text-sm font-black text-[#ff8800] uppercase flex items-center space-x-1.5">
                <span>👥</span> <span>6. REFERRAL FRIENDS SYSTEM</span>
              </h4>

              <p className="text-gray-300 leading-relaxed text-[11px]">
                Invite your friends to play EggRush and earn massive referral rewards:
              </p>

              <ul className="text-gray-300 space-y-1.5 text-[11px] list-disc list-inside">
                <li><strong>Regular Friend</strong>: Earn <strong>+2,500 EGG Points</strong> per invited friend.</li>
                <li><strong>Telegram Premium Friend</strong>: Earn <strong>+5,000 EGG Points</strong> per friend.</li>
              </ul>
            </div>
          )}

          {selectedCategory === "leaderboard" && (
            <div className="space-y-2.5">
              <h4 className="text-sm font-black text-[#00ff7b] uppercase flex items-center space-x-1.5">
                <span>📊</span> <span>7. LEADERBOARD & GLOBAL RANKING</span>
              </h4>

              <p className="text-gray-300 leading-relaxed text-[11px]">
                Compete with players worldwide to claim top positions in the Cyber Masters Leaderboard.
              </p>

              <ul className="text-gray-300 space-y-1.5 text-[11px] list-disc list-inside">
                <li>Real-time sync from <strong>Firebase Cloud Firestore</strong>.</li>
                <li>Displays top 10 highest scoring Cyber Masters.</li>
              </ul>
            </div>
          )}

        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={() => window.open("https://www.ponsfamily.com/launchpad", "_blank")}
            className="py-3 rounded-2xl bg-[#00e5ff]/20 hover:bg-[#00e5ff] hover:text-black border border-[#00e5ff]/40 text-[#00e5ff] font-black text-xs uppercase tracking-wider transition-all"
          >
            🚀 Open Launchpad
          </button>
          <button
            onClick={onClose}
            className="py-3 rounded-2xl bg-[#00ff7b] text-black font-black text-xs uppercase tracking-wider shadow-[0_0_20px_#00ff7b] hover:bg-[#31ff00] transition-all"
          >
            Close Docs
          </button>
        </div>

      </div>
    </div>
  );
};

export default DocsModal;
