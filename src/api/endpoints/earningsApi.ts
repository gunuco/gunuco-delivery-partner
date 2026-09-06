import { baseApi } from '@/src/api/baseApi';
import { mapResult } from '@/src/api/mapResult';
import { repositories } from '@/src/repositories/factory';
import type { EarningsFilter } from '@/src/repositories/interfaces';

export const earningsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getEarningsSummary: build.query({
      async queryFn() {
        const result = await repositories.earnings.getSummary();
        return mapResult(result);
      },
      providesTags: ['Earnings'],
    }),
    getEarningsBreakdown: build.query({
      async queryFn(orderId: string) {
        const result = await repositories.earnings.getBreakdown(orderId);
        return mapResult(result);
      },
      providesTags: (_result, _error, orderId) => [
        { type: 'Earnings', id: orderId },
      ],
    }),
    getDeliveryEarnings: build.query({
      async queryFn(filter?: EarningsFilter) {
        const result = await repositories.earnings.getDeliveryEarnings(filter);
        return mapResult(result);
      },
      providesTags: ['Earnings'],
    }),
    getPayouts: build.query({
      async queryFn() {
        const result = await repositories.earnings.getPayouts();
        return mapResult(result);
      },
      providesTags: ['Earnings'],
    }),
  }),
});

export const {
  useGetEarningsSummaryQuery,
  useGetEarningsBreakdownQuery,
  useGetDeliveryEarningsQuery,
  useGetPayoutsQuery,
} = earningsApi;
