// Interface cho dữ liệu trả về từ API
export interface APIReferralUser {
    username: string;
    score: number;
    photoUrl?: string;
    earnedFromRef: number;
    lastUpdated?: string;
    referrals?: string[]; // Danh sách username của người được giới thiệu
    totalEarned?: number; // Tổng số tiền kiếm được từ ref (bao gồm cả ref cấp 2)
}

// Interface cho dữ liệu đã được xử lý
export interface ReferralUser {
    username: string;
    score: number;
    photoUrl?: string;
    earnedFromRef: number;
    totalRefEarnings: number;
    lastUpdated?: string;
    referrals: string[]; // Danh sách username của người được giới thiệu
    referralCount: number; // Số lượng người đã giới thiệu
    totalEarned: number; // Tổng số tiền kiếm được từ ref (bao gồm cả ref cấp 2)
} 