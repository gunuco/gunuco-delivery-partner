import type { ImageSource } from 'expo-image';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { theme } from '../theme';
import { GText } from './GText';

export type GEarningsCardProps = {
  periodLabel: string;
  amount: string;
  subtitle?: string;
  slogan?: string;
  /** Optional designed maroon hero artwork (right-side graphics). */
  backgroundSource?: ImageSource;
};

export function GEarningsCard({
  periodLabel,
  amount,
  subtitle,
  slogan = 'More Deliveries Brighter Tomorrow',
  backgroundSource,
}: GEarningsCardProps) {
  return (
    <View style={styles.card}>
      {backgroundSource ? (
        <Image
          source={backgroundSource}
          style={styles.bg}
          contentFit="cover"
          contentPosition="right center"
          accessibilityIgnoresInvertColors
        />
      ) : null}
      <View style={styles.content}>
        <View style={styles.left}>
          <GText variant="label" color={theme.colors.textInverse} style={styles.label}>
            {periodLabel}
          </GText>
          <GText variant="display" color={theme.colors.textInverse} style={styles.amount}>
            {amount}
          </GText>
          {subtitle ? (
            <GText variant="caption" color="rgba(255,255,255,0.88)">
              {subtitle}
            </GText>
          ) : null}
        </View>
        {slogan ? (
          <GText
            variant="caption"
            color={theme.colors.textInverse}
            style={styles.slogan}
            numberOfLines={3}
          >
            {slogan}
          </GText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    minHeight: 132,
    backgroundColor: theme.colors.primary,
    ...theme.shadows.md,
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[4],
    minHeight: 132,
    gap: theme.spacing[3],
  },
  left: {
    flex: 1,
    gap: theme.spacing[1],
    zIndex: 1,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.92,
  },
  amount: {
    marginTop: 2,
  },
  slogan: {
    maxWidth: 118,
    fontStyle: 'italic',
    fontWeight: '600',
    textAlign: 'right',
    lineHeight: 16,
    marginBottom: theme.spacing[1],
    zIndex: 1,
  },
});
