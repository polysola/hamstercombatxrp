// Interface cho earnings từ mỗi referral
export interface ReferralEarning {
    username: string;
    amount: number;
    lastUpdated: string;
}

// Interface cho dữ liệu từ database
export interface UserScore {
    username: string;
    score: number;
    levelMin: number;
    lastUpdated: string;
    photoUrl?: string;
    referrer?: string;
    referralCode: string;
    totalRefEarnings: number;
    referralEarnings: { [key: string]: ReferralEarning };
}

// Interface cho dữ liệu trả về từ API getReferrals
export interface APIReferralUser extends UserScore {
    earnedFromRef?: number;
}

// Interface cho dữ liệu đã được xử lý để hiển thị
export interface ReferralUser extends APIReferralUser {
    earnedFromRef: number;
    referrals: string[];
    referralCount: number;
    totalEarned: number;
} 