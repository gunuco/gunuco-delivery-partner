import { StyleSheet, View } from 'react-native';

import { GIcon, GProgress, GText, theme } from '@/src/design-system';
import type { Incentive } from '@/src/types';
import { formatPaise } from '@/src/utils/money';

export type WeeklyIncentiveCardProps = {
  incentive: Incentive;
};

export function WeeklyIncentiveCard({ incentive }: WeeklyIncentiveCardProps) {
  const progress =
    incentive.targetValue > 0
      ? incentive.currentValue / incentive.targetValue
      : 0;
  const remaining =
    incentive.remainingLabel ??
    `${Math.max(0, incentive.targetValue - incentive.currentValue)} orders left`;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <GIcon name="target" size={18} color={theme.colors.primary} />
          <GText variant="bodyBold" style={styles.title}>
            Weekly Incentive
          </GText>
        </View>
        <View style={styles.pill}>
          <GText variant="label" color={theme.colors.primary}>
            {remaining}
          </GText>
        </View>
      </View>

      <GText variant="caption" color={theme.colors.textSecondary}>
        {incentive.description}
      </GText>

      <View style={styles.progressBlock}>
        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <GProgress
              progress={progress}
              height={8}
              trackColor={theme.colors.white}
              fillColor={theme.colors.primary}
            />
          </View>
          <GText variant="caption" color={theme.colors.textSecondary} style={styles.progressLabel}>
            {incentive.currentValue} / {incentive.targetValue}
          </GText>
        </View>
      </View>

      <View style={styles.rewardRow}>
        <GIcon name="gift" size={16} color={theme.colors.primary} />
        <GText variant="bodyBold">
          Reward {formatPaise(incentive.rewardPaise)}
        </GText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.accentSoft,
    borderRadius: theme.radius.xl,
    padding: theme.spacing[4],
    gap: theme.spacing[3],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing[2],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    flexShrink: 1,
  },
  title: {
    fontWeight: '700',
  },
  pill: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.radius.full,
  },
  progressBlock: {
    gap: theme.spacing[2],
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  progressTrack: {
    flex: 1,
  },
  progressLabel: {
    fontWeight: '600',
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
});
