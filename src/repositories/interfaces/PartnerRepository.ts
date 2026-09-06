import type {
  OnboardingProgress,
  Partner,
  PersonalDetails,
  Result,
} from '@/src/types';

export interface PartnerProfileUpdate {
  name?: string;
  email?: string;
  personalDetails?: Partial<PersonalDetails>;
}

export interface PartnerRepository {
  getMe(): Promise<Result<Partner>>;
  updateProfile(update: PartnerProfileUpdate): Promise<Result<Partner>>;
  goOnline(): Promise<Result<Partner>>;
  goOffline(): Promise<Result<Partner>>;
  getOnboardingProgress(): Promise<Result<OnboardingProgress>>;
  updateOnboardingStep(step: string): Promise<Result<OnboardingProgress>>;
  submitForReview(): Promise<Result<Partner>>;
}
