/** GUNUCO Delivery Partner identity & onboarding domain types */

export type PartnerStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'ACTION_REQUIRED'
  | 'SUSPENDED';

export type PartnerAvailability = 'ONLINE' | 'OFFLINE' | 'BUSY' | 'UNAVAILABLE';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';

export type BankVerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'FAILED';

export interface Partner {
  id: string;
  /** e.g. GN-RD-10284 */
  partnerCode: string;
  phone: string;
  name: string;
  email?: string;
  photoUrl?: string;
  hubId: string;
  hubName: string;
  status: PartnerStatus;
  availability: PartnerAvailability;
  rating: number;
  totalDeliveries: number;
  onboardingStep: string;
  createdAt: string;
  updatedAt: string;
}

export interface PersonalDetails {
  fullName: string;
  dateOfBirth: string;
  gender?: Gender;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface BankDetails {
  accountHolderName: string;
  accountNumberMasked: string;
  ifsc: string;
  bankName: string;
  verificationStatus: BankVerificationStatus;
}

export interface OnboardingProgress {
  currentStep: string;
  completedSteps: string[];
  requiredSteps: string[];
}
