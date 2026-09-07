import type { ImageSource } from 'expo-image';

import { onboardingBannerSources } from '../../../assets/images/onboarding/sources';

type BannerConfig = {
  source: ImageSource;
  label: string;
  aspectRatio?: number;
  height?: number;
  maxHeight?: number;
  fit?: 'cover' | 'contain';
};

/**
 * Designed onboarding banners.
 * Use `cover` for tall/square assets so they fill the rounded frame
 * (avoids pink letterbox + white image box).
 * Use `contain` + natural aspectRatio for wide horizontal banners.
 */
export const ONBOARDING_BANNERS = {
  hub: {
    source: onboardingBannerSources.hub,
    label: 'Welcome to GUNUCO Partner',
    height: 200,
    fit: 'cover' as const,
  },
  personal: {
    source: onboardingBannerSources.personal,
    label: "Let's get to know you",
    aspectRatio: 1024 / 341,
    fit: 'cover' as const,
  },
  photo: {
    source: onboardingBannerSources.photo,
    label: 'Add your profile photo',
    height: 200,
    fit: 'cover' as const,
  },
  location: {
    source: onboardingBannerSources.location,
    label: 'Why we need your location',
    aspectRatio: 682 / 1024,
    fit: 'contain' as const,
  },
  vehicle: {
    source: onboardingBannerSources.vehicle,
    label: 'Tell us about your vehicle',
    aspectRatio: 1024 / 341,
    fit: 'cover' as const,
  },
  documents: {
    source: onboardingBannerSources.documents,
    label: 'Upload your documents',
    aspectRatio: 1024 / 492,
    fit: 'cover' as const,
  },
  docUpload: {
    source: onboardingBannerSources.docUpload,
    label: 'Capture clearly',
    aspectRatio: 1024 / 492,
    fit: 'cover' as const,
  },
  bank: {
    source: onboardingBannerSources.bank,
    label: 'Get paid on time',
    aspectRatio: 1024 / 492,
    fit: 'cover' as const,
  },
  training: {
    source: onboardingBannerSources.training,
    label: 'Learn. Deliver. Make an impact!',
    aspectRatio: 1024 / 576,
    fit: 'contain' as const,
  },
  review: {
    source: onboardingBannerSources.review,
    label: 'Almost there',
    height: 200,
    fit: 'cover' as const,
  },
  status: {
    source: onboardingBannerSources.status,
    label: 'Hang tight',
    height: 200,
    fit: 'cover' as const,
  },
} satisfies Record<string, BannerConfig>;

export type OnboardingBannerKey = keyof typeof ONBOARDING_BANNERS;
