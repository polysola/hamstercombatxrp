import React, { useState, useEffect, useMemo } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  dailyCipher,
  dailyCombo,
  dailyReward,
  dollarCoin,
  logo,
  hammer,
  egg,
  hatchedEgg,
  bg,
  binanceLogo,
} from "./images";
import Info from "./icons/Info";
import Settings from "./icons/Settings";
import Mine from "./icons/Mine";
import Friends from "./icons/Friends";
import RankingIcon from "./icons/RankingIcon";
import Hamster from "./icons/Hamster";
import Swap from "./icons/Swap";
import {
  saveUserScore,
  getUserScore,
  getLeaderboard,
  setReferrer,
} from "./services/userService";
import Leaderboard from "./components/Leaderboard";
import Referral from "./components/Referral";
import { useReferral } from "./hooks/useReferral";

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

const App: React.FC = () => {
  const levelNames = [
    "Bronze", "Silver", "Gold", "Platinum", "Diamond",
    "Epic", "Legendary", "Master", "GrandMaster", "Lord"
  ];

  const levelMinPoints = useMemo(
    () => [0, 5000, 25000, 100000, 1000000, 2000000, 10000000, 50000000, 100000000, 1000000000],
    []
  );

  const [points, setPoints] = useState(1000);
  const [clicks, setClicks] = useState<ClickEffect[]>([]);
  const profitPerHour = 7200;

  const [dailyRewardTimeLeft, setDailyRewardTimeLeft] = useState("");
  const [dailyCipherTimeLeft, setDailyCipherTimeLeft] = useState("");
  const [dailyComboTimeLeft, setDailyComboTimeLeft] = useState("");

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

  const [eggHealth, setEggHealth] = useState(100);
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
  const HATCH_BONUS = 250;

  useEffect(() => {
    if (user?.username) {
      refetchReferrals();
      fetchLeaderboard();
    }
  }, [user?.username]);

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

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        const tg = (window as any).Telegram?.WebApp;

        if (!tg || !tg.initDataUnsafe?.user) {
          let guestName = localStorage.getItem("guest_name");
          if (!guestName) {
            guestName = "Guest_" + Math.random().toString(36).substring(2, 7).toUpperCase();
            localStorage.setItem("guest_name", guestName);
          }
          const mockUser = {
            username: guestName,
            photoUrl: logo,
          };
          setUser(mockUser);
          try {
            const savedScore = await getUserScore(mockUser.username);
            if (savedScore) setPoints(savedScore.score);
            else {
              setPoints(1000);
              await saveUserScore(mockUser.username, 1000, levelMinPoints[0]);
            }
          } catch (error) {
            setPoints(1000);
          }
          setIsLoading(false);
          return;
        }

        tg.expand();
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
        window.addEventListener("resize", () => {
          const vh = window.innerHeight * 0.01;
          document.documentElement.style.setProperty("--vh", `${vh}px`);
        });

        const telegramUser = {
          username: tg.initDataUnsafe.user.username || "Anonymous",
          photoUrl: tg.initDataUnsafe.user.photo_url || logo,
        };
        setUser(telegramUser);

        const startapp = tg.initDataUnsafe.start_param;
        if (startapp) {
          await setReferrer(telegramUser.username, startapp);
        }

        try {
          const savedScore = await getUserScore(telegramUser.username);
          if (savedScore) {
            setPoints(savedScore.score);
          } else {
            setPoints(1000);
            await saveUserScore(telegramUser.username, 1000, levelMinPoints[0]);
          }
        } catch (error) {
          setPoints(1000);
        }
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeApp();
  }, []);

  useEffect(() => {
    if (!user?.username || isLoading) return;

    // Points accumulation every second
    const profitInterval = setInterval(() => {
      setPoints((prev) => prev + profitPerHour / 3600);
    }, 1000);

    // Auto-save every 1 minute (60,000 ms)
    const autoSaveInterval = setInterval(async () => {
      if (user?.username) {
        await saveUserScore(user.username, points, levelMinPoints[levelIndex]);
      }
    }, 60000);

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

  const handleCardClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Shake effect
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 100);

    // Hammer swing animation
    const hammerId = Date.now();
    setHammerAnimations(prev => [...prev, { id: hammerId, x, y }]);
    setTimeout(() => {
      setHammerAnimations(prev => prev.filter(h => h.id !== hammerId));
    }, 400);

    // Random points per click: 15 to 30
    const pointsToAdd = Math.floor(Math.random() * (30 - 15 + 1)) + 15;

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
    setClicks((prev) => [...prev, { id: Date.now(), x: e.pageX, y: e.pageY, amount: pointsToAdd }]);

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
        setEggHealth(100);
        setEggClicks(0);
        setIsHatching(false);
        setCrackEffects([]);
        setSparkles([]);
        setBonusPoints(null);
      }, 1500);
    }

    const newPoints = points + pointsToAdd + (isHatching ? HATCH_BONUS : 0);
    setPoints(newPoints);

    if (saveTimeout) clearTimeout(saveTimeout);
    const timeout = setTimeout(async () => {
      if (user?.username) {
        await saveUserScore(user.username, newPoints, levelMinPoints[levelIndex]);
      }
    }, 500);
    setSaveTimeout(timeout);
  };

  const formatProfitPerHour = (profit: number) => {
    if (profit >= 1000000000) return `+${(Math.floor(profit / 10000000) / 100).toFixed(2)}B`;
    if (profit >= 1000000) return `+${(Math.floor(profit / 10000) / 100).toFixed(2)}M`;
    if (profit >= 1000) return `+${(Math.floor(profit / 10) / 100).toFixed(2)}K`;
    return `+${profit}`;
  };

  const notify = () => toast("🕔 Coming Soon!");

  const renderHeader = () => (
    <div className="px-4 z-10 pt-2 sm:pt-4">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-[2px] rounded-full bg-gradient-to-r from-[#f3ba2f] to-[#ffcf4d] shadow-lg shadow-[#f3ba2f]/30 ring-2 ring-[#f3ba2f]/20">
            <img src={user?.photoUrl || logo} alt="Avatar" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#050608] object-cover" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-black tracking-tight text-white">{user?.username || "Anonymous"}</p>
            <div className="flex items-center space-x-1">
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <p className="text-[8px] sm:text-[10px] text-gray-400 font-bold">LEGENDARY PLAYER</p>
            </div>
          </div>
        </div>
        <button onClick={notify} className="p-2 sm:p-2.5 rounded-2xl glass-card hover:bg-[#f3ba2f]/10 transition-all border-[#f3ba2f]/20">
          <Settings size={18} className="text-[#f3ba2f]" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div className="glass-card p-3 sm:p-4 rounded-2xl sm:rounded-[24px] premium-shadow border-[#f3ba2f]/10">
          <div className="flex justify-between items-end mb-1 sm:mb-2">
            <p className="text-[9px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-[#f3ba2f] gold-glow">
              {levelNames[levelIndex]}
            </p>
            <p className="text-[9px] sm:text-[11px] font-black text-white/40">
              {levelIndex + 1}<span className="text-[#95908a]">/{levelNames.length}</span>
            </p>
          </div>
          <div className="h-2 sm:h-2.5 w-full bg-black/60 rounded-full overflow-hidden p-[1px] border border-white/5 shadow-inner">
            <div
              className="progress-gradient h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(243,186,47,0.5)]"
              style={{ width: `${levelIndex >= levelNames.length - 1 ? 100 : Math.min(((points - levelMinPoints[levelIndex]) / (levelMinPoints[levelIndex + 1] - levelMinPoints[levelIndex])) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div onClick={notify} className="glass-card p-3 sm:p-4 rounded-2xl sm:rounded-[24px] premium-shadow border-[#f3ba2f]/10 flex items-center space-x-2 sm:space-x-3 cursor-pointer group hover:bg-[#f3ba2f]/5 transition-all">
          <div className="bg-gradient-to-br from-[#f3ba2f]/20 to-[#ffcf4d]/10 p-1 rounded-lg sm:rounded-xl shadow-lg shadow-[#f3ba2f]/10 group-hover:rotate-12 transition-transform overflow-hidden">
            <img src={binanceLogo} alt="Binance" className="w-6 h-6 sm:w-8 sm:h-8 object-contain rounded-full" />
          </div>
          <div className="flex-1">
            <p className="text-[8px] sm:text-[10px] text-[#85827d] font-black uppercase tracking-widest">Profit / hour</p>
            <div className="flex items-center space-x-1">
              <p className="text-[11px] sm:text-sm font-black text-white">{formatProfitPerHour(profitPerHour)}</p>
              <Info size={12} className="text-[#85827d]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex justify-center min-h-screen relative overflow-hidden bg-transparent">
      {/* Background Image Layer */}
      <div className="app-bg-container" style={{ backgroundImage: `url(${bg})` }}></div>
      <div className="aurora-1"></div>
      <div className="aurora-2"></div>

      <ToastContainer theme="dark" position="top-center" />

      {isLoading ? (
        <div className="w-full h-screen flex items-center justify-center text-white z-50 bg-[#050608]">
          <div className="w-14 h-14 border-4 border-[#f3ba2f]/10 border-t-[#f3ba2f] rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="w-full text-white h-screen font-bold flex flex-col max-w-xl relative z-10 overflow-hidden">
          {activeTab === "main" ? (
            <>
              {renderHeader()}
              <div className="flex-grow mt-4 sm:mt-6 bg-gradient-to-b from-transparent to-[#050608]/90 rounded-t-[40px] sm:rounded-t-[50px] relative top-glow-premium border-t border-white/10 overflow-hidden">
                <div className="px-4 mt-4 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { img: dailyReward, label: "Reward", time: dailyRewardTimeLeft },
                    { img: dailyCipher, label: "Cipher", time: dailyCipherTimeLeft },
                    { img: dailyCombo, label: "Combo", time: dailyComboTimeLeft }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      onClick={notify}
                      className="glass-card rounded-xl sm:rounded-[22px] p-2 sm:p-4 relative group cursor-pointer hover:border-[#f3ba2f]/40 transition-all"
                    >
                      <div className="absolute -top-1 -right-1 bg-red-500 text-[6px] sm:text-[8px] px-2 py-0.5 rounded-full text-white font-black animate-pulse z-20 shadow-[0_0_10px_rgba(239,68,68,0.5)] border border-red-400/30">SOON</div>

                      <div className="absolute inset-0 bg-gradient-to-b from-[#f3ba2f]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl sm:rounded-[22px]"></div>
                      <img src={item.img} alt={item.label} className="mx-auto w-8 h-8 sm:w-11 sm:h-11 group-hover:scale-110 transition-transform" />
                      <p className="text-[7px] sm:text-[10px] text-center text-white/50 mt-1 sm:mt-3 font-black uppercase tracking-widest">{item.label}</p>
                      <p className="text-[7px] sm:text-[10px] font-black text-center text-[#f3ba2f] mt-0.5 sm:mt-1">{item.time}</p>
                    </div>
                  ))}
                </div>

                <div className="px-4 mt-6 sm:mt-10 flex justify-center flex-col items-center">
                  <div className="flex items-center space-x-3 sm:space-x-4 bg-white/5 px-6 sm:px-8 py-2.5 sm:py-4 rounded-[24px] sm:rounded-[32px] border border-white/10 shadow-3xl premium-shadow backdrop-blur-md">
                    <img src={dollarCoin} alt="Dollar" className="w-8 h-8 sm:w-12 sm:h-12 drop-shadow-[0_0_20px_rgba(243,186,47,0.6)] rounded-full" />
                    <p className="text-3xl sm:text-5xl text-white font-black tracking-tighter">{Math.floor(points).toLocaleString()}</p>
                  </div>
                </div>

                <div className="px-4 mt-6 sm:mt-12 flex justify-center relative scale-90 sm:scale-100">
                  <div className="egg-aura absolute w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] rounded-full"></div>
                  <div className="relative z-10">
                    <div className="egg-container" style={{ cursor: `url(${hammer}) 16 16, pointer` }}>
                      <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 w-48 sm:w-56 px-4">
                        <div className="h-1.5 sm:h-2 w-full bg-black/60 rounded-full overflow-hidden p-[1px] border border-white/10 shadow-inner">
                          <div className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full transition-all duration-300" style={{ width: `${eggHealth}%` }} />
                        </div>
                        <p className="text-[8px] sm:text-[10px] text-center mt-1 text-white/40 tracking-[0.3em] font-black uppercase">Egg Integrity</p>
                      </div>

                      <div className={`w-80 h-80 sm:w-[450px] sm:h-[450px] p-8 sm:p-12 rounded-full glass-card flex items-center justify-center relative overflow-hidden group shadow-[0_0_80px_rgba(0,0,0,0.6)] ${isShaking ? "animate-egg-shake" : ""}`} onClick={handleCardClick}>
                        <div className="absolute inset-0 bg-radial-gradient from-[#f3ba2f]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="w-full h-full rounded-full flex items-center justify-center relative">
                          <img src={isHatching ? hatchedEgg : egg} alt="Egg" className="w-[95%] h-[95%] object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.9)] transition-transform duration-500 group-hover:scale-105" />

                          {/* Impact Ripples */}
                          {hammerAnimations.map(h => (
                            <div key={`ripple-${h.id}`} className="absolute impact-ripple" style={{ left: h.x, top: h.y }}></div>
                          ))}

                          {/* Hammer Swing Visual */}
                          {hammerAnimations.map(h => (
                            <img
                              key={`hammer-${h.id}`}
                              src={hammer}
                              alt="Hammer"
                              className="absolute w-16 h-16 pointer-events-none z-50 animate-hammer-strike"
                              style={{ left: h.x - 32, top: h.y - 48 }}
                            />
                          ))}

                          {/* Tap Instruction Animation */}
                          {!isHatching && eggClicks < 5 && (
                            <div className="absolute bottom-10 right-10 animate-bounce pointer-events-none">
                              <svg className="w-8 h-8 text-[#f3ba2f] drop-shadow-glow" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12,2C10.89,2 10,2.89 10,4V11L8.38,10.19C7.39,9.69 6.18,10.09 5.68,11.08L4.08,14.28C3.89,14.65 3.86,15.08 4,15.47L6,21H18V13H16V21H14V4C14,2.89 13.11,2 12,2Z" />
                              </svg>
                              <div className="bg-[#f3ba2f] text-black text-[8px] px-2 py-0.5 rounded-full font-black -mt-1">TAP!</div>
                            </div>
                          )}
                        </div>
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
                  </div>
                </div>
              </div>
            </>
          ) : activeTab === "leaderboard" ? (
            <>
              {renderHeader()}
              <div className="flex-grow mt-6 bg-gradient-to-b from-transparent to-[#050608]/90 rounded-t-[40px] relative top-glow-premium border-t border-white/10 overflow-hidden">
                <div className="px-4 pt-10 flex-1 overflow-auto relative">
                  <Leaderboard users={leaderboard} currentUser={user?.username} isLoading={isLeaderboardLoading} />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="px-6 z-10 pt-8 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-1 rounded-full bg-gradient-to-tr from-[#f3ba2f] to-transparent">
                    <img src={user?.photoUrl || logo} alt="Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-[#050608]" />
                  </div>
                  <div>
                    <p className="text-xl font-black text-white tracking-tight leading-none">{user?.username || "Anonymous"}</p>
                    <p className="text-xs text-[#f3ba2f] font-black uppercase mt-1 tracking-widest">Affiliate Master</p>
                  </div>
                </div>
              </div>
              <div className="flex-grow mt-8 bg-gradient-to-b from-transparent to-[#050608]/90 rounded-t-[50px] relative top-glow-premium border-t border-white/10 overflow-hidden">
                <div className="px-4 pt-10 flex-1 overflow-auto relative">
                  {isReferralLoading ? (
                    <div className="flex justify-center items-center h-40"><div className="w-10 h-10 border-4 border-[#f3ba2f]/10 border-t-[#f3ba2f] rounded-full animate-spin"></div></div>
                  ) : (
                    <Referral users={referrals} currentUser={user?.username} />
                  )}
                </div>
              </div>
            </>
          )}

          <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2.5rem)] max-w-xl glass-card flex justify-around items-center z-50 rounded-[25px] sm:rounded-[35px] p-1.5 sm:p-2.5 premium-shadow border-white/10 ring-1 ring-white/5">
            {[
              { id: "main", icon: Mine, label: "Mine" },
              { id: "swap", icon: Swap, label: "Swap", disabled: true },
              { id: "leaderboard", icon: RankingIcon, label: "Ranking" },
              { id: "referral", icon: Friends, label: "Friends" },
              { id: "claim", icon: Hamster, label: "Claim", disabled: true }
            ].map((tab) => (
              <div
                key={tab.id}
                onClick={() => !tab.disabled && handleTabChange(tab.id as any)}
                className={`text-center flex-1 py-2 sm:py-3.5 rounded-xl sm:rounded-[22px] transition-all duration-500 cursor-pointer relative group ${activeTab === tab.id
                  ? "bg-gradient-to-b from-[#f3ba2f]/20 to-[#f3ba2f]/5 text-[#f3ba2f] shadow-lg shadow-[#f3ba2f]/10"
                  : "text-gray-500 hover:text-white/80"
                  }`}
              >
                <div className={`relative inline-block ${tab.disabled ? "opacity-30 grayscale" : ""}`}>
                  <tab.icon className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto transition-transform duration-300 ${activeTab === tab.id ? "scale-110" : "group-hover:scale-110"}`} />
                </div>
                <p className={`text-[7px] sm:text-[9px] mt-1 sm:mt-2 font-black uppercase tracking-[0.1em] ${tab.disabled ? "opacity-30 grayscale" : ""}`}>{tab.label}</p>

                {tab.disabled && (
                  <div className="absolute -top-1 -right-4 bg-red-500 text-[6px] sm:text-[8px] px-2 py-0.5 rounded-full text-white font-black animate-pulse z-20 shadow-[0_0_10px_rgba(239,68,68,0.5)] border border-red-400/30">SOON</div>
                )}

                {activeTab === tab.id && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 sm:w-1.5 h-1 sm:h-1.5 bg-[#f3ba2f] rounded-full shadow-[0_0_10px_#f3ba2f]"></div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {clicks.map((click) => (
        <div key={click.id} className="absolute text-5xl font-black text-white pointer-events-none gold-glow z-[100] italic" style={{ top: `${click.y - 50}px`, left: `${click.x - 30}px`, animation: `float-up-fast 1s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards` }}>{click.amount}</div>
      ))}
    </div>
  );
};

export default App;
