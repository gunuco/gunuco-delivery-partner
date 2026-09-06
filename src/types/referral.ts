/** GUNUCO partner referral program domain types */

export type ReferralEntryStatus = 'PENDING' | 'JOINED' | 'REWARDED';

export interface ReferralEntry {
  id: string;
  inviteeName: string;
  status: ReferralEntryStatus;
  rewardPaise?: number;
  createdAt: string;
}

export interface Referral {
  id: string;
  code: string;
  invitedCount: number;
  rewardedCount: number;
  totalRewardPaise: number;
  history: ReferralEntry[];
}
