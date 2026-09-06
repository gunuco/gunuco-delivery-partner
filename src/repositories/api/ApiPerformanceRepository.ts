import type { PerformanceRepository } from '@/src/repositories/interfaces/PerformanceRepository';
import type {
  PerformanceMetrics,
  PerformancePeriod,
  PerformanceTrendPoint,
  Result,
} from '@/src/types';

import { apiClient } from './ApiClient';

function notConnected<T>(): Result<T> {
  return { ok: false, error: apiClient.notConnectedError() };
}

export class ApiPerformanceRepository implements PerformanceRepository {
  async getMetrics(
    _period?: PerformancePeriod,
  ): Promise<Result<PerformanceMetrics>> {
    return notConnected();
  }

  async getTrend(
    _period?: PerformancePeriod,
  ): Promise<Result<PerformanceTrendPoint[]>> {
    return notConnected();
  }
}
