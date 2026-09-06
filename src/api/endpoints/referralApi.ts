import { baseApi } from '@/src/api/baseApi';
import { mapResult } from '@/src/api/mapResult';
import { repositories } from '@/src/repositories/factory';

export const referralApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getReferral: build.query({
      async queryFn() {
        const result = await repositories.referrals.getReferral();
        return mapResult(result);
      },
      providesTags: ['Referral'],
    }),
    getReferralHistory: build.query({
      async queryFn() {
        const result = await repositories.referrals.getHistory();
        return mapResult(result);
      },
      providesTags: ['Referral'],
    }),
  }),
});

export const {
  useGetReferralQuery,
  useGetReferralHistoryQuery,
} = referralApi;
