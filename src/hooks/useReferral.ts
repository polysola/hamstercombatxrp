import { useState, useEffect } from 'react';
import { getReferrals } from '../services/userService';
import { ReferralUser, APIReferralUser } from '../types/user';

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
            const mappedData: ReferralUser[] = (data as APIReferralUser[]).map(user => ({
                username: user.username,
                score: user.score,
                photoUrl: user.photoUrl,
                earnedFromRef: user.earnedFromRef || 0,
                totalRefEarnings: user.earnedFromRef || 0 // Sử dụng earnedFromRef làm totalRefEarnings
            }));
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
        refetch: fetchReferrals
    };
}; 