import {
  useGetDeliveryEarningsQuery,
  useGetEarningsBreakdownQuery,
  useGetEarningsSummaryQuery,
  useGetPayoutsQuery,
} from '@/src/api/endpoints/earningsApi';
import type { EarningsFilter } from '@/src/repositories/interfaces';
import { useAppSelector } from '@/src/store/hooks';

/**
 * Earnings summary, history, payouts, and per-order breakdown.
 */
export function useEarnings(filter?: EarningsFilter) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const summaryQuery = useGetEarningsSummaryQuery(undefined, {
    skip: !isAuthenticated,
  });
  const historyQuery = useGetDeliveryEarningsQuery(filter, {
    skip: !isAuthenticated,
  });
  const payoutsQuery = useGetPayoutsQuery(undefined, {
    skip: !isAuthenticated,
  });

  return {
    summary: summaryQuery.data,
    history: historyQuery.data ?? [],
    payouts: payoutsQuery.data ?? [],
    isLoading:
      summaryQuery.isLoading || historyQuery.isLoading || payoutsQuery.isLoading,
    isFetching:
      summaryQuery.isFetching ||
      historyQuery.isFetching ||
      payoutsQuery.isFetching,
    error: summaryQuery.error ?? historyQuery.error ?? payoutsQuery.error,
    refetch: async () => {
      await Promise.all([
        summaryQuery.refetch(),
        historyQuery.refetch(),
        payoutsQuery.refetch(),
      ]);
    },
  };
}

export function useEarningsBreakdown(orderId: string | undefined) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const query = useGetEarningsBreakdownQuery(orderId as string, {
    skip: !isAuthenticated || !orderId,
  });

  return {
    breakdown: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
