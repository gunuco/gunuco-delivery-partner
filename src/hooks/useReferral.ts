import {
  useGetReferralHistoryQuery,
  useGetReferralQuery,
} from '@/src/api/endpoints/referralApi';
import { useAppSelector } from '@/src/store/hooks';

/**
 * Referral program summary and history.
 */
export function useReferral() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const referralQuery = useGetReferralQuery(undefined, {
    skip: !isAuthenticated,
  });
  const historyQuery = useGetReferralHistoryQuery(undefined, {
    skip: !isAuthenticated,
  });

  return {
    referral: referralQuery.data,
    history: historyQuery.data ?? referralQuery.data?.history ?? [],
    isLoading: referralQuery.isLoading || historyQuery.isLoading,
    isFetching: referralQuery.isFetching || historyQuery.isFetching,
    error: referralQuery.error ?? historyQuery.error,
    refetch: async () => {
      await Promise.all([referralQuery.refetch(), historyQuery.refetch()]);
    },
  };
}
