import { StyleSheet, View } from 'react-native';

import { theme } from '../theme';
import { GCard } from './GCard';
import { GText } from './GText';

export type GStatCardProps = {
  label: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'flat';
};

export function GStatCard({ label, value, subtitle, trend }: GStatCardProps) {
  const trendColor =
    trend === 'up'
      ? theme.colors.success
      : trend === 'down'
        ? theme.colors.danger
        : theme.colors.textSecondary;

  const trendLabel =
    trend === 'up' ? '↑' : trend === 'down' ? '↓' : trend === 'flat' ? '→' : null;

  return (
    <GCard padding="md" style={styles.card}>
      <GText variant="label" color={theme.colors.textSecondary}>
        {label}
      </GText>
      <View style={styles.valueRow}>
        <GText variant="h2">{value}</GText>
        {trendLabel ? (
          <GText variant="caption" color={trendColor} style={styles.trend}>
            {trendLabel}
          </GText>
        ) : null}
      </View>
      {subtitle ? (
        <GText variant="caption" color={theme.colors.textMuted}>
          {subtitle}
        </GText>
      ) : null}
    </GCard>
  );
}

const styles = StyleSheet.create({
  card: {
    minWidth: 140,
    flexGrow: 1,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    marginVertical: theme.spacing[1],
  },
  trend: {
    fontWeight: '700',
    fontSize: 16,
  },
});
