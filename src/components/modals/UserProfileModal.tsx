import React from "react";
import { toast } from "react-toastify";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { username: string; photoUrl: string } | null;
  userPoints: number;
  walletAddress: string;
  levelName: string;
  levelIndex: number;
  profitPerHour: number;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  userPoints,
  walletAddress,
  levelName,
  levelIndex,
  profitPerHour,
}) => {
  if (!isOpen) return null;

  const isConnected = Boolean(walletAddress);
  const truncatedWallet = isConnected
    ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
    : "Not Connected";

  const formattedPoints = userPoints.toLocaleString(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  const handleCopyWallet = () => {
    if (!walletAddress) {
      toast.info("No wallet connected yet.");
      return;
    }
    navigator.clipboard.writeText(walletAddress);
    toast.success("Wallet address copied to clipboard!");
  };

  // Mocked Web3 On-Chain Demo Transaction Logs with EGG Token Symbol
  const transactions = [
    {
      id: "tx-1",
      title: "⚡ Tap Core Mining Rewards",
      txHash: "0x9a8f...4e1b",
      time: "2 mins ago",
      amount: "+50.0 EGG",
      status: "DEMO TESTNET",
      color: "text-[#00ff7b]",
    },
    {
      id: "tx-2",
      title: "🎁 Daily Cyber Streak Claim",
      txHash: "0x3d2c...1a9e",
      time: "2 hrs ago",
      amount: "+2,500.0 EGG",
      status: "DEMO TESTNET",
      color: "text-[#00ff7b]",
    },
    {
      id: "tx-3",
      title: "🔐 Daily Cipher Morse Solution",
      txHash: "0x7b1a...8f3c",
      time: "5 hrs ago",
      amount: "+2,500.0 EGG",
      status: "DEMO TESTNET",
      color: "text-[#00e5ff]",
    },
    {
      id: "tx-4",
      title: "🤖 Auto Bot Offline Mining Collect",
      txHash: "0x1e5f...9b2d",
      time: "Yesterday",
      amount: "+3,600.0 EGG",
      status: "DEMO TESTNET",
      color: "text-[#ab00ff]",
    },
    {
      id: "tx-5",
      title: "🎟️ Daily Combo Trio Jackpot",
      txHash: "0x8a4d...2e7f",
      time: "Yesterday",
      amount: "+5,000.0 EGG",
      status: "DEMO TESTNET",
      color: "text-[#ffe600]",
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in font-orbitron">
      <div className="w-full max-w-md bg-[#0a0f1d] border border-[#00ff7b]/40 rounded-[28px] p-5 text-[#f0eeff] shadow-[0_0_50px_rgba(0,255,123,0.25)] relative max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">👤</span>
            <div>
              <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight neon-green-glow leading-none">Web3 Cyber Profile</h3>
              <span className="text-[9px] text-[#ffe600] font-black tracking-widest uppercase">DEMO MODE ACTIVE</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#00ff7b]/20 transition-all shrink-0"
          >
            ✕
          </button>
        </div>

        {/* 1. Cyber Identity Profile Banner */}
        <div className="bg-[#070510] p-4 rounded-2xl border border-[#00ff7b]/30 mb-4 flex items-center space-x-3.5 relative overflow-hidden">
          <div className="p-0.5 rounded-full bg-gradient-to-r from-[#00ff7b] via-[#00e5ff] to-[#ab00ff] shadow-[0_0_15px_rgba(0,255,123,0.5)] shrink-0">
            <img
              src={user?.photoUrl}
              alt="Avatar"
              className="w-14 h-14 rounded-full border-2 border-[#060a12] object-contain bg-[#00ff7b]/10 p-0.5"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h4 className="text-base font-black text-white truncate">{user?.username || "Guest_89LPR"}</h4>
              <span className="text-[9px] font-black text-[#ff8800] bg-[#ff8800]/10 px-2 py-0.5 rounded-md border border-[#ff8800]/30 uppercase shrink-0">
                {levelName}
              </span>
            </div>

            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-gray-400 font-bold">Level {levelIndex + 1}</span>
              <span className="text-[10px] text-[#00ff7b] font-mono font-bold bg-[#00ff7b]/10 px-2 py-0.5 rounded-md border border-[#00ff7b]/30 truncate">
                {truncatedWallet}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Web3 Financial Overview Summary */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-[#070510] p-2.5 rounded-2xl border border-white/10 text-center">
            <p className="text-[8px] text-gray-400 font-bold uppercase mb-0.5">GAME POINTS</p>
            <p className="text-xs font-black text-[#00ff7b] neon-green-glow truncate">{formattedPoints}</p>
          </div>
          <div className="bg-[#070510] p-2.5 rounded-2xl border border-white/10 text-center">
            <p className="text-[8px] text-gray-400 font-bold uppercase mb-0.5">WALLET BAL</p>
            <p className="text-xs font-black text-[#ffe600] yellow-glow truncate">{isConnected ? "0.0149 ETH" : "0.0000"}</p>
          </div>
          <div className="bg-[#070510] p-2.5 rounded-2xl border border-white/10 text-center">
            <p className="text-[8px] text-gray-400 font-bold uppercase mb-0.5">PROFIT / HR</p>
            <p className="text-xs font-black text-[#00e5ff] truncate">+{profitPerHour / 1000}K</p>
          </div>
        </div>

        {/* 3. Web3 On-Chain Transaction History Ledger with EXPLICIT DEMO TESTNET BADGE */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-black text-[#00ff7b] uppercase flex items-center space-x-1.5 neon-green-glow">
              <span>📜</span> <span>ON-CHAIN TRANSACTIONS LOG</span>
            </p>
            <span className="text-[9px] font-black text-[#ffe600] bg-[#ffe600]/10 px-2 py-0.5 rounded-full border border-[#ffe600]/30 animate-pulse">
              DEMO TESTNET
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-[#070510] p-2.5 rounded-xl border border-white/5 hover:border-[#00ff7b]/30 transition-all flex justify-between items-center"
              >
                <div className="space-y-0.5 min-w-0 pr-2">
                  <p className="text-xs font-bold text-white truncate">{tx.title}</p>
                  <p className="text-[9px] font-mono text-gray-400">
                    Tx: <span className="text-gray-300">{tx.txHash}</span> • {tx.time}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-xs font-black block ${tx.color}`}>{tx.amount}</span>
                  <span className="text-[8px] font-black text-[#ffe600] bg-[#ffe600]/10 px-1.5 py-0.5 rounded border border-[#ffe600]/20">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[9px] text-gray-500 italic mt-1.5 text-center">
            * Note: Transaction logs above are simulated Web3 On-Chain Demo Logs on Robinhood Testnet.
          </p>
        </div>

        {/* 4. 📖 DETAILED PROTOCOL GUIDE */}
        <div className="bg-[#070510]/90 p-3.5 rounded-2xl border border-[#00e5ff]/30 mb-4 space-y-1.5 text-xs">
          <p className="font-black text-[#00e5ff] uppercase flex items-center space-x-1.5 text-[11px]">
            <span>📖</span> <span>DETAILED PROFILE & TRANSACTIONS GUIDE</span>
          </p>
          <ul className="text-gray-300 space-y-1 text-[10px] sm:text-[11px] list-disc list-inside">
            <li>Your identity is protected by end-to-end cryptography on the <strong>Robinhood EVM Chain</strong>.</li>
            <li>All tap mining gains, streak bonuses, and cipher rewards generate verifiable <strong>On-Chain Ledger Logs (Demo)</strong>.</li>
            <li>Click <strong>COPY</strong> to share your wallet address with teammates.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleCopyWallet}
            className="py-3 rounded-2xl bg-[#00ff7b]/20 hover:bg-[#00ff7b] hover:text-black border border-[#00ff7b]/40 text-[#00ff7b] font-black text-xs uppercase tracking-wider transition-all"
          >
            Copy Address
          </button>
          <button
            onClick={onClose}
            className="py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-xs uppercase tracking-wider transition-all"
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserProfileModal;
