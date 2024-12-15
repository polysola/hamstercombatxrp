import React, { useState, useEffect, useMemo } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Hamster from "./icons/Hamster";
import {
  binanceLogo,
  dailyCipher,
  dailyCombo,
  dailyReward,
  dollarCoin,
  hamsterCoin,
  mainCharacter,
  logo,
} from "./images";
import Info from "./icons/Info";
import Settings from "./icons/Settings";
import Mine from "./icons/Mine";
// import Friends from "./icons/Mine";
import Coins from "./icons/Coins";
import {
  saveUserScore,
  getUserScore,
  getLeaderboard,
  getReferrals,
  setReferrer,
} from "./services/userService";
import Leaderboard from "./components/Leaderboard";
import Referral from "./components/Referral";
import { ReferralUser } from "./types/user";

interface LeaderboardUser {
  username: string;
  score: number;
  photoUrl?: string;
}

const App: React.FC = () => {
  const levelNames = [
    "Bronze", // From 0 to 4999 coins
    "Silver", // From 5000 coins to 24,999 coins
    "Gold", // From 25,000 coins to 99,999 coins
    "Platinum", // From 100,000 coins to 999,999 coins
    "Diamond", // From 1,000,000 coins to 2,000,000 coins
    "Epic", // From 2,000,000 coins to 10,000,000 coins
    "Legendary", // From 10,000,000 coins to 50,000,000 coins
    "Master", // From 50,000,000 coins to 100,000,000 coins
    "GrandMaster", // From 100,000,000 coins to 1,000,000,000 coins
    "Lord", // From 1,000,000,000 coins to ∞
  ];

  const levelMinPoints = useMemo(
    () => [
      0, // Bronze
      5000, // Silver
      25000, // Gold
      100000, // Platinum
      1000000, // Diamond
      2000000, // Epic
      10000000, // Legendary
      50000000, // Master
      100000000, // GrandMaster
      1000000000, // Lord
    ],
    []
  );

  const [levelIndex, setLevelIndex] = useState(6);
  const [points, setPoints] = useState(1000);
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>(
    []
  );
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

  const [activeTab, setActiveTab] = useState<
    "main" | "leaderboard" | "referral"
  >("main");

  const [referralData, setReferralData] = useState<{
    referralCode: string;
    referrals: ReferralUser[];
  }>({
    referralCode: "",
    referrals: [],
  });

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        const tg = window.Telegram?.WebApp;

        if (!tg || !tg.initDataUnsafe?.user) {
          toast.error("Please login via Telegram WebApp!", {
            position: "top-center",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setIsLoading(false);
          return;
        }

        const telegramUser = {
          username: tg.initDataUnsafe.user.username || "Anonymous",
          photoUrl: tg.initDataUnsafe.user.photo_url || "/src/images/suit.png",
        };
        setUser(telegramUser);

        if (tg?.initDataUnsafe?.start_param) {
          const refCode = tg.initDataUnsafe.start_param;
          console.log("Detected referral code:", refCode);
          const result = await setReferrer(telegramUser.username, refCode);
          console.log("Referral result:", result);
          if (result) {
            toast.success("Referral successful!");
          } else {
            toast.info("Already referred or invalid referral code");
          }
        }

        try {
          const savedScore = await getUserScore(telegramUser.username);
          if (savedScore) {
            setPoints(savedScore.score);
            const newLevelIndex = levelMinPoints.findIndex(
              (min, index) =>
                savedScore.score >= min &&
                (index === levelMinPoints.length - 1 ||
                  savedScore.score < levelMinPoints[index + 1])
            );
            setLevelIndex(newLevelIndex !== -1 ? newLevelIndex : 0);

            if (savedScore.photoUrl !== telegramUser.photoUrl) {
              await saveUserScore(
                telegramUser.username,
                savedScore.score,
                savedScore.levelMin
              );
            }
          } else {
            setPoints(1000);
            setLevelIndex(0);
            await saveUserScore(telegramUser.username, 1000, levelMinPoints[0]);
          }
        } catch (error) {
          console.error("Error initializing user score:", error);
          toast.error("Error loading user data. Please try again.");
          setPoints(1000);
          setLevelIndex(0);
        }
      } catch (error) {
        console.error("Initialization error:", error);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const data = await getLeaderboard(10);
      setLeaderboard(data);
    };

    fetchLeaderboard();
    // Cập nhật leaderboard mỗi 30 giây
    const interval = setInterval(fetchLeaderboard, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchReferralData = async () => {
      if (!user?.username) return;

      try {
        const refs = await getReferrals(user.username);
        setReferralData({
          referralCode: user.username,
          referrals: refs,
        });
      } catch (error) {
        console.error("Error fetching referrals:", error);
      }
    };

    fetchReferralData();
    const interval = setInterval(fetchReferralData, 30000);

    return () => clearInterval(interval);
  }, [user?.username]);

  const calculateTimeLeft = (targetHour: number) => {
    const now = new Date();
    const target = new Date(now);
    target.setUTCHours(targetHour, 0, 0, 0);

    if (now.getUTCHours() >= targetHour) {
      target.setUTCDate(target.getUTCDate() + 1);
    }

    const diff = target.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const paddedHours = hours.toString().padStart(2, "0");
    const paddedMinutes = minutes.toString().padStart(2, "0");

    return `${paddedHours}:${paddedMinutes}`;
  };

  useEffect(() => {
    const updateCountdowns = () => {
      setDailyRewardTimeLeft(calculateTimeLeft(0));
      setDailyCipherTimeLeft(calculateTimeLeft(19));
      setDailyComboTimeLeft(calculateTimeLeft(12));
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleCardClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    card.style.transform = `perspective(1000px) rotateX(${
      -y / 10
    }deg) rotateY(${x / 10}deg)`;

    setTimeout(() => {
      card.style.transform = "";
    }, 100);

    const newPoints = points + pointsToAdd;
    setPoints(newPoints);

    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    const timeout = setTimeout(async () => {
      if (user?.username) {
        await saveUserScore(
          user.username,
          newPoints,
          levelMinPoints[levelIndex]
        );
      }
    }, 5000);

    setSaveTimeout(timeout);

    setClicks([...clicks, { id: Date.now(), x: e.pageX, y: e.pageY }]);

    const droplet = document.createElement("span");
    droplet.textContent = "💧";
    droplet.style.position = "absolute";
    droplet.style.left = `${e.pageX}px`;
    droplet.style.top = `${e.pageY}px`;
    droplet.style.transition = "transform 1s ease, opacity 1s ease";
    droplet.style.transform = "translateY(-50px)"; // Move upward
    droplet.style.opacity = "1";
    document.body.appendChild(droplet);

    setTimeout(() => {
      droplet.style.transform = "translateY(-150px)";
      droplet.style.opacity = "0";
    }, 100);

    setTimeout(() => {
      document.body.removeChild(droplet);
    }, 1100);
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter((click) => click.id !== id));
  };

  const calculateProgress = () => {
    if (levelIndex >= levelNames.length - 1) {
      return 100;
    }
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    const progress =
      ((points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
    return Math.min(progress, 100);
  };

  useEffect(() => {
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    if (points >= nextLevelMin && levelIndex < levelNames.length - 1) {
      setLevelIndex(levelIndex + 1);
    } else if (points < currentLevelMin && levelIndex > 0) {
      setLevelIndex(levelIndex - 1);
    }
  }, [points, levelIndex, levelNames.length, levelMinPoints]);

  const formatProfitPerHour = (profit: number) => {
    if (profit >= 1000000000) return `+${(profit / 1000000000).toFixed(2)}B`;
    if (profit >= 1000000) return `+${(profit / 1000000).toFixed(2)}M`;
    if (profit >= 1000) return `+${(profit / 1000).toFixed(2)}K`;
    return `+${profit}`;
  };

  const notify = () => toast("🕔 Coming Soon!");

  return (
    <div className="bg-black flex justify-center">
      <ToastContainer />
      {isLoading ? (
        <div className="w-full h-screen flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      ) : (
        <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
          {activeTab === "main" ? (
            // Main Screen
            <>
              <div className="px-4 z-10">
                <div className="flex items-center space-x-2 pt-4">
                  <div className="p-1 rounded-lg bg-[#1d2025]">
                    <img
                      src={user?.photoUrl || logo}
                      alt="User Avatar"
                      className="w-6 h-6 rounded-full"
                    />
                  </div>
                  <div>
                    <p className="text-sm">{user?.username || "Anonymous"}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between space-x-4 mt-1">
                  <div className="flex items-center w-1/3">
                    <div className="w-full">
                      <div className="flex justify-between">
                        <p className="text-sm">{levelNames[levelIndex]}</p>
                        <p className="text-sm">
                          {levelIndex + 1}{" "}
                          <span className="text-[#95908a]">
                            / {levelNames.length}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center mt-1 border-2 border-[#43433b] rounded-full">
                        <div className="w-full h-2 bg-[#43433b]/[0.6] rounded-full">
                          <div
                            className="progress-gradient h-2 rounded-full"
                            style={{ width: `${calculateProgress()}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={notify}
                    className="flex items-center w-2/3 border-2 border-[#43433b] rounded-full px-4 py-[2px] bg-[#43433b]/[0.6] max-w-64 cursor-not-allowed"
                  >
                    <img src={binanceLogo} alt="Exchange" className="w-8 h-8" />
                    <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
                    <div className="flex-1 text-center">
                      <p className="text-xs text-[#85827d] font-medium">
                        Profit per hour
                      </p>
                      <div className="flex items-center justify-center space-x-1">
                        <img
                          src={dollarCoin}
                          alt="Dollar Coin"
                          className="w-[18px] h-[18px]"
                        />
                        <p className="text-sm">
                          {formatProfitPerHour(profitPerHour)}
                        </p>
                        <Info size={20} className="text-[#43433b]" />
                      </div>
                    </div>
                    <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
                    <Settings className="text-white" />
                  </div>
                </div>
              </div>

              <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
                <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px] setBg">
                  <div className="px-4 mt-6 flex justify-between gap-2">
                    <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                      <div className="dot"></div>
                      <img
                        src={dailyReward}
                        alt="Daily Reward"
                        className="mx-auto w-12 h-12"
                      />
                      <p className="text-[10px] text-center text-white mt-1">
                        Daily reward
                      </p>
                      <p className="text-[10px] font-medium text-center text-gray-400 mt-2">
                        {dailyRewardTimeLeft}
                      </p>
                    </div>
                    <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                      <div className="dot"></div>
                      <img
                        src={dailyCipher}
                        alt="Daily Cipher"
                        className="mx-auto w-12 h-12"
                      />
                      <p className="text-[10px] text-center text-white mt-1">
                        Daily cipher
                      </p>
                      <p className="text-[10px] font-medium text-center text-gray-400 mt-2">
                        {dailyCipherTimeLeft}
                      </p>
                    </div>
                    <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
                      <div className="dot"></div>
                      <img
                        src={dailyCombo}
                        alt="Daily Combo"
                        className="mx-auto w-12 h-12"
                      />
                      <p className="text-[10px] text-center text-white mt-1">
                        Daily combo
                      </p>
                      <p className="text-[10px] font-medium text-center text-gray-400 mt-2">
                        {dailyComboTimeLeft}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 mt-4 flex justify-center flex-col items-center">
                    <p className="text-sm text-white mb-2">
                      {user?.username || "Anonymous"}
                    </p>
                    <div className="px-4 py-2 flex items-center space-x-2">
                      <img
                        src={dollarCoin}
                        alt="Dollar Coin"
                        className="w-10 h-10"
                      />
                      <p className="text-4xl text-white">
                        {points.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 mt-4 flex justify-center">
                    <div
                      className="w-80 h-80 p-4 rounded-full circle-outer"
                      onClick={handleCardClick}
                    >
                      <div className="w-full h-full rounded-full circle-inner">
                        <img
                          src={mainCharacter}
                          alt="Main Character"
                          className="w-full h-full rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : activeTab === "leaderboard" ? (
            // Leaderboard Screen
            <>
              <div className="px-4 z-10">
                <div className="flex items-center space-x-2 pt-4">
                  <div className="p-1 rounded-lg bg-[#1d2025]">
                    <img
                      src={user?.photoUrl || logo}
                      alt="User Avatar"
                      className="w-6 h-6 rounded-full"
                    />
                  </div>
                  <div>
                    <p className="text-sm">{user?.username || "Anonymous"}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between space-x-4 mt-1">
                  <div className="flex items-center w-1/3">
                    <div className="w-full">
                      <div className="flex justify-between">
                        <p className="text-sm">{levelNames[levelIndex]}</p>
                        <p className="text-sm">
                          {levelIndex + 1}{" "}
                          <span className="text-[#95908a]">
                            / {levelNames.length}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center mt-1 border-2 border-[#43433b] rounded-full">
                        <div className="w-full h-2 bg-[#43433b]/[0.6] rounded-full">
                          <div
                            className="progress-gradient h-2 rounded-full"
                            style={{ width: `${calculateProgress()}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={notify}
                    className="flex items-center w-2/3 border-2 border-[#43433b] rounded-full px-4 py-[2px] bg-[#43433b]/[0.6] max-w-64 cursor-not-allowed"
                  >
                    <img src={binanceLogo} alt="Exchange" className="w-8 h-8" />
                    <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
                    <div className="flex-1 text-center">
                      <p className="text-xs text-[#85827d] font-medium">
                        Profit per hour
                      </p>
                      <div className="flex items-center justify-center space-x-1">
                        <img
                          src={dollarCoin}
                          alt="Dollar Coin"
                          className="w-[18px] h-[18px]"
                        />
                        <p className="text-sm">
                          {formatProfitPerHour(profitPerHour)}
                        </p>
                        <Info size={20} className="text-[#43433b]" />
                      </div>
                    </div>
                    <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
                    <Settings className="text-white" />
                  </div>
                </div>
              </div>

              <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
                <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px] setBg">
                  <div className="px-4 pt-6 flex-1 overflow-auto">
                    <Leaderboard
                      users={leaderboard}
                      currentUser={user?.username}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Referral Screen
            <>
              <div className="px-4 z-10">
                <div className="flex items-center space-x-2 pt-4">
                  <div className="p-1 rounded-lg bg-[#1d2025]">
                    <img
                      src={user?.photoUrl || logo}
                      alt="User Avatar"
                      className="w-6 h-6 rounded-full"
                    />
                  </div>
                  <div>
                    <p className="text-sm">{user?.username || "Anonymous"}</p>
                  </div>
                </div>
              </div>

              <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
                <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px] setBg">
                  <div className="px-4 pt-6 flex-1 overflow-auto">
                    <Referral
                      users={referralData.referrals}
                      currentUser={user?.username}
                      referralCode={referralData.referralCode}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl bg-[#272a2f] flex justify-around items-center z-50 rounded-3xl text-xs p-1">
            <div
              onClick={() => setActiveTab("main")}
              className={`text-center w-1/5 p-2 rounded-2xl transition-all duration-200 ${
                activeTab === "main"
                  ? "bg-[#1c1f24] text-[#f3ba2f]"
                  : "text-[#85827d] hover:bg-[#1c1f24]/50"
              }`}
            >
              <img
                src={binanceLogo}
                alt="Exchange"
                className="w-8 h-8 mx-auto"
              />
              <p className="mt-1">Swap</p>
            </div>
            <div
              onClick={notify}
              className="text-center text-[#85827d] w-1/5 cursor-not-allowed"
            >
              <Mine className="w-8 h-8 mx-auto" />
              <p className="mt-1">Mine</p>
            </div>
            <div
              onClick={() => setActiveTab("leaderboard")}
              className={`text-center text-[#85827d] w-1/5 ${
                activeTab === "leaderboard" ? "bg-[#1c1f24]" : ""
              } m-1 p-2 rounded-2xl cursor-pointer`}
            >
              <Coins className="w-8 h-8 mx-auto" />
              <p className="mt-1">Ranking</p>
            </div>
            <div
              onClick={() => setActiveTab("referral")}
              className={`text-center w-1/5 p-2 rounded-2xl transition-all duration-200 ${
                activeTab === "referral"
                  ? "bg-[#1c1f24] text-[#f3ba2f]"
                  : "text-[#85827d] hover:bg-[#1c1f24]/50"
              }`}
            >
              <Coins className="w-8 h-8 mx-auto" />
              <p className="mt-1">Ref</p>
            </div>
            <div
              onClick={notify}
              className="text-center text-[#85827d] w-1/5 cursor-not-allowed"
            >
              <img
                src={hamsterCoin}
                alt="Airdrop"
                className="w-8 h-8 mx-auto"
              />
              <p className="mt-1">Airdrop</p>
            </div>
          </div>
        </div>
      )}

      {clicks.map((click) => (
        <div
          key={click.id}
          className="absolute text-5xl font-bold opacity-0 text-white pointer-events-none"
          style={{
            top: `${click.y - 42}px`,
            left: `${click.x - 28}px`,
            animation: `float 1s ease-out`,
          }}
          onAnimationEnd={() => handleAnimationEnd(click.id)}
        >
          {pointsToAdd}
        </div>
      ))}
    </div>
  );
};

export default App;
