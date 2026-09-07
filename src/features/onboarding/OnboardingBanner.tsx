import type { ImageSource } from 'expo-image';
import { Image } from 'expo-image';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { theme } from '@/src/design-system';

export type OnboardingBannerProps = {
  name: string;
  source: ImageSource;
  /** Fixed height. Prefer for tall/portrait assets so they match mock card height. */
  height?: number;
  /** When set (and no height), height is derived from width. */
  aspectRatio?: number;
  /** Caps height when using aspectRatio on large phones. */
  maxHeight?: number;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  /**
   * cover — fills frame (may crop edges)
   * contain — full artwork visible (preferred for designed banners)
   */
  fit?: 'cover' | 'contain';
};

/**
 * Inset rounded onboarding hero matching mock cards.
 * Prefer `height` for tall assets; `aspectRatio` for wide banners.
 */
export function OnboardingBanner({
  name,
  source,
  height,
  aspectRatio,
  maxHeight,
  accessibilityLabel = 'GUNUCO onboarding banner',
  style,
  fit = 'contain',
}: OnboardingBannerProps) {
  const sizeStyle =
    height != null
      ? {
          height: name == 'photo' ? 440 : 260,
          borderRadius: theme.radius.md,
          width: '100%' as const,
        }
      : aspectRatio != null
        ? {
            aspectRatio,
            borderRadius: theme.radius.md,
            width: '100%' as const,
            ...(maxHeight != null ? { maxHeight } : null),
          }
        : { height: 162, borderRadius: theme.radius.md, width: '100%' as const };

  return (
    <View style={[styles.wrap, sizeStyle, style]}>
      <Image
        source={source}
        style={styles.image}
        contentFit={fit}
        contentPosition="center"
        accessibilityLabel={accessibilityLabel}
        transition={120}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    backgroundColor: theme.colors.accentSoft,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
