export interface ReferralUser {
    username: string;
    score: number;
    photoUrl?: string;
    totalRefEarnings: number;
    earnedFromRef?: number;
    lastUpdated?: string;
    referralCode?: string;
    referrer?: string;
} 