import {
  useGetDemandZonesQuery,
  useGetNearbyDemandQuery,
} from '@/src/api/endpoints/demandApi';
import { useAppSelector } from '@/src/store/hooks';
import type { GeoPoint } from '@/src/types';

/**
 * Demand / surge zones for the home map and nearby hints.
 */
export function useDemand(center?: GeoPoint) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const zonesQuery = useGetDemandZonesQuery(undefined, {
    skip: !isAuthenticated,
  });
  const nearbyQuery = useGetNearbyDemandQuery(center, {
    skip: !isAuthenticated,
  });

  return {
    zones: zonesQuery.data ?? [],
    nearby: nearbyQuery.data ?? [],
    isLoading: zonesQuery.isLoading || nearbyQuery.isLoading,
    isFetching: zonesQuery.isFetching || nearbyQuery.isFetching,
    error: zonesQuery.error ?? nearbyQuery.error,
    refetch: async () => {
      await Promise.all([zonesQuery.refetch(), nearbyQuery.refetch()]);
    },
  };
}
