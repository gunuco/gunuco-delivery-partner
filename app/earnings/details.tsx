import { router } from 'expo-router';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import {
  GCard,
  GErrorState,
  GHeader,
  GListRow,
  GSectionHeader,
  GSkeleton,
  GText,
  theme,
} from '@/src/design-system';
import { useEarnings } from '@/src/hooks';
import { getErrorMessage } from '@/src/utils/errors';
import { formatPaise } from '@/src/utils/money';

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
      <View style={styles.screen}>
        <GHeader title="Breakdown" showBack onBack={() => router.back()} />
        <View style={styles.pad}>
          <GSkeleton height={72} borderRadius={theme.radius.lg} />
          <GSkeleton height={72} borderRadius={theme.radius.lg} />
          <GSkeleton height={72} borderRadius={theme.radius.lg} />
        </View>
      </View>
    );
  }

  if (error && !summary) {
    return (
      <View style={styles.screen}>
        <GHeader title="Breakdown" showBack onBack={() => router.back()} />
        <GErrorState
          title="Couldn’t load breakdown"
          description={getErrorMessage(error)}
          onRetry={() => {
            void refetch();
          }}
        />
      </View>
    );
  }

  const rows: { label: string; value: number; hint?: string }[] = [
    { label: 'Base fare', value: totals.base },
    { label: 'Distance', value: totals.distance },
    { label: 'Surge / peak', value: totals.surge },
    { label: 'Incentives', value: totals.incentive },
    { label: 'Adjustments', value: totals.adjustments },
    { label: 'Deductions', value: totals.deductions, hint: 'Shown as credited net' },
  ];

  return (
    <View style={styles.screen}>
      <GHeader
        title="Earnings breakdown"
        subtitle="Across listed deliveries"
        showBack
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={() => {
              void refetch();
            }}
            tintColor={theme.colors.primary}
          />
        }
      >
        <GCard padding="lg">
          <GText variant="label" color={theme.colors.textSecondary}>
            Net from deliveries
          </GText>
          <GText variant="display">{formatPaise(totals.net)}</GText>
          <GText variant="caption" color={theme.colors.textMuted} style={styles.hint}>
            Based on {history.length} delivery earning
            {history.length === 1 ? '' : 's'} currently loaded.
          </GText>
        </GCard>

        <GSectionHeader title="Components" />
        {rows.map((row) => (
          <GListRow
            key={row.label}
            title={row.label}
            subtitle={row.hint}
            right={
              <GText variant="bodyBold">
                {row.label === 'Deductions'
                  ? `−${formatPaise(Math.abs(row.value))}`
                  : formatPaise(row.value)}
              </GText>
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  pad: {
    padding: theme.spacing[4],
    gap: theme.spacing[3],
  },
  content: {
    paddingBottom: theme.spacing[8],
  },
  hint: {
    marginTop: theme.spacing[2],
  },
});
