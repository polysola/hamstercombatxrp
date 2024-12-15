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
        console.log('Setting referrer - Username:', username, 'Referrer code:', referrerCode);

        // Kiểm tra nếu người dùng tự giới thiệu chính mình
        if (username === referrerCode) {
            console.log('Cannot refer yourself');
            return false;
        }

        const userData = await getUserScore(username);
        console.log('Current user data:', userData);

        if (!userData) {
            console.log('User does not exist in database');
            return false;
        }

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

export const processReferralReward = async (referral: string, amount: number) => {
    try {
        console.log('Processing referral reward for:', referral, 'Amount:', amount);

        // Lấy thông tin người được giới thiệu
        const referralUser = await getUserScore(referral);
        console.log('Referral user data:', referralUser);

        if (!referralUser?.referrer) {
            console.log('User has no referrer, skipping reward');
            return;
        }

        // Tính toán phần thưởng (5% earnings)
        const reward = Math.floor(amount * 0.05);
        console.log('Calculated reward:', reward);

        // Cập nhật số dư và tổng thu nhập từ ref cho người giới thiệu
        const referrer = await getUserScore(referralUser.referrer);
        console.log('Referrer data:', referrer);

        if (referrer) {
            const updatedReferrerData = {
                ...referrer,
                score: referrer.score + reward,
                totalRefEarnings: (referrer.totalRefEarnings || 0) + reward
            };
            console.log('Updating referrer data with:', updatedReferrerData);

            await setDoc(doc(db, "DataXRP", referralUser.referrer), updatedReferrerData);
            console.log('Successfully processed referral reward');
        } else {
            console.log('Referrer not found in database');
        }
    } catch (error) {
        console.error("Error processing referral reward:", error);
    }
};