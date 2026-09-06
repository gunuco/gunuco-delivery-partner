import { router, useLocalSearchParams } from 'expo-router';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import {
  GCard,
  GEmptyState,
  GErrorState,
  GHeader,
  GListRow,
  GSkeleton,
  GText,
  theme,
} from '@/src/design-system';
import { useEarnings, useEarningsBreakdown } from '@/src/hooks';
import { formatDateTime } from '@/src/utils/date';
import { getErrorMessage } from '@/src/utils/errors';
import { formatPaise } from '@/src/utils/money';

export default function DeliveryEarningScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderId = Array.isArray(id) ? id[0] : id;
  const { breakdown, isLoading, error, refetch } = useEarningsBreakdown(orderId);
  const { history } = useEarnings();
  const delivery = history.find((item) => item.orderId === orderId);

  if (isLoading && !breakdown) {
    return (
      <View style={styles.screen}>
        <GHeader title="Delivery earning" showBack onBack={() => router.back()} />
        <View style={styles.pad}>
          <GSkeleton height={120} borderRadius={theme.radius.lg} />
          <GSkeleton height={56} borderRadius={theme.radius.md} />
          <GSkeleton height={56} borderRadius={theme.radius.md} />
        </View>
      </View>
    );
  }

  if (error && !breakdown) {
    return (
      <View style={styles.screen}>
        <GHeader title="Delivery earning" showBack onBack={() => router.back()} />
        <GErrorState
          title="Couldn’t load this earning"
          description={getErrorMessage(error)}
          onRetry={() => {
            void refetch();
          }}
        />
      </View>
    );
  }

  if (!breakdown) {
    return (
      <View style={styles.screen}>
        <GHeader title="Delivery earning" showBack onBack={() => router.back()} />
        <GEmptyState
          title="Earning not found"
          description="This delivery may not have a settled breakup yet."
          actionLabel="Back to earnings"
          onAction={() => router.replace('/(tabs)/earnings')}
        />
      </View>
    );
  }

  const rows = [
    { label: 'Base fare', value: breakdown.basePaise },
    { label: 'Distance', value: breakdown.distancePaise },
    { label: 'Surge / peak', value: breakdown.surgePaise },
    { label: 'Incentive', value: breakdown.incentivePaise },
    { label: 'Adjustments', value: breakdown.adjustmentsPaise },
    { label: 'Deductions', value: breakdown.deductionsPaise, deduct: true },
  ];

  return (
    <View style={styles.screen}>
      <GHeader
        title={delivery?.orderNumber ?? 'Delivery earning'}
        subtitle={delivery ? formatDateTime(delivery.date) : undefined}
        showBack
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              void refetch();
            }}
            tintColor={theme.colors.primary}
          />
        }
      >
        <GCard padding="lg" style={styles.hero}>
          <GText variant="label" color={theme.colors.textSecondary}>
            Net earning
          </GText>
          <GText variant="display">{formatPaise(breakdown.netPaise)}</GText>
          {delivery ? (
            <GText variant="caption" color={theme.colors.textMuted}>
              Status: {delivery.status === 'SETTLED' ? 'Settled' : 'Pending settlement'}
            </GText>
          ) : null}
        </GCard>

        {rows.map((row) => (
          <GListRow
            key={row.label}
            title={row.label}
            right={
              <GText variant="bodyBold">
                {row.deduct
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
  hero: {
    margin: theme.spacing[4],
  },
});
