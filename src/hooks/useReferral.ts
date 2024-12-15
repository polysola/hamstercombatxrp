import { useState, useEffect, useCallback } from 'react';
import { getReferrals } from '../services/userService';
import { ReferralUser, APIReferralUser } from '../types/user';

export const useReferral = (username: string | undefined) => {
    const [referrals, setReferrals] = useState<ReferralUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateAPIResponse = (data: any): data is APIReferralUser[] => {
        if (!Array.isArray(data)) return false;
        return data.every(item =>
            typeof item === 'object' &&
            typeof item.username === 'string' &&
            typeof item.score === 'number' &&
            typeof item.levelMin === 'number' &&
            typeof item.lastUpdated === 'string' &&
            typeof item.referralCode === 'string' &&
            typeof item.totalRefEarnings === 'number'
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

            // Tính tổng earnings (bao gồm cả bonus)
            let totalEarned = earnedFromRef;

            // Nếu người này có referrals, tính thêm bonus từ điểm của người được giới thiệu
            if (referralCount > 0) {
                const referralScores = referrals.reduce((sum, refUsername) => {
                    const refUser = data.find(u => u.username === refUsername);
                    return sum + (refUser?.score || 0);
                }, 0);

                // Bonus là 5% từ điểm của mỗi người được giới thiệu
                const bonus = Math.floor(referralScores * 0.05);
                totalEarned += bonus;
            }

            console.log(`User ${user.username} stats:`, {
                referralCount,
                earnedFromRef,
                totalEarned,
                referrals,
                totalRefEarnings: user.totalRefEarnings
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