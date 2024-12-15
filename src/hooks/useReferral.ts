import { useState, useEffect, useCallback } from 'react';
import { getReferrals } from '../services/userService';
import { ReferralUser, APIReferralUser } from '../types/user';

export const useReferral = (username: string | undefined) => {
    const [referrals, setReferrals] = useState<ReferralUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

            // Tính toán earnings
            const earnedFromRef = user.totalRefEarnings || 0;
            let totalEarned = earnedFromRef;

            // Nếu người này có referrals, tính thêm bonus
            if (referralCount > 0) {
                // Tìm tổng earnings từ những người được giới thiệu
                const referralEarnings = referrals.reduce((sum, refUsername) => {
                    const refUser = data.find(u => u.username === refUsername);
                    return sum + (refUser?.score || 0);
                }, 0);

                // Tính bonus (5% từ mỗi người được giới thiệu)
                const bonus = referralEarnings * 0.05;
                totalEarned += bonus;
            }

            console.log(`User ${user.username}:`, {
                referralCount,
                earnedFromRef,
                totalEarned,
                referrals
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
            const data = await getReferrals(username);

            if (!Array.isArray(data)) {
                console.error('Invalid data format:', data);
                throw new Error('Invalid data format from API');
            }

            console.log('Raw API data:', data);

            // Xử lý dữ liệu và tính toán earnings
            const processedData = processReferralData(data as APIReferralUser[]);

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