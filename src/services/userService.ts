import { db } from '../config/firebase';
import { doc, setDoc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

interface UserScore {
    username: string;
    score: number;
    levelMin: number;
    lastUpdated: string;
    photoUrl?: string;
}

export const saveUserScore = async (
    username: string,
    score: number,
    levelMin: number
) => {
    try {
        const tg = window.Telegram?.WebApp;
        const photoUrl = tg?.initDataUnsafe?.user?.photo_url;

        // Get existing user data first
        const existingData = await getUserScore(username);

        const userData: UserScore = {
            username,
            score,
            levelMin,
            photoUrl: photoUrl || existingData?.photoUrl || "/src/images/suit.png",
            lastUpdated: new Date().toISOString()
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