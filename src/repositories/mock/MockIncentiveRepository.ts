import type { IncentiveRepository } from '@/src/repositories/interfaces/IncentiveRepository';
import type { Incentive, Result } from '@/src/types';

import { mockStore } from './MockStore';
import { err, NOT_FOUND, ok, UNAUTHORIZED } from './result';
import { withMockLatency } from './withMockLatency';

export class MockIncentiveRepository implements IncentiveRepository {
  async getActive(): Promise<Result<Incentive[]>> {
    return withMockLatency(() => {
      if (!mockStore.getState().session) {
        return err(UNAUTHORIZED);
      }
      return ok(
        mockStore.getState().incentives.filter((i) => i.status === 'ACTIVE'),
      );
    });
  }

  async getAll(): Promise<Result<Incentive[]>> {
    return withMockLatency(() => {
      if (!mockStore.getState().session) {
        return err(UNAUTHORIZED);
      }
      return ok([...mockStore.getState().incentives]);
    });
  }

  async getById(id: string): Promise<Result<Incentive>> {
    return withMockLatency(() => {
      if (!mockStore.getState().session) {
        return err(UNAUTHORIZED);
      }
      const found = mockStore.getState().incentives.find((i) => i.id === id);
      if (!found) {
        return err(NOT_FOUND('Incentive', id));
      }
      return ok(found);
    });
  }
}
