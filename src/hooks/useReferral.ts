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

        if (data.length === 0) return [];

        // Tách người giới thiệu và danh sách được giới thiệu
        const [currentUser, ...referralUsers] = data;
        console.log('Current user:', currentUser);
        console.log('Referral users:', referralUsers);

        // Tạo map để theo dõi ai giới thiệu ai
        const referralMap = new Map<string, string[]>();
        referralUsers.forEach(user => {
            if (user.referrer) {
                const referrerRefs = referralMap.get(user.referrer) || [];
                referrerRefs.push(user.username);
                referralMap.set(user.referrer, referrerRefs);
            }
        });

        console.log('Referral map:', Object.fromEntries(referralMap));

        // Xử lý thông tin người giới thiệu
        const currentUserReferrals = referralMap.get(currentUser.username) || [];
        const currentUserResult: ReferralUser = {
            ...currentUser,
            earnedFromRef: currentUser.totalRefEarnings || 0,
            referrals: currentUserReferrals,
            referralCount: currentUserReferrals.length,
            totalEarned: currentUser.totalRefEarnings || 0
        };

        console.log('Current user final stats:', {
            referralCount: currentUserResult.referralCount,
            earnedFromRef: currentUserResult.earnedFromRef,
            totalEarned: currentUserResult.totalEarned,
            referrals: currentUserResult.referrals,
            totalRefEarnings: currentUserResult.totalRefEarnings,
            score: currentUserResult.score
        });

        // Xử lý thông tin người được giới thiệu
        const referralResults = referralUsers.map(user => {
            const userReferrals = referralMap.get(user.username) || [];
            return {
                ...user,
                earnedFromRef: user.totalRefEarnings || 0,
                referrals: userReferrals,
                referralCount: userReferrals.length,
                totalEarned: user.totalRefEarnings || 0
            };
        });

        // Kết hợp kết quả
        return [currentUserResult, ...referralResults];
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