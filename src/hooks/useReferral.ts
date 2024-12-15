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
        // Tính toán thu nhập trực tiếp từ người được giới thiệu (5% mỗi người)
        const directEarnings = user.earnedFromRef || 0;

        // Tính số lượng người được giới thiệu
        const referralCount = user.referrals?.length || 0;

        // Tính tổng thu nhập (bao gồm cả thu nhập từ cấp 2)
        // Nếu API trả về totalEarned thì dùng, không thì tính từ earnedFromRef
        let totalEarned = user.totalEarned || 0;

        // Nếu không có totalEarned từ API, tính dựa trên earnedFromRef
        if (!totalEarned && directEarnings) {
            // Cộng thêm 2% cho mỗi ref cấp 2
            const level2Bonus = (referralCount * directEarnings * 0.02);
            totalEarned = directEarnings + level2Bonus;
        }

        return {
            earnedFromRef: directEarnings,
            totalEarned: totalEarned || directEarnings, // Fallback to directEarnings if both are 0
            referralCount
        };
    };

    const fetchReferrals = useCallback(async () => {
        if (!username) return;

        setIsLoading(true);
        setError(null);

        try {
            const data = await getReferrals(username);
            if (!Array.isArray(data)) {
                throw new Error('Invalid data format from API');
            }

            // Map dữ liệu API sang định dạng ReferralUser
            const mappedData: ReferralUser[] = (data as APIReferralUser[]).map(user => {
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

            // Sắp xếp theo tổng thu nhập từ cao đến thấp
            mappedData.sort((a, b) => b.totalEarned - a.totalEarned);

            setReferrals(mappedData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch referrals');
            console.error('Error fetching referrals:', err);
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