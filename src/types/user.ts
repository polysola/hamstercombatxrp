// Interface cho dữ liệu trả về từ API
export interface APIReferralUser {
    username: string;
    score: number;
    photoUrl?: string;
    levelMin: number;
    lastUpdated: string;
    referralCode: string;
    referrer?: string;
    totalRefEarnings: number;
}

// Interface cho dữ liệu đã được xử lý
export interface ReferralUser {
    username: string;
    score: number;
    photoUrl?: string;
    levelMin: number;
    lastUpdated: string;
    referralCode: string;
    referrer?: string;
    totalRefEarnings: number;
    earnedFromRef: number;
    referrals: string[];
    referralCount: number;
    totalEarned: number;
} 