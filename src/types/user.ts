// Interface cho earnings từ mỗi referral
export interface ReferralEarning {
    username: string;  // Username của người được giới thiệu
    amount: number;    // Số tiền kiếm được từ người này
    lastUpdated: string; // Thời gian cập nhật cuối
}

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
    referralEarnings: { [key: string]: ReferralEarning };  // chi tiết earnings từ từng người
}

// Interface cho dữ liệu trả về từ API getReferrals
export interface APIReferralUser extends UserScore {
    earnedFromRef?: number;  // Được tính từ totalRefEarnings
}

// Interface cho dữ liệu đã được xử lý để hiển thị
export interface ReferralUser extends APIReferralUser {
    earnedFromRef: number;  // Chuyển từ optional sang required
    referrals: string[];    // Danh sách người được giới thiệu
    referralCount: number;  // Số lượng người được giới thiệu
    totalEarned: number;    // Tổng thu nhập (bao gồm cả bonus)
} 