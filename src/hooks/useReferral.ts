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
            typeof (item as APIReferralUser).username === 'string' &&
            typeof (item as APIReferralUser).score === 'number' &&
            typeof (item as APIReferralUser).levelMin === 'number' &&
            typeof (item as APIReferralUser).lastUpdated === 'string' &&
            typeof (item as APIReferralUser).referralCode === 'string'
        );
    };

    const calculateEarningsFromReferrals = (referralEarnings: { [key: string]: ReferralUser } | undefined): number => {
        if (!referralEarnings) return 0;
        return Object.values(referralEarnings).reduce((total, earning) => total + (earning.amount || 0), 0);
    };

    const processReferralData = (data: APIReferralUser[]): ReferralUser[] => {
        console.log('Processing referral data:', data);

        if (data.length === 0) return [];

        // Tìm current user bằng username được truyền vào
        const currentUserIndex = data.findIndex(user => user.username === username);
        if (currentUserIndex === -1) {
            console.error('Could not find current user with username:', username);
            return data as ReferralUser[];
        }

        // Đưa current user lên đầu danh sách
        const currentUser = data[currentUserIndex];
        const otherUsers = data.filter((_, index) => index !== currentUserIndex);

        // Tạo map để theo dõi ai giới thiệu ai
        const referralMap = new Map<string, string[]>();
        otherUsers.forEach(user => {
            if (user.referrer) {
                const referrerRefs = referralMap.get(user.referrer) || [];
                referrerRefs.push(user.username);
                referralMap.set(user.referrer, referrerRefs);
            }
        });

        // Xử lý thông tin người giới thiệu
        const currentUserReferrals = referralMap.get(currentUser.username) || [];

        // Tính toán earnings từ referralEarnings của current user
        const currentUserEarnings = currentUser.totalRefEarnings || 0;

        const currentUserResult: ReferralUser = {
            ...currentUser,
            earnedFromRef: currentUserEarnings,
            referrals: currentUserReferrals,
            referralCount: currentUserReferrals.length,
            totalEarned: currentUserEarnings,
            referralEarnings: currentUser.referralEarnings || {}
        };

        // Xử lý thông tin người được giới thiệu
        const referralResults = otherUsers.map(user => {
            const userReferrals = referralMap.get(user.username) || [];
            const userEarnings = user.totalRefEarnings || 0;

            return {
                ...user,
                earnedFromRef: userEarnings,
                referrals: userReferrals,
                referralCount: userReferrals.length,
                totalEarned: userEarnings,
                referralEarnings: user.referralEarnings || {}
            };
        });

        // Kết hợp kết quả và sắp xếp theo earnings
        const result = [currentUserResult, ...referralResults];
        console.log('Final processed data:', result);
        return result;
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
        directReferrals: acc.directReferrals + (user.referrals.length > 0 ? 1 : 0)
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