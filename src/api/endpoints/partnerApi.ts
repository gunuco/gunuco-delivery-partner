import { baseApi } from '@/src/api/baseApi';
import { mapResult } from '@/src/api/mapResult';
import { repositories } from '@/src/repositories/factory';
import type { PartnerProfileUpdate } from '@/src/repositories/interfaces';

export const partnerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query({
      async queryFn() {
        const result = await repositories.partner.getMe();
        return mapResult(result);
      },
      providesTags: ['Partner'],
    }),
    updateProfile: build.mutation({
      async queryFn(update: PartnerProfileUpdate) {
        const result = await repositories.partner.updateProfile(update);
        return mapResult(result);
      },
      invalidatesTags: ['Partner'],
    }),
    goOnline: build.mutation({
      async queryFn(_arg: void) {
        const result = await repositories.partner.goOnline();
        return mapResult(result);
      },
      invalidatesTags: ['Partner'],
    }),
    goOffline: build.mutation({
      async queryFn(_arg: void) {
        const result = await repositories.partner.goOffline();
        return mapResult(result);
      },
      invalidatesTags: ['Partner'],
    }),
    getOnboardingProgress: build.query({
      async queryFn() {
        const result = await repositories.partner.getOnboardingProgress();
        return mapResult(result);
      },
      providesTags: ['Partner'],
    }),
    updateOnboardingStep: build.mutation({
      async queryFn(step: string) {
        const result = await repositories.partner.updateOnboardingStep(step);
        return mapResult(result);
      },
      invalidatesTags: ['Partner'],
    }),
    submitForReview: build.mutation({
      async queryFn(_arg: void) {
        const result = await repositories.partner.submitForReview();
        return mapResult(result);
      },
      invalidatesTags: ['Partner', 'Documents'],
    }),
  }),
});

export const {
  useGetMeQuery,
  useLazyGetMeQuery,
  useUpdateProfileMutation,
  useGoOnlineMutation,
  useGoOfflineMutation,
  useGetOnboardingProgressQuery,
  useUpdateOnboardingStepMutation,
  useSubmitForReviewMutation,
} = partnerApi;
