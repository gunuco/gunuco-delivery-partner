import type {
  PartnerProfileUpdate,
  PartnerRepository,
} from '@/src/repositories/interfaces/PartnerRepository';
import type { OnboardingProgress, Partner, Result } from '@/src/types';
import { logger } from '@/src/services/logger';

import { mockStore } from './MockStore';
import { appError, err, ok, UNAUTHORIZED } from './result';
import { withMockLatency } from './withMockLatency';

function requireSessionPartner(): Result<Partner> {
  const { session, partner } = mockStore.getState();
  if (!session) {
    return err(UNAUTHORIZED);
  }
  return ok(partner);
}

export class MockPartnerRepository implements PartnerRepository {
  async getMe(): Promise<Result<Partner>> {
    return withMockLatency(() => requireSessionPartner());
  }

  async updateProfile(update: PartnerProfileUpdate): Promise<Result<Partner>> {
    return withMockLatency(() => {
      const sessionCheck = requireSessionPartner();
      if (!sessionCheck.ok) {
        return sessionCheck;
      }

      if (update.personalDetails) {
        mockStore.replaceState({
          personalDetails: {
            ...mockStore.getState().personalDetails,
            ...update.personalDetails,
          },
        });
      }

      const name =
        update.name ??
        update.personalDetails?.fullName ??
        mockStore.getState().partner.name;

      const partner = mockStore.patchPartner({
        name,
        email: update.email ?? mockStore.getState().partner.email,
      });

      logger.info('Partner profile updated (mock)', { partnerId: partner.id });
      return ok(partner);
    });
  }

  async goOnline(): Promise<Result<Partner>> {
    return withMockLatency(() => {
      const sessionCheck = requireSessionPartner();
      if (!sessionCheck.ok) {
        return sessionCheck;
      }
      const { partner } = mockStore.getState();
      if (partner.status !== 'APPROVED') {
        return err(
          appError(
            'PARTNER_NOT_APPROVED',
            'Partner cannot go online until approved',
            'Your account is not approved for deliveries yet.',
            false,
          ),
        );
      }
      const updated = mockStore.patchPartner({ availability: 'ONLINE' });
      logger.info('Partner went online (mock)', { partnerId: updated.id });
      return ok(updated);
    });
  }

  async goOffline(): Promise<Result<Partner>> {
    return withMockLatency(() => {
      const sessionCheck = requireSessionPartner();
      if (!sessionCheck.ok) {
        return sessionCheck;
      }
      const { orders } = mockStore.getState();
      const busy = orders.some(
        (o) =>
          o.status !== 'ASSIGNED' &&
          o.status !== 'DELIVERED' &&
          o.status !== 'FAILED' &&
          o.status !== 'CANCELLED',
      );
      if (busy) {
        return err(
          appError(
            'ACTIVE_ORDER',
            'Cannot go offline with an active order',
            'Complete or fail your active order before going offline.',
            false,
          ),
        );
      }
      const updated = mockStore.patchPartner({ availability: 'OFFLINE' });
      logger.info('Partner went offline (mock)', { partnerId: updated.id });
      return ok(updated);
    });
  }

  async getOnboardingProgress(): Promise<Result<OnboardingProgress>> {
    return withMockLatency(() => {
      const sessionCheck = requireSessionPartner();
      if (!sessionCheck.ok) {
        return err(sessionCheck.error);
      }
      return ok({ ...mockStore.getState().onboarding });
    });
  }

  async updateOnboardingStep(step: string): Promise<Result<OnboardingProgress>> {
    return withMockLatency(() => {
      const sessionCheck = requireSessionPartner();
      if (!sessionCheck.ok) {
        return err(sessionCheck.error);
      }
      const current = mockStore.getState().onboarding;
      const completedSteps = current.completedSteps.includes(step)
        ? current.completedSteps
        : [...current.completedSteps, step];
      const onboarding: OnboardingProgress = {
        ...current,
        currentStep: step,
        completedSteps,
      };
      mockStore.replaceState({ onboarding });
      mockStore.patchPartner({ onboardingStep: step });
      return ok(onboarding);
    });
  }

  async submitForReview(): Promise<Result<Partner>> {
    return withMockLatency(() => {
      const sessionCheck = requireSessionPartner();
      if (!sessionCheck.ok) {
        return sessionCheck;
      }
      const onboarding = mockStore.getState().onboarding;
      const missing = onboarding.requiredSteps.filter(
        (s) => s !== 'SUBMITTED' && !onboarding.completedSteps.includes(s),
      );
      if (missing.length > 0) {
        return err(
          appError(
            'ONBOARDING_INCOMPLETE',
            `Missing steps: ${missing.join(', ')}`,
            'Please complete all onboarding steps before submitting.',
            false,
          ),
        );
      }
      mockStore.replaceState({
        onboarding: {
          ...onboarding,
          currentStep: 'SUBMITTED',
          completedSteps: onboarding.completedSteps.includes('SUBMITTED')
            ? onboarding.completedSteps
            : [...onboarding.completedSteps, 'SUBMITTED'],
        },
      });
      const partner = mockStore.patchPartner({
        status: 'UNDER_REVIEW',
        onboardingStep: 'SUBMITTED',
        availability: 'UNAVAILABLE',
      });
      logger.info('Partner submitted for review (mock)', { partnerId: partner.id });
      return ok(partner);
    });
  }
}
