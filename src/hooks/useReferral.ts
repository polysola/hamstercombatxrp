import { useState, useEffect } from 'react';
import { getReferrals } from '../services/userService';
import { ReferralUser } from '../types/user';

export const useReferral = (username: string | undefined) => {
    const [referrals, setReferrals] = useState<ReferralUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReferrals = async () => {
        if (!username) return;

        setIsLoading(true);
        setError(null);

        try {
            const data = await getReferrals(username);
            // Map dữ liệu API sang định dạng ReferralUser
            const mappedData: ReferralUser[] = data.map(user => ({
                username: user.username,
                score: user.score,
                photoUrl: user.photoUrl,
                earnedFromRef: user.earnedFromRef || 0,
                totalRefEarnings: user.earnedFromRef || 0, // Sử dụng earnedFromRef làm totalRefEarnings
                lastUpdated: user.lastUpdated,
                referralCode: user.referralCode,
                referrer: user.referrer
            }));
            setReferrals(mappedData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch referrals');
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
        refetch: fetchReferrals
    };
}; 