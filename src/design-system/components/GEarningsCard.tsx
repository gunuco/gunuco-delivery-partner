import { StyleSheet, View } from 'react-native';

import { theme } from '../theme';
import { GCard } from './GCard';
import { GText } from './GText';

export type GEarningsCardProps = {
  periodLabel: string;
  amount: string;
  subtitle?: string;
};

export function GEarningsCard({ periodLabel, amount, subtitle }: GEarningsCardProps) {
  return (
    <GCard padding="lg" style={styles.card}>
      <GText variant="label" color={theme.colors.textInverse} style={styles.label}>
        {periodLabel}
      </GText>
      <GText variant="display" color={theme.colors.textInverse}>
        {amount}
      </GText>
      {subtitle ? (
        <GText variant="caption" color="rgba(255,255,255,0.82)" style={styles.sub}>
          {subtitle}
        </GText>
      ) : null}
      <View style={styles.accent} />
    </GCard>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primaryDark,
    overflow: 'hidden',
  },
  label: {
    textTransform: 'uppercase',
    marginBottom: theme.spacing[1],
    opacity: 0.9,
  },
  sub: {
    marginTop: theme.spacing[2],
  },
  accent: {
    position: 'absolute',
    right: -24,
    bottom: -24,
    width: 96,
    height: 96,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accent,
    opacity: 0.22,
  },
});
