import { useState, useEffect } from 'react';
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
        // Tính toán thu nhập trực tiếp từ người được giới thiệu
        const directEarnings = user.earnedFromRef || 0;

        // Tính số lượng người được giới thiệu (bao gồm cả cấp 2)
        const referralCount = (user.referrals?.length || 0);

        // Tính tổng thu nhập (bao gồm cả thu nhập từ cấp 2)
        const totalEarned = user.totalEarned || directEarnings;

        return {
            earnedFromRef: directEarnings,
            totalEarned,
            referralCount
        };
    };

    const fetchReferrals = async () => {
        if (!username) return;

        setIsLoading(true);
        setError(null);

        try {
            const data = await getReferrals(username);
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
    };

    useEffect(() => {
        fetchReferrals();
    }, [username]);

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