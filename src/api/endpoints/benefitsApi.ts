import { baseApi } from '@/src/api/baseApi';
import { mapResult } from '@/src/api/mapResult';
import { repositories } from '@/src/repositories/factory';

export const benefitsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getBenefits: build.query({
      async queryFn() {
        const result = await repositories.benefits.getBenefits();
        return mapResult(result);
      },
      providesTags: ['Benefits'],
    }),
    getInsurance: build.query({
      async queryFn() {
        const result = await repositories.benefits.getInsurance();
        return mapResult(result);
      },
      providesTags: ['Benefits'],
    }),
  }),
});

export const {
  useGetBenefitsQuery,
  useGetInsuranceQuery,
} = benefitsApi;
