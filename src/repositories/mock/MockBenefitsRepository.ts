import type { BenefitsRepository } from '@/src/repositories/interfaces/BenefitsRepository';
import type { Benefit, InsuranceInfo, Result } from '@/src/types';

import { mockStore } from './MockStore';
import { err, ok, UNAUTHORIZED } from './result';
import { withMockLatency } from './withMockLatency';

export class MockBenefitsRepository implements BenefitsRepository {
  async getBenefits(): Promise<Result<Benefit[]>> {
    return withMockLatency(() => {
      if (!mockStore.getState().session) {
        return err(UNAUTHORIZED);
      }
      return ok([...mockStore.getState().benefits]);
    });
  }

  async getInsurance(): Promise<Result<InsuranceInfo | null>> {
    return withMockLatency(() => {
      if (!mockStore.getState().session) {
        return err(UNAUTHORIZED);
      }
      return ok({ ...mockStore.getState().insurance });
    });
  }
}
