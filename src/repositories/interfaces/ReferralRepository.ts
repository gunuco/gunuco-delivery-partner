import type { Referral, ReferralEntry, Result } from '@/src/types';

export interface ReferralRepository {
  getReferral(): Promise<Result<Referral>>;
  getHistory(): Promise<Result<ReferralEntry[]>>;
}
