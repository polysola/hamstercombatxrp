import { useState, useEffect, useCallback } from 'react';
import { getReferrals } from '../services/userService';
import { ReferralUser, APIReferralUser } from '../types/user';

export const useReferral = (username: string | undefined) => {
    const [referrals, setReferrals] = useState<ReferralUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const calculateEarnings = (user: APIReferralUser): {
        earnedFromRef: number;
        totalEarned: number;
        referralCount: number;
    } => {
        console.log('Calculating earnings for user:', user.username);

        // Tính toán thu nhập trực tiếp từ người được giới thiệu (5% mỗi người)
        const directEarnings = user.earnedFromRef || 0;
        console.log('Direct earnings:', directEarnings);

        // Tính số lượng người được giới thiệu
        const referralCount = user.referrals?.length || 0;
        console.log('Referral count:', referralCount);

        // Tính tổng thu nhập (bao gồm cả thu nhập từ cấp 2)
        let totalEarned = directEarnings;

        // Nếu có referrals, tính thêm bonus
        if (referralCount > 0) {
            // Mỗi người giới thiệu được 5% từ người được giới thiệu
            const referralBonus = directEarnings * 0.05 * referralCount;
            totalEarned += referralBonus;
            console.log('Referral bonus:', referralBonus);
        }

        console.log('Total earned:', totalEarned);

        return {
            earnedFromRef: directEarnings,
            totalEarned,
            referralCount
        };
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

            console.log('Raw referral data:', data);

            // Map dữ liệu API sang định dạng ReferralUser
            const mappedData: ReferralUser[] = (data as APIReferralUser[]).map(user => {
                console.log('Processing user:', user.username);
                const earnings = calculateEarnings(user);

                return {
                    username: user.username,
                    score: user.score,
                    photoUrl: user.photoUrl,
                    earnedFromRef: earnings.earnedFromRef,
                    totalRefEarnings: earnings.totalEarned,
                    lastUpdated: user.lastUpdated || new Date().toISOString(),
                    referrals: user.referrals || [],
                    referralCount: earnings.referralCount,
                    totalEarned: earnings.totalEarned,
                    referrer: user.referrer
                };
            });

            console.log('Processed referral data:', mappedData);

            // Sắp xếp theo tổng thu nhập từ cao đến thấp
            mappedData.sort((a, b) => b.totalEarned - a.totalEarned);

            setReferrals(mappedData);
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

    // Tính tổng số người được giới thiệu và tổng thu nhập
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