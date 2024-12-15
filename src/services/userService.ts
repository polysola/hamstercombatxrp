import { db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface UserScore {
    username: string;
    score: number;
    levelMin: number;
    lastUpdated: string;
}

export const saveUserScore = async (
    username: string,
    score: number,
    levelMin: number
) => {
    try {
        const userData = {
            username,
            score,
            levelMin,
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