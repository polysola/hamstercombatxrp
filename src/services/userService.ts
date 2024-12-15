import { db } from '../config/firebase';
import { doc, setDoc, getDoc, collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { UserScore, APIReferralUser } from '../types/user';

export const saveUserScore = async (
    username: string,
    score: number,
    levelMin: number
): Promise<boolean> => {
    try {
        const tg = window.Telegram?.WebApp;
        const photoUrl = tg?.initDataUnsafe?.user?.photo_url;

        const existingData = await getUserScore(username);
        const scoreDiff = score - (existingData?.score || 0);

        // Nếu điểm tăng, xử lý phần thưởng ref
        if (scoreDiff > 0) {
            await processReferralReward(username, scoreDiff);
        }

        const userData: UserScore = {
            username,
            score,
            levelMin,
            photoUrl: photoUrl || existingData?.photoUrl || "/src/images/suit.png",
            lastUpdated: new Date().toISOString(),
            referrer: existingData?.referrer || "",
            referralCode: username,
            totalRefEarnings: existingData?.totalRefEarnings || 0
        };

        await setDoc(doc(db, "DataXRP", username), userData);
        return true;
    } catch (error) {
        console.error("Error saving score:", error);
        return false;
    }
};

export const getUserScore = async (username: string): Promise<UserScore | null> => {
    try {
        const docRef = doc(db, "DataXRP", username);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() as UserScore : null;
    } catch (error) {
        console.error("Error getting score:", error);
        return null;
    }
};

interface LeaderboardEntry {
    username: string;
    score: number;
    photoUrl: string;
}

export const getLeaderboard = async (limitCount: number = 10): Promise<LeaderboardEntry[]> => {
    try {
        const q = query(
            collection(db, "DataXRP"),
            orderBy("score", "desc"),
            limit(limitCount)
        );

        const querySnapshot = await getDocs(q);
        const leaderboard = querySnapshot.docs.map(doc => {
            const data = doc.data() as UserScore;
            return {
                username: data.username,
                score: data.score,
                photoUrl: data.photoUrl || "/src/images/suit.png"
            };
        });

        return leaderboard;
    } catch (error) {
        console.error("Error getting leaderboard:", error);
        return [];
    }
};

export const getReferrals = async (username: string): Promise<APIReferralUser[]> => {
    try {
        // Lấy thông tin người giới thiệu (current user)
        const currentUser = await getUserScore(username);
        if (!currentUser) {
            console.error('Current user not found:', username);
            return [];
        }

        // Lấy danh sách người được giới thiệu
        const q = query(
            collection(db, "DataXRP"),
            where("referrer", "==", username),
            orderBy("totalRefEarnings", "desc")
        );

        const querySnapshot = await getDocs(q);
        const referrals = querySnapshot.docs.map(doc => {
            const data = doc.data() as UserScore;
            return {
                ...data,
                earnedFromRef: data.totalRefEarnings || 0
            };
        });

        // Thêm thông tin người giới thiệu vào đầu danh sách
        const result = [{
            ...currentUser,
            earnedFromRef: currentUser.totalRefEarnings || 0
        }, ...referrals];

        console.log('Full referral data:', {
            currentUser: result[0],
            referrals: result.slice(1)
        });

        return result;
    } catch (error) {
        console.error("Error getting referrals:", error);
        return [];
    }
};

export const setReferrer = async (username: string, referrerCode: string): Promise<boolean> => {
    try {
        console.log('Setting referrer - Username:', username, 'Referrer code:', referrerCode);

        // Kiểm tra nếu người dùng tự giới thiệu chính mình
        if (username === referrerCode) {
            console.log('Cannot refer yourself');
            return false;
        }

        let userData = await getUserScore(username);
        console.log('Current user data:', userData);

        // Nếu user chưa tồn tại, tạo mới
        if (!userData) {
            console.log('Creating new user');
            userData = {
                username,
                score: 1000,
                levelMin: 0,
                photoUrl: "/src/images/suit.png",
                lastUpdated: new Date().toISOString(),
                referrer: referrerCode, // Set referrer ngay khi tạo mới
                referralCode: username,
                totalRefEarnings: 0
            };
            await setDoc(doc(db, "DataXRP", username), userData);
            console.log('Created new user with referrer');
            return true;
        }

        // Nếu user đã tồn tại và đã có người giới thiệu
        if (userData.referrer) {
            console.log('User already has referrer:', userData.referrer);
            return false;
        }

        const referrer = await getUserScore(referrerCode);
        console.log('Referrer data:', referrer);

        if (!referrer) {
            console.log('Referrer does not exist in database');
            return false;
        }

        // Cập nhật thông tin người được giới thiệu
        const updatedUserData = {
            ...userData,
            referrer: referrerCode,
            totalRefEarnings: 0
        };
        console.log('Updating user data with:', updatedUserData);

        await setDoc(doc(db, "DataXRP", username), updatedUserData);
        console.log('Successfully set referrer');
        return true;
    } catch (error) {
        console.error("Error setting referrer:", error);
        return false;
    }
};

export const processReferralReward = async (referral: string, amount: number): Promise<void> => {
    try {
        console.log('Processing referral reward for:', referral, 'Amount:', amount);

        // Lấy thông tin người được giới thiệu
        const referralUser = await getUserScore(referral);
        console.log('Referral user data:', referralUser);

        if (!referralUser?.referrer) {
            console.log('User has no referrer, skipping reward');
            return;
        }

        // Tính toán phần thưởng (5% earnings) cho người giới thiệu trực tiếp
        const reward = Math.floor(amount * 0.05);
        console.log('Calculated reward for direct referrer:', reward);

        // Cập nhật số dư và tổng thu nhập từ ref cho người giới thiệu trực tiếp
        const directReferrer = await getUserScore(referralUser.referrer);
        console.log('Direct referrer data before update:', directReferrer);

        if (directReferrer) {
            const currentRefEarnings = directReferrer.totalRefEarnings || 0;
            const updatedReferrerData: UserScore = {
                ...directReferrer,
                score: directReferrer.score + reward,
                totalRefEarnings: currentRefEarnings + reward,
                lastUpdated: new Date().toISOString()
            };
            console.log('Updating direct referrer data with:', updatedReferrerData);

            await setDoc(doc(db, "DataXRP", referralUser.referrer), updatedReferrerData);

            // Verify update
            const updatedReferrer = await getUserScore(referralUser.referrer);
            console.log('Direct referrer data after update:', updatedReferrer);
            console.log('Successfully processed referral reward for direct referrer. Previous totalRefEarnings:', currentRefEarnings, 'New totalRefEarnings:', updatedReferrer?.totalRefEarnings);
        } else {
            console.log('Direct referrer not found in database');
        }
    } catch (error) {
        console.error("Error processing referral reward:", error);
    }
};

export const handleStartParameter = (): string | null => {
    try {
        const tg = window.Telegram?.WebApp;
        console.log('Telegram WebApp:', tg);

        // Kiểm tra start_param từ initDataUnsafe
        if (tg?.initDataUnsafe?.start_param) {
            console.log('Found start_param in initDataUnsafe:', tg.initDataUnsafe.start_param);
            return tg.initDataUnsafe.start_param;
        }

        // Kiểm tra URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const startCommand = urlParams.get('command');
        const startParam = urlParams.get('parameter');

        if (startCommand === 'start' && startParam) {
            console.log('Found start parameter in URL:', startParam);
            return startParam;
        }

        // Kiểm tra localStorage
        const savedCode = localStorage.getItem('referral_code');
        if (savedCode) {
            console.log('Found saved referral code:', savedCode);
            localStorage.removeItem('referral_code');
            return savedCode;
        }

        return null;
    } catch (error) {
        console.error('Error handling start parameter:', error);
        return null;
    }
};

export const saveReferralCode = (code: string): boolean => {
    try {
        localStorage.setItem('referral_code', code);
        console.log('Saved referral code to localStorage:', code);
        return true;
    } catch (error) {
        console.error('Error saving referral code:', error);
        return false;
    }
};