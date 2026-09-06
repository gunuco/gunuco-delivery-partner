import type { ReferralRepository } from '@/src/repositories/interfaces/ReferralRepository';
import type { Referral, ReferralEntry, Result } from '@/src/types';

import { mockStore } from './MockStore';
import { err, ok, UNAUTHORIZED } from './result';
import { withMockLatency } from './withMockLatency';

export class MockReferralRepository implements ReferralRepository {
  async getReferral(): Promise<Result<Referral>> {
    return withMockLatency(() => {
      if (!mockStore.getState().session) {
        return err(UNAUTHORIZED);
      }
      const referral = mockStore.getState().referral;
      return ok({
        ...referral,
        history: referral.history.map((h) => ({ ...h })),
      });
    });
  }

  async getHistory(): Promise<Result<ReferralEntry[]>> {
    return withMockLatency(() => {
      if (!mockStore.getState().session) {
        return err(UNAUTHORIZED);
      }
      return ok(mockStore.getState().referral.history.map((h) => ({ ...h })));
    });
  }
}
