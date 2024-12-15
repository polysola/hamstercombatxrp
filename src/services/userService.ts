import { db } from '../config/firebase';
import { doc, setDoc, getDoc, collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';

interface UserScore {
    username: string;
    score: number;
    levelMin: number;
    lastUpdated: string;
    photoUrl?: string;
    referrer?: string;  // người giới thiệu
    referralCode: string;  // mã giới thiệu
    totalRefEarnings: number;  // tổng thu nhập từ ref
}


export const saveUserScore = async (
    username: string,
    score: number,
    levelMin: number
) => {
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

export const getLeaderboard = async (limitCount: number = 10) => {
    try {
        const q = query(
            collection(db, "DataXRP"),
            orderBy("score", "desc"),
            limit(limitCount)
        );

        const querySnapshot = await getDocs(q);
        const leaderboard = querySnapshot.docs.map(doc => {
            const data = doc.data();
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

export const getReferrals = async (username: string) => {
    try {
        const q = query(
            collection(db, "DataXRP"),
            where("referrer", "==", username),
            orderBy("totalRefEarnings", "desc")
        );

        const querySnapshot = await getDocs(q);
        const referrals = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                username: data.username,
                score: data.score,
                photoUrl: data.photoUrl,
                earnedFromRef: data.totalRefEarnings
            };
        });

        return referrals;
    } catch (error) {
        console.error("Error getting referrals:", error);
        return [];
    }
};

export const setReferrer = async (username: string, referrerCode: string) => {
    try {
        const userData = await getUserScore(username);
        if (!userData || userData.referrer) return false;  // Đã có người giới thiệu

        const referrer = await getUserScore(referrerCode);
        if (!referrer) return false;  // Người giới thiệu không tồn tại

        // Cập nhật thông tin người được giới thiệu
        await setDoc(doc(db, "DataXRP", username), {
            ...userData,
            referrer: referrerCode,
            totalRefEarnings: 0
        });

        return true;
    } catch (error) {
        console.error("Error setting referrer:", error);
        return false;
    }
};

export const processReferralReward = async (referral: string, amount: number) => {
    try {
        // Lấy thông tin người được giới thiệu
        const referralUser = await getUserScore(referral);
        if (!referralUser?.referrer) return;

        // Tính toán phần thưởng (5% earnings)
        const reward = Math.floor(amount * 0.05);

        // Cập nhật số dư và tổng thu nhập từ ref cho người giới thiệu
        const referrer = await getUserScore(referralUser.referrer);
        if (referrer) {
            await setDoc(doc(db, "DataXRP", referralUser.referrer), {
                ...referrer,
                score: referrer.score + reward,
                totalRefEarnings: (referrer.totalRefEarnings || 0) + reward
            });
        }
    } catch (error) {
        console.error("Error processing referral reward:", error);
    }
};