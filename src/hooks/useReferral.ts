import { useState, useEffect } from 'react';
import { getReferrals } from '../services/userService';
import type { ReferralUser } from '../types/user';

export const useReferral = (username: string | undefined) => {
    const [referrals, setReferrals] = useState<ReferralUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReferrals = async () => {
            if (!username) return;

            setIsLoading(true);
            try {
                const data = await getReferrals(username);
                setReferrals(data);
            } catch (error) {
                console.error('Error fetching referrals:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReferrals();
        const interval = setInterval(fetchReferrals, 30000);

        return () => clearInterval(interval);
    }, [username]);

    return { referrals, isLoading };
}; 