import type {
  PerformanceMetrics,
  PerformancePeriod,
  PerformanceTrendPoint,
  Result,
} from '@/src/types';

export interface PerformanceRepository {
  getMetrics(period?: PerformancePeriod): Promise<Result<PerformanceMetrics>>;
  getTrend(period?: PerformancePeriod): Promise<Result<PerformanceTrendPoint[]>>;
}
