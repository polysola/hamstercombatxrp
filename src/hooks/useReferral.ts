import { useState, useEffect, useCallback } from 'react';
import { getReferrals } from '../services/userService';
import { ReferralUser, APIReferralUser } from '../types/user';

export const useReferral = (username: string | undefined) => {
    const [referrals, setReferrals] = useState<ReferralUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateAPIResponse = (data: unknown): data is APIReferralUser[] => {
        if (!Array.isArray(data)) return false;
        return data.every(item =>
            typeof item === 'object' &&
            item !== null &&
            typeof (item as any).username === 'string' &&
            typeof (item as any).score === 'number' &&
            typeof (item as any).levelMin === 'number' &&
            typeof (item as any).lastUpdated === 'string' &&
            typeof (item as any).referralCode === 'string' &&
            typeof (item as any).totalRefEarnings === 'number'
        );
    };

    const processReferralData = (data: APIReferralUser[]): ReferralUser[] => {
        console.log('Processing referral data:', data);

        // Tạo map để theo dõi ai giới thiệu ai
        const referralMap = new Map<string, string[]>();
        data.forEach(user => {
            if (user.referrer) {
                const referrerRefs = referralMap.get(user.referrer) || [];
                referrerRefs.push(user.username);
                referralMap.set(user.referrer, referrerRefs);
            }
        });

        console.log('Referral map:', Object.fromEntries(referralMap));

        return data.map(user => {
            const referrals = referralMap.get(user.username) || [];
            const referralCount = referrals.length;

            // Tính toán earnings từ referrals trực tiếp
            const earnedFromRef = user.totalRefEarnings || 0;
            console.log(`User ${user.username} base earnings:`, earnedFromRef);

            // Tính tổng earnings (bao gồm cả bonus)
            let totalEarned = earnedFromRef;

            // Nếu người này có referrals, tính thêm bonus từ điểm của người được giới thiệu
            if (referralCount > 0) {
                console.log(`Calculating bonus for ${user.username}'s referrals:`, referrals);
                const referralScores = referrals.reduce((sum, refUsername) => {
                    const refUser = data.find(u => u.username === refUsername);
                    const score = refUser?.score || 0;
                    console.log(`Referral ${refUsername} score:`, score);
                    return sum + score;
                }, 0);

                // Bonus là 5% từ điểm của mỗi người được giới thiệu
                const bonus = Math.floor(referralScores * 0.05);
                console.log(`Calculated bonus for ${user.username}:`, bonus);
                totalEarned += bonus;
            }

            console.log(`User ${user.username} final stats:`, {
                referralCount,
                earnedFromRef,
                totalEarned,
                referrals,
                totalRefEarnings: user.totalRefEarnings,
                score: user.score
            });

            return {
                ...user,
                earnedFromRef,
                referrals,
                referralCount,
                totalEarned
            };
        });
    };

    const fetchReferrals = useCallback(async () => {
        if (!username) {
            console.log('No username provided');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            console.log('Fetching referrals for:', username);
            const rawData = await getReferrals(username);
            console.log('Raw API data:', rawData);

            if (!validateAPIResponse(rawData)) {
                console.error('Invalid data format:', rawData);
                throw new Error('Invalid data format from API');
            }

            // Xử lý dữ liệu và tính toán earnings
            const processedData = processReferralData(rawData);

            // Sắp xếp theo earnings từ cao đến thấp
            processedData.sort((a, b) => b.totalEarned - a.totalEarned);

            console.log('Final processed data:', processedData);

            setReferrals(processedData);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch referrals';
            console.error('Error in fetchReferrals:', errorMessage, err);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [username]);

    useEffect(() => {
        fetchReferrals();
    }, [fetchReferrals]);

    // Tính tổng số liệu thống kê
    const totalStats = referrals.reduce((acc, user) => ({
        totalReferrals: acc.totalReferrals + user.referralCount,
        totalEarnings: acc.totalEarnings + user.totalEarned,
        directReferrals: acc.directReferrals + 1
    }), {
        totalReferrals: 0,
        totalEarnings: 0,
        directReferrals: 0
    });

    return {
        referrals,
        isLoading,
        error,
        refetch: fetchReferrals,
        stats: totalStats
    };
}; 