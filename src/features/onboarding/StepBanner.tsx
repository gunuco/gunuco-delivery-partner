import { ONBOARDING_BANNERS, type OnboardingBannerKey } from './banners';
import { OnboardingBanner } from './OnboardingBanner';

/** Renders the mapped banner with mock-matched sizing. */
export function StepBanner({ name }: { name: OnboardingBannerKey }) {
  const banner = ONBOARDING_BANNERS[name];
  const height = 'height' in banner ? banner.height : undefined;
  const aspectRatio = 'aspectRatio' in banner ? banner.aspectRatio : undefined;
  const maxHeight =
    'maxHeight' in banner && typeof banner.maxHeight === 'number' ? banner.maxHeight : undefined;

  return (
    <OnboardingBanner
      name={name}
      source={banner.source}
      height={height}
      aspectRatio={aspectRatio}
      maxHeight={maxHeight}
      fit={banner.fit}
      accessibilityLabel={banner.label}
    />
  );
}
