export interface ReferralUser {
    username: string;
    score: number;
    photoUrl?: string;
    earnedFromRef: number;
    totalRefEarnings?: number;
    lastUpdated?: string;
    referralCode?: string;
    referrer?: string;
} 