import { baseApi } from '@/src/api/baseApi';
import { mapResult } from '@/src/api/mapResult';
import { repositories } from '@/src/repositories/factory';

export const incentivesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getActiveIncentives: build.query({
      async queryFn() {
        const result = await repositories.incentives.getActive();
        return mapResult(result);
      },
      providesTags: ['Incentives'],
    }),
    getAllIncentives: build.query({
      async queryFn() {
        const result = await repositories.incentives.getAll();
        return mapResult(result);
      },
      providesTags: ['Incentives'],
    }),
    getIncentiveById: build.query({
      async queryFn(id: string) {
        const result = await repositories.incentives.getById(id);
        return mapResult(result);
      },
      providesTags: (_result, _error, id) => [{ type: 'Incentives', id }],
    }),
  }),
});

export const {
  useGetActiveIncentivesQuery,
  useGetAllIncentivesQuery,
  useGetIncentiveByIdQuery,
} = incentivesApi;
