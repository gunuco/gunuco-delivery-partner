import {
  useGetPerformanceMetricsQuery,
  useGetPerformanceTrendQuery,
} from '@/src/api/endpoints/performanceApi';
import { useAppSelector } from '@/src/store/hooks';
import type { PerformancePeriod } from '@/src/types';

/**
 * Partner performance metrics and trend.
 */
export function usePerformance(period: PerformancePeriod = 'WEEK') {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const metricsQuery = useGetPerformanceMetricsQuery(period, {
    skip: !isAuthenticated,
  });
  const trendQuery = useGetPerformanceTrendQuery(period, {
    skip: !isAuthenticated,
  });

  return {
    metrics: metricsQuery.data,
    trend: trendQuery.data ?? [],
    isLoading: metricsQuery.isLoading || trendQuery.isLoading,
    isFetching: metricsQuery.isFetching || trendQuery.isFetching,
    error: metricsQuery.error ?? trendQuery.error,
    refetch: async () => {
      await Promise.all([metricsQuery.refetch(), trendQuery.refetch()]);
    },
  };
}
