import type { PerformanceRepository } from '@/src/repositories/interfaces/PerformanceRepository';
import type {
  PerformanceMetrics,
  PerformancePeriod,
  PerformanceTrendPoint,
  Result,
} from '@/src/types';

import { mockStore } from './MockStore';
import { err, ok, UNAUTHORIZED } from './result';
import { withMockLatency } from './withMockLatency';

export class MockPerformanceRepository implements PerformanceRepository {
  async getMetrics(
    period: PerformancePeriod = 'WEEK',
  ): Promise<Result<PerformanceMetrics>> {
    return withMockLatency(() => {
      if (!mockStore.getState().session) {
        return err(UNAUTHORIZED);
      }
      const base = mockStore.getState().performance;
      const scale =
        period === 'TODAY' ? 0.2 : period === 'MONTH' ? 3.5 : period === 'ALL' ? 12 : 1;
      return ok({
        ...base,
        period,
        ordersCompleted: Math.max(1, Math.round(base.ordersCompleted * scale)),
        distanceTravelledKm:
          Math.round(base.distanceTravelledKm * scale * 10) / 10,
      });
    });
  }

  async getTrend(
    period: PerformancePeriod = 'WEEK',
  ): Promise<Result<PerformanceTrendPoint[]>> {
    return withMockLatency(() => {
      if (!mockStore.getState().session) {
        return err(UNAUTHORIZED);
      }
      void period;
      return ok([...mockStore.getState().performanceTrend]);
    });
  }
}
