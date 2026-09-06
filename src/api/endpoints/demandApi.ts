import { baseApi } from '@/src/api/baseApi';
import { mapResult } from '@/src/api/mapResult';
import { repositories } from '@/src/repositories/factory';
import type { GeoPoint } from '@/src/types';

export const demandApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDemandZones: build.query({
      async queryFn() {
        const result = await repositories.demand.getZones();
        return mapResult(result);
      },
      providesTags: ['Demand'],
    }),
    getNearbyDemand: build.query({
      async queryFn(center?: GeoPoint) {
        const result = await repositories.demand.getNearby(center);
        return mapResult(result);
      },
      providesTags: ['Demand'],
    }),
  }),
});

export const {
  useGetDemandZonesQuery,
  useGetNearbyDemandQuery,
} = demandApi;
