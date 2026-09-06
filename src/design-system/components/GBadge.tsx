import { StyleSheet, View } from 'react-native';

import { theme } from '../theme';
import { GText } from './GText';

export type GBadgeTone = 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export type GBadgeProps = {
  label: string;
  tone?: GBadgeTone;
};

const toneColors: Record<GBadgeTone, { bg: string; text: string }> = {
  primary: { bg: '#EFE6DC', text: theme.colors.primary },
  accent: { bg: '#F8E8EB', text: theme.colors.accent },
  success: { bg: '#E3F2EA', text: theme.colors.success },
  warning: { bg: '#F8EDD9', text: theme.colors.warning },
  danger: { bg: '#F8E4E4', text: theme.colors.danger },
  info: { bg: '#E6EEFC', text: theme.colors.info },
  neutral: { bg: theme.colors.surfaceMuted, text: theme.colors.textSecondary },
};

export function GBadge({ label, tone = 'neutral' }: GBadgeProps) {
  const c = toneColors[tone];
  return (
    <View
      style={[styles.badge, { backgroundColor: c.bg }]}
      accessibilityRole="text"
      accessibilityLabel={label}
    >
      <GText variant="label" color={c.text}>
        {label}
      </GText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.radius.full,
  },
});
