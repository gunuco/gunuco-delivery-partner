import {
  useGetActiveIncentivesQuery,
  useGetAllIncentivesQuery,
  useGetIncentiveByIdQuery,
} from '@/src/api/endpoints/incentivesApi';
import { useAppSelector } from '@/src/store/hooks';

/**
 * Active and all incentives for the partner.
 */
export function useIncentives() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const activeQuery = useGetActiveIncentivesQuery(undefined, {
    skip: !isAuthenticated,
  });
  const allQuery = useGetAllIncentivesQuery(undefined, {
    skip: !isAuthenticated,
  });

  return {
    active: activeQuery.data ?? [],
    all: allQuery.data ?? [],
    isLoading: activeQuery.isLoading || allQuery.isLoading,
    isFetching: activeQuery.isFetching || allQuery.isFetching,
    error: activeQuery.error ?? allQuery.error,
    refetch: async () => {
      await Promise.all([activeQuery.refetch(), allQuery.refetch()]);
    },
  };
}

export function useIncentive(id: string | undefined) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const query = useGetIncentiveByIdQuery(id as string, {
    skip: !isAuthenticated || !id,
  });

  return {
    incentive: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
