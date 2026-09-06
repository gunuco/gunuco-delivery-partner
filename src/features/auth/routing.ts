import type { Href } from 'expo-router';

import type { OnboardingProgress, PartnerStatus } from '@/src/types';

/** Partner statuses that must stay in onboarding / verification UX. */
export const GATED_PARTNER_STATUSES: ReadonlySet<PartnerStatus> = new Set([
  'PENDING',
  'UNDER_REVIEW',
  'REJECTED',
  'ACTION_REQUIRED',
  'SUSPENDED',
]);

export const STATUS_SCREEN_STATUSES: ReadonlySet<PartnerStatus> = new Set([
  'UNDER_REVIEW',
  'REJECTED',
  'ACTION_REQUIRED',
  'SUSPENDED',
]);

export function isOnboardingIncomplete(progress: OnboardingProgress | undefined): boolean {
  if (!progress) {
    return true;
  }
  const required = progress.requiredSteps.filter((s) => s !== 'SUBMITTED');
  return required.some((step) => !progress.completedSteps.includes(step));
}

export function needsOnboardingGate(
  status: PartnerStatus | undefined,
  progress?: OnboardingProgress,
): boolean {
  if (!status) {
    return true;
  }
  if (status === 'APPROVED') {
    return false;
  }
  if (GATED_PARTNER_STATUSES.has(status)) {
    return true;
  }
  return isOnboardingIncomplete(progress);
}

/**
 * Root / post-auth destination based on session partner status.
 */
export function getAuthenticatedHref(
  status: PartnerStatus | undefined,
  progress?: OnboardingProgress,
): Href {
  if (!status || needsOnboardingGate(status, progress)) {
    if (status && STATUS_SCREEN_STATUSES.has(status)) {
      return '/(onboarding)/status';
    }
    return '/(onboarding)';
  }
  return '/(tabs)/home';
}

/**
 * After OTP verify — new partners always start onboarding hub.
 */
export function getPostOtpHref(
  isNewPartner: boolean,
  partnerStatus: PartnerStatus,
): Href {
  if (isNewPartner || needsOnboardingGate(partnerStatus)) {
    if (STATUS_SCREEN_STATUSES.has(partnerStatus)) {
      return '/(onboarding)/status';
    }
    return '/(onboarding)';
  }
  return '/(tabs)/home';
}
