import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { hatchedEgg } from "../../images";

interface MintNftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessMint: (bonusPoints: number) => void;
  username?: string;
}

const MintNftModal: React.FC<MintNftModalProps> = ({
  isOpen,
  onClose,
  onSuccessMint,
  username,
}) => {
  const [isMinting, setIsMinting] = useState(false);
  const [isMinted, setIsMinted] = useState(false);
  const [tokenId, setTokenId] = useState<number | null>(null);

  const storageKey = username ? `eggrush_nft_minted_${username}` : "eggrush_nft_minted_default";

  useEffect(() => {
    if (isOpen) {
      const savedMinted = localStorage.getItem(storageKey);
      if (savedMinted) {
        setIsMinted(true);
        setTokenId(parseInt(savedMinted, 10) || 7843);
      }
    }
  }, [isOpen, storageKey]);

  if (!isOpen) return null;

  const handleMintNft = () => {
    if (isMinted) {
      toast.info("You have already claimed your Free Genesis Demo NFT!");
      return;
    }

    setIsMinting(true);
    toast.info("⚡ Initiating Free NFT Minting Demo on Robinhood EVM Testnet...");

    setTimeout(() => {
      const mintedTokenId = Math.floor(7000 + Math.random() * 2500);
      setTokenId(mintedTokenId);
      setIsMinted(true);
      setIsMinting(false);
      localStorage.setItem(storageKey, mintedTokenId.toString());

      // Award +10,000 EGG Bonus Points
      onSuccessMint(10000);
      toast.success(`🎉 Congratulations! Demo Genesis NFT Token #${mintedTokenId} Minted (+10,000 EGG Bonus)!`);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in font-orbitron">
      <div className="w-full max-w-md bg-[#0a0f1d] border border-[#ffe600]/40 rounded-[28px] p-5 text-[#f0eeff] shadow-[0_0_60px_rgba(255,230,0,0.3)] relative max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl animate-bounce">💎</span>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight yellow-glow leading-none">
                  EggRush Free NFT Mint
                </h3>
                <span className="text-[8px] font-black bg-[#ffe600]/20 text-[#ffe600] px-1.5 py-0.5 rounded border border-[#ffe600]/40">
                  DEMO
                </span>
              </div>
              <span className="text-[9px] text-[#00ff7b] font-black tracking-widest uppercase">
                ROBINHOOD EVM TESTNET DEMO
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#ffe600]/20 transition-all shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Demo Mode Notice Box */}
        <div className="bg-[#ffe600]/10 border border-[#ffe600]/30 rounded-2xl p-2.5 mb-3 flex items-center space-x-2 text-[10px]">
          <span className="text-base shrink-0">🧪</span>
          <p className="text-gray-300 font-medium leading-snug">
            <strong className="text-[#ffe600]">TESTNET DEMO MODE:</strong> Free NFT minting demonstration. Minted Genesis Passes grant instant testnet perks & rewards!
          </p>
        </div>

        {/* NFT Hologram Showcase Card */}
        <div className="bg-gradient-to-b from-[#141d33] to-[#070510] p-4 rounded-3xl border border-[#ffe600]/30 mb-4 text-center relative overflow-hidden group shadow-[0_0_30px_rgba(255,230,0,0.15)]">
          <div className="absolute top-2 left-2 bg-[#00ff7b] text-black text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-[0_0_8px_#00ff7b]">
            TESTNET DEMO
          </div>
          <div className="absolute top-2 right-2 bg-[#ffe600] text-black text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-[0_0_10px_#ffe600]">
            LEGENDARY 0.01%
          </div>

          <div className="my-2 relative pt-2">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-tr from-[#ffe600]/20 via-[#00ff7b]/20 to-transparent flex items-center justify-center p-2 shadow-[0_0_40px_rgba(255,230,0,0.3)] group-hover:scale-105 transition-transform duration-500">
              <img
                src={hatchedEgg}
                alt="Cyber Genesis NFT Demo"
                className="w-28 h-28 object-contain drop-shadow-[0_10px_25px_rgba(255,230,0,0.5)] animate-pulse"
              />
            </div>
          </div>

          <h4 className="text-base font-black text-white uppercase tracking-wider mt-2">
            EggRush Cyber Genesis Pass
          </h4>
          <p className="text-[10px] text-[#00e5ff] font-mono font-bold mt-0.5">
            {isMinted ? `Demo Token ID #${tokenId}` : "Limited Demo Edition • 10,000 Supply"}
          </p>

          {/* Mint Progress Bar */}
          <div className="mt-3 bg-[#060a12] p-2 rounded-xl border border-white/10 space-y-1">
            <div className="flex justify-between text-[9px] font-bold text-gray-300">
              <span>DEMO MINTED SUPPLY</span>
              <span className="text-[#00ff7b] font-mono">7,842 / 10,000 (78.4%)</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-[#ffe600] to-[#00ff7b] h-full rounded-full transition-all duration-500"
                style={{ width: "78.4%" }}
              ></div>
            </div>
          </div>
        </div>

        {/* NFT Holder Perks */}
        <div className="space-y-2 mb-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
            ⚡ DEMO NFT HOLDER PERKS:
          </p>
          <div className="grid grid-cols-2 gap-2 text-left">
            <div className="bg-[#070510] p-2.5 rounded-xl border border-[#00ff7b]/30 space-y-0.5">
              <p className="text-[#00ff7b] font-black text-[11px] flex items-center space-x-1">
                <span>🔥</span> <span>+50% Tap Earn</span>
              </p>
              <p className="text-[9px] text-gray-400">Permanent tap multiplier boost.</p>
            </div>
            <div className="bg-[#070510] p-2.5 rounded-xl border border-[#00e5ff]/30 space-y-0.5">
              <p className="text-[#00e5ff] font-black text-[11px] flex items-center space-x-1">
                <span>🔋</span> <span>+2,000 Energy</span>
              </p>
              <p className="text-[9px] text-gray-400">Increased daily energy capacity.</p>
            </div>
          </div>
          <div className="bg-[#070510] p-2.5 rounded-xl border border-[#ffe600]/30 flex justify-between items-center">
            <div className="space-y-0.5">
              <p className="text-[#ffe600] font-black text-[11px] flex items-center space-x-1">
                <span>🎁</span> <span>Instant Demo Bonus</span>
              </p>
              <p className="text-[9px] text-gray-400">Awarded immediately upon demo minting.</p>
            </div>
            <span className="text-xs font-mono font-black text-[#00ff7b] bg-[#00ff7b]/10 px-2 py-1 rounded-lg border border-[#00ff7b]/30">
              +10,000 EGG
            </span>
          </div>
        </div>

        {/* 📖 DETAILED NFT PROTOCOL GUIDE */}
        <div className="bg-[#070510]/90 p-3 rounded-2xl border border-white/10 mb-4 space-y-1 text-xs">
          <p className="font-black text-[#00e5ff] uppercase flex items-center space-x-1.5 text-[10px]">
            <span>📖</span> <span>DEMO NFT MINTING PROTOCOL GUIDE</span>
          </p>
          <ul className="text-gray-300 space-y-0.5 text-[10px] list-disc list-inside">
            <li>Gas fees are <strong>100% Free & Sponsored</strong> on Testnet Demo.</li>
            <li>Limited to 1 Genesis Pass Demo NFT per account.</li>
          </ul>
        </div>

        {/* Mint Action Button */}
        {isMinted ? (
          <div className="space-y-2">
            <div className="w-full py-3.5 rounded-2xl bg-[#00ff7b]/20 border border-[#00ff7b]/50 text-[#00ff7b] font-black text-xs uppercase tracking-wider text-center flex items-center justify-center space-x-1.5 shadow-[0_0_20px_rgba(0,255,123,0.3)]">
              <span>✓</span>
              <span>DEMO NFT MINTED & CLAIMED (Token #{tokenId})</span>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-xs uppercase tracking-wider transition-all"
            >
              Close Demo Mint
            </button>
          </div>
        ) : (
          <button
            onClick={handleMintNft}
            disabled={isMinting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#ffe600] via-[#00ff7b] to-[#00e5ff] text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(255,230,0,0.5)] hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
          >
            {isMinting ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                <span>Minting Demo NFT...</span>
              </>
            ) : (
              <>
                <span>⚡</span>
                <span>FREE MINT DEMO NFT NOW (0.000 ETH)</span>
              </>
            )}
          </button>
        )}

      </div>
    </div>
  );
};

export default MintNftModal;
