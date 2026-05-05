import React, { useState, useEffect, useMemo } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  binanceLogo,
  dailyCipher,
  dailyCombo,
  dailyReward,
  dollarCoin,
  logo,
  hammer,
  egg,
  hatchedEgg,
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

const App: React.FC = () => {
  const levelNames = [
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    "Diamond",
    "Epic",
    "Legendary",
    "Master",
    "GrandMaster",
    "Lord",
  ];

  const levelMinPoints = useMemo(
    () => [0, 5000, 25000, 100000, 1000000, 2000000, 10000000, 50000000, 100000000, 1000000000],
    []
  );

  const [points, setPoints] = useState(1000);
  const [clicks, setClicks] = useState<ClickEffect[]>([]);
  const pointsToAdd = 20;
  const profitPerHour = 12895;

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

  const CLICKS_TO_HATCH = 10;
  const HATCH_BONUS = 500;

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
          const mockUser = {
            username: "WebPlayer_Test",
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

  const calculateTimeLeft = (targetHour: number) => {
    const now = new Date();
    const target = new Date(now);
    target.setUTCHours(targetHour, 0, 0, 0);
    if (now.getUTCHours() >= targetHour) target.setUTCDate(target.getUTCDate() + 1);
    const diff = target.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const updateCountdowns = () => {
      setDailyRewardTimeLeft(calculateTimeLeft(0));
      setDailyCipherTimeLeft(calculateTimeLeft(19));
      setDailyComboTimeLeft(calculateTimeLeft(12));
    };
    updateCountdowns();
    const interval = setInterval(updateCountdowns, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleCardClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = (y - rect.height / 2) / 10;
    const rotateY = -(x - rect.width / 2) / 10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    card.classList.add("egg-shake");
    setTimeout(() => {
      card.classList.remove("egg-shake");
      card.style.transform = "";
    }, 500);

    const createCrackLines = (): CrackEffect[] => {
      const numLines = 3;
      const cracks: CrackEffect[] = [];
      const baseLength = 40;
      const timestamp = Date.now();

      for (let i = 0; i < numLines; i++) {
        const mainAngle = Math.random() * 60 - 30 + i * 120;
        const mainLength = baseLength + Math.random() * 20;

        cracks.push({
          id: `main-${timestamp}-${i}`,
          x, y, angle: mainAngle, length: mainLength, type: "main"
        });

        const numBranches = 2 + Math.floor(Math.random() * 2);
        for (let j = 0; j < numBranches; j++) {
          const branchAngle = mainAngle + (Math.random() * 40 - 20);
          const branchLength = mainLength * (0.4 + Math.random() * 0.3);
          cracks.push({
            id: `branch-${timestamp}-${i}-${j}`,
            x: x + Math.cos((mainAngle * Math.PI) / 180) * (mainLength * 0.3),
            y: y + Math.sin((mainAngle * Math.PI) / 180) * (mainLength * 0.3),
            angle: branchAngle, length: branchLength, type: "branch"
          });
        }
      }
      return cracks;
    };

    const newCracks = createCrackLines();
    setCrackEffects((prev) => [...prev, ...newCracks]);
    setEggHealth((prev) => Math.max(0, prev - 10));
    setEggClicks((prev) => prev + 1);
    setClicks((prev) => [...prev, { id: Date.now(), x: e.pageX, y: e.pageY }]);

    if (eggClicks + 1 >= CLICKS_TO_HATCH) {
      setIsHatching(true);
      const newSparkles = Array.from({ length: 12 }, (_, i) => ({
        id: Date.now() + i,
        x: rect.width / 2,
        y: rect.height / 2,
        angle: (Math.PI * 2 * i) / 12,
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
      }, 2000);
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

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter((click) => click.id !== id));
  };

  const formatProfitPerHour = (profit: number) => {
    if (profit >= 1000000000) return `+${(profit / 1000000000).toFixed(2)}B`;
    if (profit >= 1000000) return `+${(profit / 1000000).toFixed(2)}M`;
    if (profit >= 1000) return `+${(profit / 1000).toFixed(2)}K`;
    return `+${profit}`;
  };

  const notify = () => toast("🕔 Coming Soon!");

  const renderHeader = () => (
    <div className="px-4 z-10">
      <div className="flex items-center space-x-2 pt-4">
        <div className="p-1 rounded-lg bg-[#1d2025]">
          <img src={user?.photoUrl || logo} alt="Avatar" className="w-6 h-6 rounded-full" />
        </div>
        <div><p className="text-sm">{user?.username || "Anonymous"}</p></div>
      </div>
      <div className="flex items-center justify-between space-x-4 mt-1">
        <div className="flex items-center w-1/3">
          <div className="w-full">
            <div className="flex justify-between items-end mb-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#f3ba2f]">{levelNames[levelIndex]}</p>
              <p className="text-[10px] font-medium text-gray-400">Level <span className="text-white">{levelIndex + 1}</span><span className="text-[#95908a]">/{levelNames.length}</span></p>
            </div>
            <div className="h-1.5 w-full bg-[#43433b]/[0.6] rounded-full overflow-hidden border border-white/5 shadow-inner">
              <div className="progress-gradient h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(243,186,47,0.4)]" style={{ width: `${levelIndex >= levelNames.length - 1 ? 100 : Math.min(((points - levelMinPoints[levelIndex]) / (levelMinPoints[levelIndex + 1] - levelMinPoints[levelIndex])) * 100, 100)}%` }}></div>
            </div>
          </div>
        </div>
        <div onClick={notify} className="flex items-center w-2/3 border-2 border-[#43433b] rounded-full px-4 py-[2px] bg-[#43433b]/[0.6] max-w-64 cursor-not-allowed">
          <img src={binanceLogo} alt="Exchange" className="w-8 h-8 object-contain" />
          <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
          <div className="flex-1 text-center">
            <p className="text-xs text-[#85827d] font-medium">Profit per hour</p>
            <div className="flex items-center justify-center space-x-1">
              <img src={dollarCoin} alt="Dollar" className="w-[18px] h-[18px]" />
              <p className="text-sm">{formatProfitPerHour(profitPerHour)}</p>
              <Info size={20} className="text-[#43433b]" />
            </div>
          </div>
          <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
          <Settings className="text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-black flex justify-center">
      <ToastContainer />
      {isLoading ? (
        <div className="w-full h-screen flex items-center justify-center text-white">Loading...</div>
      ) : (
        <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
          {activeTab === "main" ? (
            <>
              {renderHeader()}
              <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
                <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px] setBg">
                  <div className="px-4 mt-6 flex justify-between gap-2">
                    <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                      <div className="dot"></div>
                      <img src={dailyReward} alt="Reward" className="mx-auto w-12 h-12" />
                      <p className="text-[10px] text-center text-white mt-1">Daily reward</p>
                      <p className="text-[10px] font-medium text-center text-gray-400 mt-2">{dailyRewardTimeLeft}</p>
                    </div>
                    <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                      <div className="dot"></div>
                      <img src={dailyCipher} alt="Cipher" className="mx-auto w-12 h-12" />
                      <p className="text-[10px] text-center text-white mt-1">Daily cipher</p>
                      <p className="text-[10px] font-medium text-center text-gray-400 mt-2">{dailyCipherTimeLeft}</p>
                    </div>
                    <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                      <div className="dot"></div>
                      <img src={dailyCombo} alt="Combo" className="mx-auto w-12 h-12" />
                      <p className="text-[10px] text-center text-white mt-1">Daily combo</p>
                      <p className="text-[10px] font-medium text-center text-gray-400 mt-2">{dailyComboTimeLeft}</p>
                    </div>
                  </div>
                  <div className="px-4 mt-4 flex justify-center flex-col items-center">
                    <p className="text-sm text-white mb-2">{user?.username || "Anonymous"}</p>
                    <div className="px-4 py-2 flex items-center space-x-2">
                      <img src={dollarCoin} alt="Dollar" className="w-10 h-10" />
                      <p className="text-4xl text-white">{points.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="px-4 mt-4 flex justify-center">
                    <div className="relative">
                      <div className={`egg-container ${isHatching ? "hatching" : ""}`} style={{ cursor: `url(${hammer}) 16 16, pointer` }}>
                        <div className="egg-health"><div className="egg-health-bar" style={{ width: `${eggHealth}%` }} /></div>
                        <div className="w-80 h-80 p-4 rounded-full circle-outer" onClick={handleCardClick}>
                          <div className="w-full h-full rounded-full circle-inner">
                            <img src={isHatching ? hatchedEgg : egg} alt="Egg" className="w-full h-full rounded-full" />
                          </div>
                        </div>
                        {crackEffects.map((crack) => (
                          <React.Fragment key={crack.id}>
                            <div className="crack-line" style={{ left: `${crack.x}px`, top: `${crack.y}px`, transform: `rotate(${crack.angle}deg)`, "--crack-length": `${crack.length}px` } as React.CSSProperties} />
                          </React.Fragment>
                        ))}
                        {sparkles.map((sparkle) => (
                          <div key={sparkle.id} className="sparkle" style={{ "--tx": `${Math.cos(sparkle.angle) * 100}px`, "--ty": `${Math.sin(sparkle.angle) * 100}px`, left: `${sparkle.x}px`, top: `${sparkle.y}px` } as React.CSSProperties} />
                        ))}
                        {bonusPoints && bonusPoints.visible && (
                          <div className="bonus-points" style={{ left: `${bonusPoints.x}px`, top: `${bonusPoints.y}px` }}>+{bonusPoints.amount}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : activeTab === "leaderboard" ? (
            <>
              {renderHeader()}
              <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
                <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px] setBg">
                  <div className="px-4 pt-6 flex-1 overflow-auto">
                    <Leaderboard users={leaderboard} currentUser={user?.username} isLoading={isLeaderboardLoading} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="px-4 z-10">
                <div className="flex items-center space-x-2 pt-4">
                  <div className="p-1 rounded-lg bg-[#1d2025]">
                    <img src={user?.photoUrl || logo} alt="Avatar" className="w-6 h-6 rounded-full" />
                  </div>
                  <div><p className="text-sm">{user?.username || "Anonymous"}</p></div>
                </div>
              </div>
              <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
                <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px] setBg">
                  <div className="px-4 pt-6 flex-1 overflow-auto">
                    {isReferralLoading ? (
                      <div className="flex justify-center items-center h-40"><div className="text-white">Loading...</div></div>
                    ) : (
                      <Referral users={referrals} currentUser={user?.username} />
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl bg-[#272a2f] flex justify-around items-center z-50 rounded-3xl text-xs p-1">
            <div onClick={() => handleTabChange("main")} className={`text-center w-1/5 p-2 rounded-2xl transition-all duration-200 ${activeTab === "main" ? "bg-[#1c1f24] text-[#f3ba2f]" : "text-[#85827d] hover:bg-[#1c1f24]/50"}`}>
              <Mine className="w-8 h-8 mx-auto p-0.5" />
              <p className="mt-1">Mine</p>
            </div>
            <div onClick={notify} className="text-center w-1/5 p-2 rounded-2xl transition-all duration-200 text-[#85827d] hover:bg-[#1c1f24]/50 cursor-not-allowed">
              <Swap className="w-8 h-8 mx-auto" /><p className="mt-1">Swap</p>
            </div>
            <div onClick={() => handleTabChange("leaderboard")} className={`text-center w-1/5 p-2 rounded-2xl transition-all duration-200 ${activeTab === "leaderboard" ? "bg-[#1c1f24] text-[#f3ba2f]" : "text-[#85827d] hover:bg-[#1c1f24]/50"}`}>
              <RankingIcon className="w-8 h-8 mx-auto" /><p className="mt-1">Ranking</p>
            </div>
            <div onClick={() => handleTabChange("referral")} className={`text-center w-1/5 p-2 rounded-2xl transition-all duration-200 ${activeTab === "referral" ? "bg-[#1c1f24] text-[#f3ba2f]" : "text-[#85827d] hover:bg-[#1c1f24]/50"}`}>
              <Friends className="w-8 h-8 mx-auto" /><p className="mt-1">Ref</p>
            </div>
            <div onClick={notify} className="text-center w-1/5 p-2 rounded-2xl transition-all duration-200 text-[#85827d] hover:bg-[#1c1f24]/50 cursor-not-allowed">
              <Hamster className="w-8 h-8 mx-auto" /><p className="mt-1">Airdrop</p>
            </div>
          </div>
        </div>
      )}
      {clicks.map((click) => (
        <div key={click.id} className="absolute text-5xl font-bold opacity-0 text-white pointer-events-none" style={{ top: `${click.y - 42}px`, left: `${click.x - 28}px`, animation: `float 1s ease-out` }} onAnimationEnd={() => handleAnimationEnd(click.id)}>{pointsToAdd}</div>
      ))}
    </div>
  );
};

export default App;
