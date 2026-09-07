import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import {
  GErrorState,
  GSkeleton,
  GText,
  theme,
  type IconName,
} from '@/src/design-system';
import {
  ProfileDetailRow,
  ProfileHeroCard,
  ProfileScreenShell,
  PROFILE_BG,
} from '@/src/features/profile/ProfileScreenShell';
import { useEarnings } from '@/src/hooks';
import { getErrorMessage } from '@/src/utils/errors';
import { formatPaise } from '@/src/utils/money';

const ROW_ICONS: Record<string, IconName> = {
  'Base fare': 'money',
  Distance: 'distance',
  'Surge / peak': 'bolt',
  Incentives: 'gift',
  Adjustments: 'edit',
  Deductions: 'minus',
};

export default function EarningsDetailsScreen() {
  const { summary, history, isLoading, error, refetch, isFetching } =
    useEarnings();

  const totals = history.reduce(
    (acc, item) => {
      const breakdown = item.breakdown;
      if (!breakdown) return acc;
      acc.base += breakdown.basePaise ?? 0;
      acc.distance += breakdown.distancePaise ?? 0;
      acc.surge += breakdown.surgePaise ?? 0;
      acc.incentive += breakdown.incentivePaise ?? 0;
      acc.adjustments += breakdown.adjustmentsPaise ?? 0;
      acc.deductions += breakdown.deductionsPaise ?? 0;
      acc.net += breakdown.netPaise ?? 0;
      return acc;
    },
    {
      base: 0,
      distance: 0,
      surge: 0,
      incentive: 0,
      adjustments: 0,
      deductions: 0,
      net: 0,
    },
  );

  if (isLoading && !summary) {
    return (
      <ProfileScreenShell
        title="Earnings breakdown"
        subtitle="Across listed deliveries"
        onBack={() => router.back()}
      >
        <GSkeleton height={120} borderRadius={theme.radius.xl} />
        <GSkeleton height={72} borderRadius={theme.radius.xl} />
        <GSkeleton height={72} borderRadius={theme.radius.xl} />
      </ProfileScreenShell>
    );
  }

  if (error && !summary) {
    return (
      <View style={styles.fallback}>
        <ProfileScreenShell title="Earnings breakdown" onBack={() => router.back()}>
          <GErrorState
            title="Couldn’t load breakdown"
            description={getErrorMessage(error)}
            onRetry={() => {
              void refetch();
            }}
          />
        </ProfileScreenShell>
      </View>
    );
  }

  const rows: { label: string; value: number; hint?: string }[] = [
    { label: 'Base fare', value: totals.base },
    { label: 'Distance', value: totals.distance },
    { label: 'Surge / peak', value: totals.surge },
    { label: 'Incentives', value: totals.incentive },
    { label: 'Adjustments', value: totals.adjustments },
    {
      label: 'Deductions',
      value: totals.deductions,
      hint: 'Shown as credited net',
    },
  ];

  return (
    <ProfileScreenShell
      title="Earnings breakdown"
      subtitle="Across listed deliveries"
      onBack={() => router.back()}
      refreshing={isFetching && !isLoading}
      onRefresh={() => {
        void refetch();
      }}
    >
      <ProfileHeroCard
        tone="primary"
        icon="chart"
        eyebrow="Net from deliveries"
        title={formatPaise(totals.net)}
        body={`Based on ${history.length} delivery earning${history.length === 1 ? '' : 's'} currently loaded.`}
      />

      <GText variant="bodyBold" style={styles.section}>
        Components
      </GText>

      {rows.map((row) => (
        <ProfileDetailRow
          key={row.label}
          icon={ROW_ICONS[row.label] ?? 'money'}
          label={row.label}
          value={
            row.label === 'Deductions'
              ? `−${formatPaise(Math.abs(row.value))}`
              : formatPaise(row.value)
          }
          right={
            row.hint ? (
              <GText variant="caption" color={theme.colors.textMuted} style={styles.hint}>
                {row.hint}
              </GText>
            ) : undefined
          }
        />
      ))}
    </ProfileScreenShell>
  );
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    backgroundColor: PROFILE_BG,
  },
  section: {
    marginTop: theme.spacing[1],
  },
  hint: {
    maxWidth: 88,
    textAlign: 'right',
  },
});
