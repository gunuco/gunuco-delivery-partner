import { baseApi } from '@/src/api/baseApi';
import { mapResult } from '@/src/api/mapResult';
import { repositories } from '@/src/repositories/factory';
import type { PerformancePeriod } from '@/src/types';

export const performanceApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPerformanceMetrics: build.query({
      async queryFn(period?: PerformancePeriod) {
        const result = await repositories.performance.getMetrics(period);
        return mapResult(result);
      },
      providesTags: ['Performance'],
    }),
    getPerformanceTrend: build.query({
      async queryFn(period?: PerformancePeriod) {
        const result = await repositories.performance.getTrend(period);
        return mapResult(result);
      },
      providesTags: ['Performance'],
    }),
  }),
});

export const {
  useGetPerformanceMetricsQuery,
  useGetPerformanceTrendQuery,
} = performanceApi;
