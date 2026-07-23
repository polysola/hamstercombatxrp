import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  logo,
  hammer,
  egg,
  hatchedEgg,
  bg,
  robinhood,
} from "./images";
import Info from "./icons/Info";
import Settings from "./icons/Settings";
import Friends from "./icons/Friends";
import RankingIcon from "./icons/RankingIcon";
import Hamster from "./icons/Hamster";
import Swap from "./icons/Swap";
import ETHIcon from "./icons/ETHIcon";
import XIcon from "./icons/XIcon";
import TelegramIcon from "./icons/TelegramIcon";
import HeroReactorRing from "./components/HeroReactorRing";
import {
  saveUserScore,
  getUserScore,
  getLeaderboard,
  setReferrer,
} from "./services/userService";
import Leaderboard from "./components/Leaderboard";
import Referral from "./components/Referral";
import { useReferral } from "./hooks/useReferral";

// Modals Import
import WalletModal from "./components/modals/WalletModal";
import SettingsModal from "./components/modals/SettingsModal";
import DailyRewardModal from "./components/modals/DailyRewardModal";
import DailyCipherModal from "./components/modals/DailyCipherModal";
import DailyComboModal from "./components/modals/DailyComboModal";
import BoostModal from "./components/modals/BoostModal";
import AutoBotModal from "./components/modals/AutoBotModal";
import UserProfileModal from "./components/modals/UserProfileModal";

// TypeScript Definitions
interface LeaderboardUser {
  username: string;
  score: number;
  photoUrl?: string;
}

interface ClickEffect {
  id: number;
  x: number;
  y: number;
  amount: number;
}

interface CrackEffect {
  id: string;
  x: number;
  y: number;
  angle: number;
  length: number;
  type: "main" | "branch";
}

interface SparkleEffect {
  id: number;
  x: number;
  y: number;
  angle: number;
}

interface HammerAnimation {
  id: number;
  x: number;
  y: number;
}

type ModalType = "wallet" | "settings" | "reward" | "cipher" | "combo" | "boost" | "autobot" | "profile" | null;

const App: React.FC = () => {
  const levelNames = [
    "Bronze", "Silver", "Gold", "Platinum", "Diamond",
    "Epic", "Legendary", "Master", "GrandMaster", "Lord"
  ];

  const levelMinPoints = useMemo(
    () => [0, 5000, 25000, 100000, 1000000, 2000000, 10000000, 50000000, 100000000, 1000000000],
    []
  );

  const [points, setPoints] = useState(1380);
  const [clicks, setClicks] = useState<ClickEffect[]>([]);
  const [lastTapEarned, setLastTapEarned] = useState<number>(2);
  const profitPerHour = 1200;

  // Energy & Boost System
  const [energy, setEnergy] = useState(1000);
  const maxEnergy = 1000;
  const [isBoostActive, setIsBoostActive] = useState(false);
  const [boostTimeLeft, setBoostTimeLeft] = useState(0);
  const [botEarnings, setBotEarnings] = useState(0);

  // Dynamic EVM Wallet State
  const [walletAddress, setWalletAddress] = useState<string>("");

  // Active Modal State
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const [dailyRewardTimeLeft, setDailyRewardTimeLeft] = useState("16:29:18");
  const [dailyCipherTimeLeft, setDailyCipherTimeLeft] = useState("01:29:18");
  const [dailyComboTimeLeft, setDailyComboTimeLeft] = useState("04:29:18");

  const [user, setUser] = useState<{
    username: string;
    photoUrl: string;
  } | null>(null);

  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [activeTab, setActiveTab] = useState<"main" | "leaderboard" | "referral">("main");

  const {
    referrals,
    isLoading: isReferralLoading,
    refetch: refetchReferrals,
  } = useReferral(user?.username);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(false);

  const [eggHealth, setEggHealth] = useState(92.7);
  const [eggClicks, setEggClicks] = useState(0);
  const [isHatching, setIsHatching] = useState(false);
  const [crackEffects, setCrackEffects] = useState<CrackEffect[]>([]);
  const [sparkles, setSparkles] = useState<SparkleEffect[]>([]);
  const [hammerAnimations, setHammerAnimations] = useState<HammerAnimation[]>([]);
  const [isShaking, setIsShaking] = useState(false);

  const levelIndex = useMemo(() => {
    for (let i = levelMinPoints.length - 1; i >= 0; i--) {
      if (points >= levelMinPoints[i]) return i;
    }
    return 0;
  }, [points, levelMinPoints]);

  const [bonusPoints, setBonusPoints] = useState<{
    amount: number;
    visible: boolean;
    x: number;
    y: number;
  } | null>(null);

  const CLICKS_TO_HATCH = 15;
  const HATCH_BONUS = 100;

  // Exact Database Persistence Helper
  const persistScoreToDatabase = useCallback(async (newPoints: number) => {
    if (user?.username) {
      await saveUserScore(user.username, newPoints, levelMinPoints[levelIndex]);
    }
  }, [user?.username, levelIndex, levelMinPoints]);

  useEffect(() => {
    if (user?.username) {
      refetchReferrals();
      fetchLeaderboard();

      // Load saved Wallet Address for active user
      const savedWallet = localStorage.getItem(`wallet_address_${user.username}`);
      if (savedWallet) {
        setWalletAddress(savedWallet);
      }
    }
  }, [user?.username]);

  const handleConnectWalletAddress = (addr: string) => {
    setWalletAddress(addr);
    if (user?.username) {
      localStorage.setItem(`wallet_address_${user.username}`, addr);
    }
  };

  const handleDisconnectWalletAddress = () => {
    setWalletAddress("");
    if (user?.username) {
      localStorage.removeItem(`wallet_address_${user.username}`);
    }
  };

  const fetchLeaderboard = async () => {
    if (!user?.username) return;
    setIsLeaderboardLoading(true);
    try {
      const data = await getLeaderboard(10);
      setLeaderboard(data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setIsLeaderboardLoading(false);
    }
  };

  const handleTabChange = (tab: "main" | "leaderboard" | "referral") => {
    setActiveTab(tab);
    if (tab === "leaderboard") {
      fetchLeaderboard();
    } else if (tab === "referral") {
      refetchReferrals();
    }
  };

  const handleSwapClick = () => {
    toast.info("🔄 EggRush ETH Swap Protocol coming soon in V2!");
  };

  // Energy Restoration Timer - Exact +3 Energy per second
  useEffect(() => {
    const energyTimer = setInterval(() => {
      setEnergy((prev) => Math.min(maxEnergy, prev + 3));
    }, 1000);

    return () => clearInterval(energyTimer);
  }, []);

  // Turbo Boost Timer
  useEffect(() => {
    if (!isBoostActive) return;
    const timer = setInterval(() => {
      setBoostTimeLeft((prev) => {
        if (prev <= 1) {
          setIsBoostActive(false);
          toast.info("Turbo Boost 2x Multiplier expired.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isBoostActive]);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        const tg = (window as any).Telegram?.WebApp;

        let activeUsername = "Guest_89LPR";
        let activePhotoUrl = robinhood;

        if (tg && tg.initDataUnsafe?.user) {
          tg.expand();
          activeUsername = tg.initDataUnsafe.user.username || "Guest_89LPR";
          activePhotoUrl = tg.initDataUnsafe.user.photo_url || robinhood;

          const startapp = tg.initDataUnsafe.start_param;
          if (startapp) {
            await setReferrer(activeUsername, startapp);
          }
        } else {
          let guestName = localStorage.getItem("guest_name");
          if (!guestName) {
            guestName = "Guest_89LPR";
            localStorage.setItem("guest_name", guestName);
          }
          activeUsername = guestName;
        }

        setUser({ username: activeUsername, photoUrl: activePhotoUrl });

        // Load Firestore User Score & Real-time Offline Mining Profit
        try {
          const savedScore = await getUserScore(activeUsername);
          if (savedScore) {
            setPoints(savedScore.score);
            if (savedScore.lastUpdated) {
              const lastSaveTime = new Date(savedScore.lastUpdated).getTime();
              const nowTime = new Date().getTime();
              const elapsedSeconds = Math.max(0, (nowTime - lastSaveTime) / 1000);
              const offlineSecs = Math.min(10800, elapsedSeconds);
              if (offlineSecs > 10) {
                const offlineCoins = Math.floor(offlineSecs * (profitPerHour / 3600));
                setBotEarnings(offlineCoins);
                toast.info(`🤖 Auto Bot mined +${offlineCoins.toLocaleString()} ETH coins while you were offline!`);
              }
            }
          } else {
            setPoints(1380);
            await saveUserScore(activeUsername, 1380, levelMinPoints[0]);
          }
        } catch (error) {
          setPoints(1380);
        }
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeApp();
  }, []);

  // Passive Earnings Accumulation (+0.33 points per second) and Auto-Save every 30s
  useEffect(() => {
    if (!user?.username || isLoading) return;

    const profitInterval = setInterval(() => {
      setPoints((prev) => prev + profitPerHour / 3600);
    }, 1000);

    const autoSaveInterval = setInterval(async () => {
      if (user?.username) {
        await saveUserScore(user.username, points, levelMinPoints[levelIndex]);
      }
    }, 30000);

    return () => {
      clearInterval(profitInterval);
      clearInterval(autoSaveInterval);
    };
  }, [user?.username, isLoading, profitPerHour, points, levelIndex, levelMinPoints]);

  const calculateTimeLeft = (targetHour: number) => {
    const now = new Date();
    const target = new Date(now);
    target.setUTCHours(targetHour, 0, 0, 0);
    if (now.getUTCHours() >= targetHour) target.setUTCDate(target.getUTCDate() + 1);
    const diff = target.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const updateCountdowns = () => {
      setDailyRewardTimeLeft(calculateTimeLeft(0));
      setDailyCipherTimeLeft(calculateTimeLeft(19));
      setDailyComboTimeLeft(calculateTimeLeft(12));
    };
    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, []);

  // EXACT Point Scoring Handler - Anti-Inflation Formula!
  const handleCardClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (energy <= 0) {
      toast.warning("⚡ Energy depleted! Use Full Energy Refill or wait a moment.");
      return;
    }

    setEnergy((prev) => Math.max(0, prev - 1));

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 100);

    const hammerId = Date.now();
    setHammerAnimations(prev => [...prev, { id: hammerId, x, y }]);
    setTimeout(() => {
      setHammerAnimations(prev => prev.filter(h => h.id !== hammerId));
    }, 600);

    // Balanced Anti-Inflation Level-based Tap Formula (Bronze: +2, Silver: +4, Gold: +6...)
    const baseEarnPerTap = (levelIndex + 1) * 2;
    const multiplier = isBoostActive ? 2 : 1;
    const pointsToAdd = baseEarnPerTap * multiplier;
    setLastTapEarned(pointsToAdd);

    const newCracks: CrackEffect[] = [];
    const timestamp = Date.now();
    for (let i = 0; i < 2; i++) {
      newCracks.push({
        id: `crack-${timestamp}-${i}`,
        x, y, angle: Math.random() * 360, length: 30 + Math.random() * 20, type: "main"
      });
    }

    setCrackEffects((prev) => [...prev.slice(-20), ...newCracks]);
    setEggHealth((prev) => Math.max(0, prev - (100 / CLICKS_TO_HATCH)));
    setEggClicks((prev) => prev + 1);

    const clickId = Date.now();
    setClicks((prev) => [...prev, { id: clickId, x: e.clientX, y: e.clientY, amount: pointsToAdd }]);
    setTimeout(() => {
      setClicks((prev) => prev.filter((c) => c.id !== clickId));
    }, 1000);

    if (eggClicks + 1 >= CLICKS_TO_HATCH) {
      setIsHatching(true);
      const newSparkles = Array.from({ length: 15 }, (_, i) => ({
        id: Date.now() + i,
        x: rect.width / 2,
        y: rect.height / 2,
        angle: (Math.PI * 2 * i) / 15,
      }));
      setSparkles(newSparkles);
      setBonusPoints({ amount: HATCH_BONUS, visible: true, x: rect.width / 2, y: rect.height / 2 });

      setTimeout(() => {
        setEggHealth(92.7);
        setEggClicks(0);
        setIsHatching(false);
        setCrackEffects([]);
        setSparkles([]);
        setBonusPoints(null);
      }, 1500);
    }

    const newPoints = points + pointsToAdd + (isHatching ? HATCH_BONUS : 0);
    setPoints(newPoints);

    // Debounced Firestore Save (500ms)
    if (saveTimeout) clearTimeout(saveTimeout);
    const timeout = setTimeout(() => {
      persistScoreToDatabase(newPoints);
    }, 500);
    setSaveTimeout(timeout);
  };

  const formatProfitPerHour = (profit: number) => {
    if (profit >= 1000000000) return `+${(Math.floor(profit / 10000000) / 100).toFixed(2)}B`;
    if (profit >= 1000000) return `+${(Math.floor(profit / 10000) / 100).toFixed(2)}M`;
    if (profit >= 1000) return `+${(Math.floor(profit / 10) / 100).toFixed(2)}K`;
    return `+${profit}`;
  };

  // Helper for immediate Modal Claim Database Persistence
  const handleModalClaim = (rewardAmount: number) => {
    const updatedPoints = points + rewardAmount;
    setPoints(updatedPoints);
    persistScoreToDatabase(updatedPoints);
  };

  const isWalletConnected = Boolean(walletAddress);
  const truncatedWallet = isWalletConnected
    ? `${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}`
    : "";

  // Guaranteed crisp Avatar image
  const avatarSrc = user?.photoUrl && user.photoUrl !== logo ? user.photoUrl : robinhood;

  const renderHeader = () => (
    <div className="space-y-3 z-10">
      {/* Top Section: Avatar + Name + Wallet + X + Telegram + Settings + Profit Card */}
      <div className="flex items-start justify-between gap-1 overflow-hidden">
        {/* Left Side: Avatar, Name, Badge, XP Bar WITH CLICKABLE AVATAR FOR USER PROFILE MODAL */}
        <div className="flex items-center space-x-2 shrink-0">
          <div
            onClick={() => setActiveModal("profile")}
            className="relative shrink-0 cursor-pointer group transition-transform hover:scale-105"
            title="Click to view Web3 Profile & Transaction History"
          >
            <div className="p-0.5 rounded-full bg-gradient-to-r from-[#00ff7b] to-[#00e5ff] shadow-[0_0_12px_rgba(0,255,123,0.6)] group-hover:shadow-[0_0_20px_#00ff7b]">
              <img src={avatarSrc} alt="Avatar" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#060a12] object-contain bg-[#00ff7b]/10 p-0.5" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00ff7b] border-2 border-[#060a12]"></div>
          </div>
          <div className="shrink-0 cursor-pointer" onClick={() => setActiveModal("profile")}>
            <div className="flex items-center space-x-1">
              <p className="text-xs sm:text-sm font-black text-white tracking-tight truncate max-w-[85px] sm:max-w-[120px]">{user?.username || "Guest_89LPR"}</p>
            </div>
            <div className="flex items-center space-x-1 mt-0.5">
              <span className="text-[10px]">🛡️</span>
              <span className="text-[9px] sm:text-[10px] font-black text-[#ff8800] uppercase tracking-wider">{levelNames[levelIndex]}</span>
            </div>
            {/* Level XP Bar */}
            <div className="w-28 sm:w-36 mt-1">
              <div className="flex justify-between items-center text-[8px] font-bold mb-0.5">
                <span className="text-[#00ff7b] font-black">Lv {levelIndex + 1}</span>
              </div>
              <div className="h-1.5 w-full bg-[#060a12] rounded-full overflow-hidden p-[1px] border border-[#00ff7b]/30">
                <div
                  className="h-full bg-gradient-to-r from-[#00ff7b] via-[#31ff00] to-[#00e5ff] rounded-full"
                  style={{
                    width: `${
                      levelIndex >= levelNames.length - 1
                        ? 100
                        : Math.min(
                            ((points - levelMinPoints[levelIndex]) /
                              (levelMinPoints[levelIndex + 1] - levelMinPoints[levelIndex])) *
                              100,
                            100
                          )
                    }%`,
                  }}
                ></div>
              </div>
              <div className="text-[7px] sm:text-[8px] font-bold text-gray-400 text-right mt-0.5">
                {Math.floor(points).toLocaleString()} / {levelMinPoints[levelIndex + 1] ? levelMinPoints[levelIndex + 1].toLocaleString() : "1000"} XP
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Dynamic Wallet Button, X, Telegram, Settings, Profit/Hour */}
        <div className="flex flex-col items-end space-y-1.5 shrink-0 ml-1">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setActiveModal("wallet")}
              className={`flex items-center space-x-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#0a1424] border transition-all text-[10px] sm:text-xs text-white font-bold shrink-0 ${
                isWalletConnected
                  ? "border-[#00ff7b] shadow-[0_0_12px_rgba(0,255,123,0.3)]"
                  : "border-[#00e5ff]/40 hover:border-[#00e5ff] shadow-[0_0_12px_rgba(0,229,255,0.2)]"
              }`}
            >
              {isWalletConnected ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff7b] animate-ping"></span>
                  <span className="font-mono text-[#00ff7b] text-[10px] sm:text-[11px]">{truncatedWallet}</span>
                </>
              ) : (
                <>
                  <span>💳</span>
                  <span>Connect</span>
                </>
              )}
              <span className="text-gray-400 text-[9px]">›</span>
            </button>

            {/* X / Twitter Social Button */}
            <button
              onClick={() => window.open("https://x.com/EggRushRH", "_blank")}
              className="p-1 sm:p-1.5 rounded-xl bg-[#0a1424] hover:bg-[#00ff7b]/20 hover:scale-105 transition-all border border-[#00ff7b]/40 text-[#00ff7b] shadow-[0_0_10px_rgba(0,255,123,0.2)] shrink-0"
              title="Follow EggRush on X"
            >
              <XIcon size={14} />
            </button>

            {/* Telegram Social Button */}
            <button
              onClick={() => window.open("https://t.me/EggRush_RobinHood", "_blank")}
              className="p-1 sm:p-1.5 rounded-xl bg-[#0a1424] hover:bg-[#00e5ff]/20 hover:scale-105 transition-all border border-[#00e5ff]/40 text-[#00e5ff] shadow-[0_0_10px_rgba(0,229,255,0.2)] shrink-0"
              title="Join Telegram Community"
            >
              <TelegramIcon size={14} />
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setActiveModal("settings")}
              className="p-1 sm:p-1.5 rounded-xl bg-[#0a1424] hover:bg-[#00ff7b]/15 transition-all border border-[#00ff7b]/30 shrink-0"
            >
              <Settings size={14} className="text-[#00ff7b]" />
            </button>
          </div>

          {/* Profit Card */}
          <div onClick={() => setActiveModal("autobot")} className="bg-[#0a1424] p-1.5 sm:p-2 rounded-xl border border-white/10 flex items-center space-x-1.5 cursor-pointer hover:border-[#00ff7b]/50 transition-all shrink-0">
            <img src={robinhood} alt="Robinhood" className="w-5 h-5 sm:w-6 sm:h-6 object-contain rounded-lg border border-[#ffe600]/40 p-0.5 bg-[#ffe600]/10" />
            <div className="text-right">
              <p className="text-[6px] sm:text-[7px] text-gray-400 font-bold uppercase tracking-wider">PROFIT / HOUR</p>
              <p className="text-[10px] sm:text-xs font-black text-[#ffe600] yellow-glow">{formatProfitPerHour(profitPerHour)} <Info size={8} className="inline text-gray-400" /></p>
            </div>
          </div>
        </div>
      </div>

      {/* FULL WIDTH ETH BALANCE CARD (MATCHING MOCKUP) */}
      <div className="bg-[#071320]/90 backdrop-blur-md p-3.5 rounded-2xl border border-[#00e5ff]/40 shadow-[0_0_25px_rgba(0,229,255,0.15)] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#00e5ff]/20 border border-[#00e5ff] flex items-center justify-center shadow-[0_0_12px_#00e5ff]">
            <ETHIcon size={22} />
          </div>
          <div>
            <p className="text-[9px] text-[#00e5ff] uppercase tracking-widest font-black">ETH BALANCE</p>
            <p className="text-2xl font-black text-white tracking-tight">{Math.floor(points).toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-[#00ff7b]/10 border border-[#00ff7b]/40 text-[#00ff7b] text-[10px] font-black px-2.5 py-1 rounded-xl shadow-[0_0_10px_rgba(0,255,123,0.2)]">
          +{lastTapEarned} <span className="text-[8px] text-gray-400 block font-normal">Last tap</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex justify-center h-screen max-h-screen relative overflow-hidden bg-[#060a12] font-orbitron">
      {/* Background Image Layer */}
      <div className="app-bg-container" style={{ backgroundImage: `url(${bg})` }}></div>
      <div className="aurora-1"></div>
      <div className="aurora-2"></div>

      <ToastContainer theme="dark" position="top-center" />

      {/* Interactive Modals System */}
      <UserProfileModal
        isOpen={activeModal === "profile"}
        onClose={() => setActiveModal(null)}
        user={user}
        userPoints={points}
        walletAddress={walletAddress}
        levelName={levelNames[levelIndex]}
        levelIndex={levelIndex}
        profitPerHour={profitPerHour}
      />
      <WalletModal
        isOpen={activeModal === "wallet"}
        onClose={() => setActiveModal(null)}
        userPoints={points}
        walletAddress={walletAddress}
        onConnectWallet={handleConnectWalletAddress}
        onDisconnectWallet={handleDisconnectWalletAddress}
      />
      <SettingsModal isOpen={activeModal === "settings"} onClose={() => setActiveModal(null)} />
      <DailyRewardModal
        isOpen={activeModal === "reward"}
        onClose={() => setActiveModal(null)}
        onClaim={handleModalClaim}
        username={user?.username}
      />
      <DailyCipherModal
        isOpen={activeModal === "cipher"}
        onClose={() => setActiveModal(null)}
        onSuccess={handleModalClaim}
        username={user?.username}
      />
      <DailyComboModal
        isOpen={activeModal === "combo"}
        onClose={() => setActiveModal(null)}
        onSuccess={handleModalClaim}
        username={user?.username}
      />
      <BoostModal
        isOpen={activeModal === "boost"}
        onClose={() => setActiveModal(null)}
        onFullEnergy={() => setEnergy(maxEnergy)}
        onTurboBoost={() => {
          setIsBoostActive(true);
          setBoostTimeLeft(30);
        }}
        username={user?.username}
      />
      <AutoBotModal
        isOpen={activeModal === "autobot"}
        onClose={() => setActiveModal(null)}
        botEarnings={botEarnings}
        onCollect={() => {
          handleModalClaim(botEarnings);
          setBotEarnings(0);
        }}
      />

      {isLoading ? (
        <div className="w-full h-screen flex items-center justify-center text-[#f0eeff] z-50 bg-[#060a12]">
          <div className="w-12 h-12 border-4 border-[#00ff7b]/20 border-t-[#00ff7b] rounded-full animate-spin shadow-[0_0_20px_#00ff7b]"></div>
        </div>
      ) : (
        <div className="w-full text-[#f0eeff] h-screen max-h-screen font-bold flex flex-col justify-between max-w-md mx-auto relative z-10 overflow-hidden p-3 pb-24">
          {activeTab === "main" ? (
            <div className="flex-1 flex flex-col justify-between overflow-y-auto space-y-3">
              
              {/* TẦNG 1: TOP HUD & ETH BALANCE CARD */}
              {renderHeader()}

              {/* TẦNG 2: CENTRAL HERO EGG STAGE WITH SVG VECTOR HUD REACTOR RING */}
              <div className="flex-1 flex flex-col items-center justify-center relative my-auto py-1">
                
                <HeroReactorRing eggHealth={eggHealth}>
                  {/* HERO CHARACTER - LARGER EGG FOR BETTER IMPACT */}
                  <div className="egg-container" style={{ cursor: `url(${hammer}) 16 16, pointer` }}>
                    <div className={`w-60 h-60 sm:w-72 sm:h-72 p-3 rounded-full flex items-center justify-center relative overflow-hidden group shadow-[0_0_90px_rgba(0,255,123,0.5)] ${isShaking ? "animate-egg-shake" : ""}`} onClick={handleCardClick}>
                      <img src={isHatching ? hatchedEgg : egg} alt="Egg" className="w-[98%] h-[98%] object-contain drop-shadow-[0_15px_45px_rgba(0,255,123,0.65)] transition-transform duration-500 group-hover:scale-105" />

                      {/* Impact Ripples */}
                      {hammerAnimations.map(h => (
                        <div key={`ripple-${h.id}`} className="absolute impact-ripple" style={{ left: h.x, top: h.y }}></div>
                      ))}

                      {/* Hammer Visual */}
                      {hammerAnimations.map(h => (
                        <img
                          key={`hammer-${h.id}`}
                          src={hammer}
                          alt="Hammer"
                          className="absolute w-12 h-12 pointer-events-none z-50 animate-hammer-strike"
                          style={{ left: h.x - 24, top: h.y - 36 }}
                        />
                      ))}
                    </div>

                    {crackEffects.map((crack) => (
                      <div key={crack.id} className="crack-line" style={{ left: `${crack.x}px`, top: `${crack.y}px`, transform: `rotate(${crack.angle}deg)`, "--crack-length": `${crack.length}px`, opacity: 0.8 } as React.CSSProperties} />
                    ))}
                    {sparkles.map((sparkle) => (
                      <div key={sparkle.id} className="sparkle" style={{ "--tx": `${Math.cos(sparkle.angle) * 120}px`, "--ty": `${Math.sin(sparkle.angle) * 120}px`, left: `${sparkle.x}px`, top: `${sparkle.y}px` } as React.CSSProperties} />
                    ))}
                    {bonusPoints && bonusPoints.visible && (
                      <div className="bonus-points" style={{ left: `${bonusPoints.x}px`, top: `${bonusPoints.y}px` }}>+{bonusPoints.amount}</div>
                    )}
                  </div>
                </HeroReactorRing>

                {/* TAP CORE TEXT & ETH MINING SUBTITLE */}
                <div className="z-20 text-center mt-1">
                  <p className="text-base font-black text-[#00ff7b] tracking-wider uppercase neon-green-glow leading-none">TAP CORE</p>
                  <p className="text-[10px] text-gray-400 font-bold mt-0.5">Tap to mine EggRush</p>
                </div>

              </div>

              {/* TẦNG 3: CONTROL BUTTONS ROW (BOOST - ENERGY - AUTO BOT) */}
              <div className="grid grid-cols-3 gap-2">
                {/* BOOST CARD */}
                <div
                  onClick={() => setActiveModal("boost")}
                  className="bg-[#0a1424] hover:bg-[#00ff7b]/10 p-2.5 rounded-2xl border border-[#ffe600]/40 cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">⚡</span>
                    <span className="text-xs font-black text-[#ffe600]">BOOST</span>
                    <span className="text-[10px] text-gray-400">›</span>
                  </div>
                  <p className="text-[9px] text-gray-400 font-bold mt-1">Turbo x2</p>
                  <div className="bg-[#ffe600]/10 border border-[#ffe600]/30 text-[#ffe600] text-[9px] font-black px-2 py-0.5 rounded-lg mt-1 text-center">
                    ⏱ {isBoostActive ? `${boostTimeLeft}s` : "23:45"}
                  </div>
                </div>

                {/* ENERGY CARD WITH SEGMENTED BLOCKS */}
                <div className="bg-[#0a1424] p-2.5 rounded-2xl border border-[#00e5ff]/40 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-base">🔋</span>
                    <span className="text-xs font-black text-[#00e5ff]">ENERGY</span>
                    <span className="text-[10px] text-gray-400">›</span>
                  </div>
                  <p className="text-[9px] font-bold text-white mt-1">{energy} / {maxEnergy}</p>
                  {/* Energy Segmented Cyan Blocks */}
                  <div className="flex space-x-1 mt-1">
                    {Array.from({ length: 8 }).map((_, i) => {
                      const isActive = i < Math.ceil((energy / maxEnergy) * 8);
                      return (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-sm transition-all ${
                            isActive
                              ? "bg-[#00e5ff] shadow-[0_0_6px_#00e5ff]"
                              : "bg-[#060a12] border border-[#00e5ff]/20"
                          }`}
                        ></div>
                      );
                    })}
                  </div>
                </div>

                {/* AUTO BOT CARD */}
                <div
                  onClick={() => setActiveModal("autobot")}
                  className="bg-[#0a1424] hover:bg-[#00e5ff]/10 p-2.5 rounded-2xl border border-[#ab00ff]/40 cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">🤖</span>
                    <span className="text-xs font-black text-[#ab00ff]">AUTO BOT</span>
                    <span className="text-[10px] text-gray-400">›</span>
                  </div>
                  <p className="text-[9px] text-gray-400 font-bold mt-1">Offline Collect</p>
                  <div className="bg-[#ab00ff]/10 border border-[#ab00ff]/30 text-[#ab00ff] text-[9px] font-black px-2 py-0.5 rounded-lg mt-1 text-center">
                    ⏱ 6h 30m
                  </div>
                </div>
              </div>

              {/* TẦNG 4: DAILY QUEST CARDS (REWARD - CIPHER - COMBO WITH NEXT IN & ARROW) */}
              <div className="grid grid-cols-3 gap-2">
                {/* DAILY REWARD */}
                <div
                  onClick={() => setActiveModal("reward")}
                  className="bg-[#0a1424] hover:bg-[#00ff7b]/10 p-2.5 rounded-2xl border border-[#00ff7b]/40 cursor-pointer transition-all flex flex-col items-center justify-between relative group"
                >
                  <span className="absolute top-2 right-2 text-gray-400 text-[10px]">›</span>
                  <span className="text-2xl mb-1">🎁</span>
                  <p className="text-[9px] font-black text-[#00ff7b] uppercase">DAILY REWARD</p>
                  <p className="text-[7px] text-gray-400 font-bold mt-0.5">Next in</p>
                  <div className="bg-[#00ff7b]/10 border border-[#00ff7b]/30 text-[#00ff7b] text-[9px] font-black px-2 py-0.5 rounded-lg mt-1 w-full text-center">
                    {dailyRewardTimeLeft}
                  </div>
                </div>

                {/* CIPHER */}
                <div
                  onClick={() => setActiveModal("cipher")}
                  className="bg-[#0a1424] hover:bg-[#00e5ff]/10 p-2.5 rounded-2xl border border-[#00e5ff]/40 cursor-pointer transition-all flex flex-col items-center justify-between relative group"
                >
                  <span className="absolute top-2 right-2 text-gray-400 text-[10px]">›</span>
                  <span className="text-2xl mb-1">🔐</span>
                  <p className="text-[9px] font-black text-[#00e5ff] uppercase">CIPHER</p>
                  <p className="text-[7px] text-gray-400 font-bold mt-0.5">Next in</p>
                  <div className="bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[#00e5ff] text-[9px] font-black px-2 py-0.5 rounded-lg mt-1 w-full text-center">
                    {dailyCipherTimeLeft}
                  </div>
                </div>

                {/* COMBO */}
                <div
                  onClick={() => setActiveModal("combo")}
                  className="bg-[#0a1424] hover:bg-[#ffe600]/10 p-2.5 rounded-2xl border border-[#ffe600]/40 cursor-pointer transition-all flex flex-col items-center justify-between relative group"
                >
                  <span className="absolute top-2 right-2 text-gray-400 text-[10px]">›</span>
                  <span className="text-2xl mb-1">🎟️</span>
                  <p className="text-[9px] font-black text-[#ffe600] uppercase">COMBO</p>
                  <p className="text-[7px] text-gray-400 font-bold mt-0.5">Next in</p>
                  <div className="bg-[#ffe600]/10 border border-[#ffe600]/30 text-[#ffe600] text-[9px] font-black px-2 py-0.5 rounded-lg mt-1 w-full text-center">
                    {dailyComboTimeLeft}
                  </div>
                </div>
              </div>

            </div>
          ) : activeTab === "leaderboard" ? (
            <div className="flex-1 flex flex-col overflow-y-auto">
              {renderHeader()}
              <div className="flex-grow mt-3 bg-gradient-to-b from-transparent via-[#060a12]/90 to-[#060a12] rounded-t-[30px] relative top-glow-premium border-t border-[#00ff7b]/30 overflow-hidden">
                <div className="px-3 pt-4 flex-1 overflow-auto relative">
                  <Leaderboard users={leaderboard} currentUser={user?.username} isLoading={isLeaderboardLoading} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-y-auto">
              <div className="px-4 z-10 pt-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-1 rounded-full bg-gradient-to-tr from-[#00ff7b] to-[#00e5ff] shadow-[0_0_12px_rgba(0,255,123,0.4)]">
                    <img src={avatarSrc} alt="Avatar" className="w-10 h-10 rounded-full object-contain border-2 border-[#060a12] bg-[#00ff7b]/10 p-0.5" />
                  </div>
                  <div>
                    <p className="text-base font-black text-[#f0eeff] tracking-tight leading-none">{user?.username || "Guest_89LPR"}</p>
                    <p className="text-[9px] text-[#00ff7b] font-black uppercase mt-1 tracking-wider neon-green-glow">EggRush Cyber Master</p>
                  </div>
                </div>
              </div>
              <div className="flex-grow mt-4 bg-gradient-to-b from-transparent via-[#060a12]/90 to-[#060a12] rounded-t-[30px] relative top-glow-premium border-t border-[#060a12] overflow-hidden">
                <div className="px-3 pt-4 flex-1 overflow-auto relative">
                  {isReferralLoading ? (
                    <div className="flex justify-center items-center h-40"><div className="w-8 h-8 border-4 border-[#00ff7b]/20 border-t-[#00ff7b] rounded-full animate-spin"></div></div>
                  ) : (
                    <Referral users={referrals} currentUser={user?.username} />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TẦNG 5: FLOATING NAVIGATION TASKBAR WITH ETH LOGO */}
          <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-md bg-[#0a1424]/95 backdrop-blur-md rounded-full p-2 flex justify-around items-center z-50 border border-[#00ff7b]/40 shadow-[0_0_20px_rgba(0,255,123,0.2)]">
            {/* MINE TAB WITH ETH ICON */}
            <div
              onClick={() => handleTabChange("main")}
              className={`flex flex-col items-center justify-center cursor-pointer transition-all ${
                activeTab === "main" ? "text-[#00ff7b]" : "text-gray-400"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-[#00ff7b]/20 border border-[#00ff7b] flex items-center justify-center shadow-[0_0_10px_#00ff7b]">
                <ETHIcon size={16} />
              </div>
              <span className="text-[8px] font-black uppercase mt-0.5">MINE</span>
              {activeTab === "main" && <div className="w-1 h-1 bg-[#00ff7b] rounded-full mt-0.5 shadow-[0_0_6px_#00ff7b]"></div>}
            </div>

            {/* SWAP TAB */}
            <div
              onClick={handleSwapClick}
              className="flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-[#00e5ff] transition-all relative"
            >
              <div className="flex items-center">
                <Swap size={18} className="text-gray-400 hover:text-[#00e5ff]" />
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <span className="text-[8px] font-black uppercase">SWAP</span>
                <span className="text-[6px] text-[#ffe600] font-black bg-[#ffe600]/10 px-1 rounded border border-[#ffe600]/30">SOON</span>
              </div>
            </div>

            {/* RANKING TAB */}
            <div
              onClick={() => handleTabChange("leaderboard")}
              className={`flex flex-col items-center justify-center cursor-pointer transition-all ${
                activeTab === "leaderboard" ? "text-[#00ff7b]" : "text-gray-400"
              }`}
            >
              <RankingIcon size={18} className={activeTab === "leaderboard" ? "text-[#00ff7b]" : "text-gray-400"} />
              <span className="text-[8px] font-black uppercase mt-1">RANKING</span>
            </div>

            {/* FRIENDS TAB */}
            <div
              onClick={() => handleTabChange("referral")}
              className={`flex flex-col items-center justify-center cursor-pointer transition-all ${
                activeTab === "referral" ? "text-[#00ff7b]" : "text-gray-400"
              }`}
            >
              <Friends size={18} className={activeTab === "referral" ? "text-[#00ff7b]" : "text-gray-400"} />
              <span className="text-[8px] font-black uppercase mt-1">FRIENDS</span>
            </div>

            {/* CLAIM TAB */}
            <div
              onClick={() => toast.info("🎟️ Airdrop Token Claim Protocol coming soon on Robinhood EVM Mainnet (SOON)!")}
              className="flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-[#00ff7b] transition-all relative"
            >
              <span className="absolute -top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <Hamster size={18} className="text-gray-400 hover:text-[#00ff7b]" />
              <div className="flex items-center space-x-1 mt-1">
                <span className="text-[8px] font-black uppercase">CLAIM</span>
                <span className="text-[6px] text-[#00ff7b] font-black bg-[#00ff7b]/10 px-1 rounded border border-[#00ff7b]/30">SOON</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {clicks.map((click) => (
        <div key={click.id} className="fixed text-4xl sm:text-5xl font-[#00ff7b] pointer-events-none neon-green-glow z-[100] italic" style={{ top: `${click.y - 40}px`, left: `${click.x - 20}px`, animation: `float-up-fast 1s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards` }}>+{click.amount}</div>
      ))}
    </div>
  );
};

export default App;
