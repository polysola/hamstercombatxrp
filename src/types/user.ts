// Interface cho dữ liệu trả về từ API
export interface APIReferralUser {
    username: string;
    score: number;
    photoUrl?: string;
    earnedFromRef: number;
}

// Interface cho dữ liệu đã được xử lý
export interface ReferralUser {
    username: string;
    score: number;
    photoUrl?: string;
    earnedFromRef: number;
    totalRefEarnings: number;
} 