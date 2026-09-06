import { useCallback } from 'react';

import {
  useGetOnboardingProgressQuery,
  useSubmitForReviewMutation,
  useUpdateOnboardingStepMutation,
  useUpdateProfileMutation,
} from '@/src/api/endpoints/partnerApi';
import { useAppSelector } from '@/src/store/hooks';
import type { PartnerProfileUpdate } from '@/src/repositories/interfaces';

/**
 * Onboarding progress + step mutations for registration screens.
 */
export function useOnboarding() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const progressQuery = useGetOnboardingProgressQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [updateStepMutation, updateStepState] = useUpdateOnboardingStepMutation();
  const [submitMutation, submitState] = useSubmitForReviewMutation();
  const [updateProfileMutation, updateProfileState] = useUpdateProfileMutation();

  const completeStep = useCallback(
    async (step: string) => updateStepMutation(step).unwrap(),
    [updateStepMutation],
  );

  const updateProfile = useCallback(
    async (update: PartnerProfileUpdate) => updateProfileMutation(update).unwrap(),
    [updateProfileMutation],
  );

  const submitForReview = useCallback(
    async () => submitMutation(undefined).unwrap(),
    [submitMutation],
  );

  return {
    progress: progressQuery.data,
    isLoading: progressQuery.isLoading,
    isFetching: progressQuery.isFetching,
    error: progressQuery.error,
    refetch: progressQuery.refetch,
    completeStep,
    updateProfile,
    submitForReview,
    updateStepState,
    submitState,
    updateProfileState,
  };
}
