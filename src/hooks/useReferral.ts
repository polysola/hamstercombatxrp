import { useState, useEffect } from 'react';
import { getReferrals } from '../services/userService';
import { ReferralUser, APIReferralUser } from '../types/user';

export const useReferral = (username: string | undefined) => {
    const [referrals, setReferrals] = useState<ReferralUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const calculateTotalEarnings = (user: APIReferralUser): number => {
        // Tính tổng thu nhập từ referral trực tiếp
        const directEarnings = user.earnedFromRef || 0;
        // Tổng thu nhập từ hệ thống (bao gồm cả ref cấp 2)
        const systemEarnings = user.totalEarned || 0;
        return systemEarnings > directEarnings ? systemEarnings : directEarnings;
    };

    const fetchReferrals = async () => {
        if (!username) return;

        setIsLoading(true);
        setError(null);

        try {
            const data = await getReferrals(username);
            // Map dữ liệu API sang định dạng ReferralUser
            const mappedData: ReferralUser[] = (data as APIReferralUser[]).map(user => {
                const totalEarned = calculateTotalEarnings(user);
                return {
                    username: user.username,
                    score: user.score,
                    photoUrl: user.photoUrl,
                    earnedFromRef: user.earnedFromRef || 0,
                    totalRefEarnings: totalEarned,
                    lastUpdated: user.lastUpdated || new Date().toISOString(),
                    referrals: user.referrals || [],
                    referralCount: user.referrals?.length || 0,
                    totalEarned: totalEarned
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

    return {
        referrals,
        isLoading,
        error,
        refetch: fetchReferrals,
        totalReferrals: referrals.reduce((sum, user) => sum + user.referralCount, 0),
        totalEarnings: referrals.reduce((sum, user) => sum + user.totalEarned, 0)
    };
}; 