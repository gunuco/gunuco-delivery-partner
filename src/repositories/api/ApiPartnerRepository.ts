import type {
  PartnerProfileUpdate,
  PartnerRepository,
} from '@/src/repositories/interfaces/PartnerRepository';
import type { OnboardingProgress, Partner, Result } from '@/src/types';

import { apiClient } from './ApiClient';

function notConnected<T>(): Result<T> {
  return { ok: false, error: apiClient.notConnectedError() };
}

export class ApiPartnerRepository implements PartnerRepository {
  async getMe(): Promise<Result<Partner>> {
    return notConnected();
  }

  async updateProfile(_update: PartnerProfileUpdate): Promise<Result<Partner>> {
    return notConnected();
  }

  async goOnline(): Promise<Result<Partner>> {
    return notConnected();
  }

  async goOffline(): Promise<Result<Partner>> {
    return notConnected();
  }

  async getOnboardingProgress(): Promise<Result<OnboardingProgress>> {
    return notConnected();
  }

  async updateOnboardingStep(_step: string): Promise<Result<OnboardingProgress>> {
    return notConnected();
  }

  async submitForReview(): Promise<Result<Partner>> {
    return notConnected();
  }
}
