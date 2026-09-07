import { Pressable, StyleSheet, View } from 'react-native';

import { GCard, GIcon, GText, theme } from '@/src/design-system';

export type TripSummaryCardProps = {
  distanceLabel: string;
  durationLabel: string;
  earningsLabel: string;
  caption: string;
  onPressEarnings: () => void;
};

export function TripSummaryCard({
  distanceLabel,
  durationLabel,
  earningsLabel,
  caption,
  onPressEarnings,
}: TripSummaryCardProps) {
  return (
    <GCard padding="md" style={styles.card}>
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <GIcon name="distance" size={20} color={theme.colors.primary} />
        </View>

        <View style={styles.copy}>
          <GText variant="caption" color={theme.colors.textSecondary}>
            Trip summary
          </GText>
          <GText variant="bodyBold" style={styles.summaryLine}>
            {distanceLabel} • {durationLabel} • {earningsLabel}
          </GText>
          <GText variant="caption" color={theme.colors.textMuted}>
            {caption}
          </GText>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Your earnings ${earningsLabel}`}
          onPress={onPressEarnings}
          style={styles.earningsChip}
        >
          <GText variant="bodyBold" color={theme.colors.success}>
            {earningsLabel}
          </GText>
          <GText variant="label" color={theme.colors.success}>
            Your earnings
          </GText>
          <GIcon name="chevronRight" size={14} color={theme.colors.success} />
        </Pressable>
      </View>
    </GCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing[2],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  summaryLine: {
    fontWeight: '700',
  },
  earningsChip: {
    backgroundColor: theme.colors.successSoft,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    alignItems: 'center',
    gap: 2,
    minWidth: 88,
  },
});
