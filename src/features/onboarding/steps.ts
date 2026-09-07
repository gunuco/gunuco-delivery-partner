import type { DocumentType, OnboardingProgress } from '@/src/types';

/** Visual onboarding steps shown in GStepIndicator (UI order). */
export const ONBOARDING_UI_STEPS = [
  'Personal',
  'Photo',
  'Location',
  'Vehicle',
  'Docs',
  'Bank',
  'Training',
  'Review',
] as const;

export type OnboardingUiStep = (typeof ONBOARDING_UI_STEPS)[number];

export const ONBOARDING_ROUTES = [
  '/(onboarding)/personal',
  '/(onboarding)/photo',
  '/(onboarding)/location',
  '/(onboarding)/vehicle',
  '/(onboarding)/documents',
  '/(onboarding)/bank',
  '/(onboarding)/training',
  '/(onboarding)/review',
] as const;

export const DOCUMENT_LABELS: Record<DocumentType, string> = {
  DRIVING_LICENCE: 'Driving Licence',
  RC: 'Registration Certificate (RC)',
  INSURANCE: 'Vehicle Insurance',
  IDENTITY: 'Aadhaar / Government ID',
  PROFILE_PHOTO: 'Profile Photo',
};

export const DOCUMENT_DESCRIPTIONS: Record<DocumentType, string> = {
  DRIVING_LICENCE: 'Upload a clear photo of your valid driving licence.',
  RC: 'Upload the registration certificate for your delivery vehicle.',
  INSURANCE: 'Upload a valid vehicle insurance document.',
  IDENTITY: 'Upload Aadhaar or another government-issued ID.',
  PROFILE_PHOTO: 'Upload a clear face photo for verification.',
};

/** Documents required before marking DOCUMENTS step complete. */
export const REQUIRED_DOCUMENT_TYPES: DocumentType[] = [
  'DRIVING_LICENCE',
  'RC',
  'INSURANCE',
  'IDENTITY',
];

export const HYDERABAD_AREA_SUGGESTIONS = [
  'Jubilee Hills',
  'Banjara Hills',
  'Madhapur',
  'Gachibowli',
  'Kukatpally',
  'Secunderabad',
] as const;

export function stepIndexFromProgress(progress: OnboardingProgress | undefined): number {
  if (!progress) {
    return 0;
  }
  const completed = new Set(progress.completedSteps ?? []);
  if (!completed.has('PERSONAL_DETAILS')) return 0;
  // Photo / location are UX steps after personal — treat as 1–2 until vehicle done
  if (!completed.has('VEHICLE')) {
    // Prefer photo/location if personal done but vehicle not
    return completed.has('PERSONAL_DETAILS') ? 1 : 0;
  }
  if (!completed.has('DOCUMENTS')) return 4;
  if (!completed.has('BANK')) return 5;
  if (!completed.has('TRAINING')) return 6;
  if (!completed.has('SUBMITTED')) return 7;
  return 7;
}

export function nextIncompleteRoute(progress: OnboardingProgress | undefined): string {
  if (!progress) {
    return '/(onboarding)/personal';
  }
  const completed = new Set(progress.completedSteps ?? []);
  if (!completed.has('PERSONAL_DETAILS')) return '/(onboarding)/personal';
  if (!completed.has('VEHICLE')) return '/(onboarding)/photo';
  if (!completed.has('DOCUMENTS')) return '/(onboarding)/documents';
  if (!completed.has('BANK')) return '/(onboarding)/bank';
  if (!completed.has('TRAINING')) return '/(onboarding)/training';
  if (!completed.has('SUBMITTED')) return '/(onboarding)/review';
  return '/(onboarding)/status';
}
