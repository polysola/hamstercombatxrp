// Interface cho dữ liệu từ database
export interface UserScore {
    username: string;
    score: number;
    levelMin: number;
    lastUpdated: string;
    photoUrl?: string;
    referrer?: string;  // người giới thiệu
    referralCode: string;  // mã giới thiệu
    totalRefEarnings: number;  // tổng thu nhập từ ref
}

// Interface cho dữ liệu trả về từ API getReferrals
export interface APIReferralUser extends UserScore {
    earnedFromRef?: number;
}

// Interface cho dữ liệu đã được xử lý để hiển thị
export interface ReferralUser extends APIReferralUser {
    earnedFromRef: number;  // Chuyển từ optional sang required
    referrals: string[];    // Danh sách người được giới thiệu
    referralCount: number;  // Số lượng người được giới thiệu
    totalEarned: number;    // Tổng thu nhập (bao gồm cả bonus)
} 