import { Image } from 'expo-image';
import type { ImageSource } from 'expo-image';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { GText, theme } from '@/src/design-system';

export type OnboardingHeroBannerProps = {
  title: string;
  description: string;
  image: ImageSource;
  imageAccessibilityLabel?: string;
  tagline?: string;
  style?: StyleProp<ViewStyle>;
};

export function OnboardingHeroBanner({
  title,
  description,
  image,
  imageAccessibilityLabel = 'GUNUCO partner illustration',
  tagline = 'Delivering Happiness Together',
  style,
}: OnboardingHeroBannerProps) {
  return (
    <View style={[styles.hero, style]}>
      <View style={styles.copy}>
        <GText variant="h2" style={styles.title}>
          {title}
        </GText>
        <GText variant="body" color={theme.colors.textSecondary}>
          {description}
        </GText>
      </View>
      <View style={styles.artWrap}>
        <Image
          source={image}
          style={styles.art}
          contentFit="contain"
          accessibilityLabel={imageAccessibilityLabel}
        />
        {tagline ? (
          <GText variant="label" color={theme.colors.primary} style={styles.tagline}>
            {tagline}
          </GText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    backgroundColor: theme.colors.accentSoft,
    borderRadius: theme.radius.xl,
    paddingLeft: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    overflow: 'hidden',
    minHeight: 132,
  },
  copy: {
    flex: 1,
    gap: theme.spacing[1],
    paddingVertical: theme.spacing[1],
    zIndex: 1,
  },
  title: {
    color: theme.colors.text,
  },
  artWrap: {
    width: 132,
    height: 132,
    marginRight: theme.spacing[2],
    alignItems: 'center',
    justifyContent: 'center',
  },
  art: {
    width: '100%',
    height: '100%',
  },
  tagline: {
    position: 'absolute',
    bottom: 2,
    right: 0,
    left: 0,
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 9,
    lineHeight: 12,
  },
});
