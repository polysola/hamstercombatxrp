import { db } from "../config/firebase";
import { 
    collection, 
    doc, 
    getDoc, 
    setDoc, 
    query, 
    orderBy, 
    limit, 
    getDocs, 
    where, 
    increment,
    runTransaction
} from "firebase/firestore";

export interface UserScore {
    score: number;
    username: string;
    photoUrl?: string;
    lastUpdated?: string;
    referrer?: string;
    isPremium?: boolean;
}

const COLLECTION_NAME = "DataXRP";

export const saveUserScore = async (username: string, score: number, _minPoints?: number, photoUrl?: string): Promise<void> => {
    try {
        const userRef = doc(db, COLLECTION_NAME, username);
        const userData: Partial<UserScore> = {
            username,
            score,
            lastUpdated: new Date().toISOString()
        };

        if (photoUrl) {
            userData.photoUrl = photoUrl;
        }

        await setDoc(userRef, userData, { merge: true });
        console.log(`Saved score ${score} for user ${username}`);
    } catch (error) {
        console.error("Error saving user score:", error);
    }
};

export const getUserScore = async (username: string): Promise<UserScore | null> => {
    try {
        const userRef = doc(db, COLLECTION_NAME, username);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            return userDoc.data() as UserScore;
        }
        return null;
    } catch (error) {
        console.error("Error getting user score:", error);
        return null;
    }
};

export const getLeaderboard = async (limitCount: number = 10): Promise<{ username: string; score: number; photoUrl?: string }[]> => {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            orderBy("score", "desc"),
            limit(limitCount)
        );

        const querySnapshot = await getDocs(q);
        const leaderboard: { username: string; score: number; photoUrl?: string }[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const uname = data.username || doc.id;

            leaderboard.push({
                username: uname,
                score: data.score || 0,
                photoUrl: data.photoUrl || undefined
            });
        });

        return leaderboard;
    } catch (error) {
        console.error("Error getting leaderboard:", error);
        return [];
    }
};

export const getReferrals = async (username: string): Promise<{ username: string; score: number }[]> => {
    try {
        console.log('Fetching referrals for user:', username);
        
        const q = query(
            collection(db, COLLECTION_NAME),
            where("referrer", "==", username)
        );

        const querySnapshot = await getDocs(q);
        console.log('Query snapshot size:', querySnapshot.size);

        const referrals: { username: string; score: number }[] = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log('Found referral doc:', doc.id, data);
            referrals.push({
                username: data.username || doc.id,
                score: data.score || 0
            });
        });

        const currentUserDoc = await getUserScore(username);
        console.log('Current user doc:', currentUserDoc);

        const result = [
            {
                username: username,
                score: currentUserDoc?.score || 0
            },
            ...referrals
        ];

        console.log('Final referrals result:', result);
        return result;
    } catch (error) {
        console.error("Error getting referrals:", error);
        return [];
    }
};

export const setReferrer = async (username: string, referrerCode: string): Promise<boolean> => {
    try {
        console.log('Setting referrer - Username:', username, 'Referrer code:', referrerCode);

        // Check if user is trying to refer themselves
        if (username.toLowerCase() === referrerCode.toLowerCase()) {
            console.log('Cannot refer yourself');
            return false;
        }

        let userData = await getUserScore(username);
        console.log('Current user data:', userData);

        // Check for referral loop
        const checkReferrerChain = async (startUser: string, targetUser: string): Promise<boolean> => {
            let currentUser = startUser;
            const visited = new Set<string>();

            while (currentUser) {
                if (visited.has(currentUser)) return false; // Cycle detected
                if (currentUser.toLowerCase() === targetUser.toLowerCase()) return false; // Target found in chain

                visited.add(currentUser);
                const userDoc = await getUserScore(currentUser);
                currentUser = userDoc?.referrer || '';
            }
            return true;
        };

        // Validate referrer chain
        const isValidReferrer = await checkReferrerChain(referrerCode, username);
        if (!isValidReferrer) {
            console.log('Invalid referrer: referral loop detected');
            return false;
        }

        const referrerDoc = await getUserScore(referrerCode);
        if (!referrerDoc) {
            console.log('Referrer code does not exist:', referrerCode);
            return false;
        }

        // Run atomic transaction to add referrer and reward both users
        await runTransaction(db, async (transaction) => {
            const userRef = doc(db, COLLECTION_NAME, username);
            const userDoc = await transaction.get(userRef);

            if (userDoc.exists() && userDoc.data().referrer) {
                console.log('User already has a referrer');
                return false;
            }

            const referrerRef = doc(db, COLLECTION_NAME, referrerCode);

            // Award referral bonus (+2500 EGG points)
            const bonusPoints = 2500;

            if (userDoc.exists()) {
                transaction.update(userRef, {
                    referrer: referrerCode,
                    score: increment(bonusPoints)
                });
            } else {
                transaction.set(userRef, {
                    username,
                    score: bonusPoints,
                    referrer: referrerCode,
                    lastUpdated: new Date().toISOString()
                });
            }

            transaction.update(referrerRef, {
                score: increment(bonusPoints)
            });
        });

        console.log('Referrer set successfully and bonus points awarded');
        return true;

    } catch (error) {
        console.error('Error setting referrer:', error);
        return false;
    }
};

export const checkAndUpdateOfflinePoints = async (username: string): Promise<number> => {
    try {
        const userRef = doc(db, COLLECTION_NAME, username);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            return 0;
        }

        const data = userDoc.data() as UserScore;
        if (!data.lastUpdated) {
            return 0;
        }

        const lastUpdated = new Date(data.lastUpdated).getTime();
        const now = new Date().getTime();
        const diffInSeconds = Math.floor((now - lastUpdated) / 1000);

        if (diffInSeconds < 10) {
            return 0;
        }

        const MAX_OFFLINE_SECONDS = 3 * 3600; // Cap at 3 hours max
        const actualOfflineSeconds = Math.min(diffInSeconds, MAX_OFFLINE_SECONDS);

        const PROFIT_PER_HOUR = 1200;
        const offlinePoints = Math.floor((actualOfflineSeconds * PROFIT_PER_HOUR) / 3600);

        if (offlinePoints > 0) {
            const newScore = (data.score || 0) + offlinePoints;
            await setDoc(userRef, {
                score: newScore,
                lastUpdated: new Date().toISOString()
            }, { merge: true });

            return offlinePoints;
        }

        return 0;
    } catch (error) {
        console.error("Error checking offline points:", error);
        return 0;
    }
};

export const updateLastActiveTime = async (username: string): Promise<void> => {
    try {
        const userRef = doc(db, COLLECTION_NAME, username);
        await setDoc(userRef, {
            lastUpdated: new Date().toISOString()
        }, { merge: true });
    } catch (error) {
        console.error("Error updating last active time:", error);
    }
};

export const resetOfflinePoints = async (username: string): Promise<void> => {
    try {
        const userRef = doc(db, COLLECTION_NAME, username);
        await setDoc(userRef, {
            lastUpdated: new Date().toISOString()
        }, { merge: true });
    } catch (error) {
        console.error("Error resetting offline points:", error);
    }
};

export const saveUserScoreImmediate = async (username: string, score: number, photoUrl?: string): Promise<void> => {
    try {
        const userRef = doc(db, COLLECTION_NAME, username);
        const updateData: any = {
            username,
            score,
            lastUpdated: new Date().toISOString()
        };
        if (photoUrl) {
            updateData.photoUrl = photoUrl;
        }
        await setDoc(userRef, updateData, { merge: true });
    } catch (error) {
        console.error("Error saving score immediately:", error);
    }
};