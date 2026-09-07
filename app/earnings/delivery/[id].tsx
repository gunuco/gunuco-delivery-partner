import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import {
  GEmptyState,
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
import { useEarnings, useEarningsBreakdown } from '@/src/hooks';
import { formatDateTime } from '@/src/utils/date';
import { getErrorMessage } from '@/src/utils/errors';
import { formatPaise } from '@/src/utils/money';

const ROW_ICONS: Record<string, IconName> = {
  'Base fare': 'money',
  Distance: 'distance',
  'Surge / peak': 'bolt',
  Incentive: 'gift',
  Adjustments: 'edit',
  Deductions: 'minus',
};

export default function DeliveryEarningScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderId = Array.isArray(id) ? id[0] : id;
  const { breakdown, isLoading, error, refetch } = useEarningsBreakdown(orderId);
  const { history } = useEarnings();
  const delivery = history.find((item) => item.orderId === orderId);
  const settled = delivery?.status === 'SETTLED';

  if (isLoading && !breakdown) {
    return (
      <ProfileScreenShell
        title="Delivery earning"
        subtitle="Full breakup"
        onBack={() => router.back()}
      >
        <GSkeleton height={120} borderRadius={theme.radius.xl} />
        <GSkeleton height={72} borderRadius={theme.radius.xl} />
        <GSkeleton height={72} borderRadius={theme.radius.xl} />
      </ProfileScreenShell>
    );
  }

  if (error && !breakdown) {
    return (
      <View style={styles.fallback}>
        <ProfileScreenShell title="Delivery earning" onBack={() => router.back()}>
          <GErrorState
            title="Couldn’t load this earning"
            description={getErrorMessage(error)}
            onRetry={() => {
              void refetch();
            }}
          />
        </ProfileScreenShell>
      </View>
    );
  }

  if (!breakdown) {
    return (
      <ProfileScreenShell
        title="Delivery earning"
        subtitle="Full breakup"
        onBack={() => router.back()}
      >
        <GEmptyState
          title="Earning not found"
          description="This delivery may not have a settled breakup yet."
          actionLabel="Back to earnings"
          onAction={() => router.replace('/(tabs)/earnings')}
        />
      </ProfileScreenShell>
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
    <ProfileScreenShell
      title={delivery?.orderNumber ?? 'Delivery earning'}
      subtitle={delivery ? formatDateTime(delivery.date) : 'Full breakup'}
      onBack={() => router.back()}
      onRefresh={() => {
        void refetch();
      }}
    >
      <ProfileHeroCard
        tone="primary"
        icon="package"
        eyebrow="Net earning"
        title={formatPaise(breakdown.netPaise)}
        body={
          delivery
            ? settled
              ? 'Settled to your weekly payout'
              : 'Pending settlement'
            : 'Delivery earning breakup'
        }
      />

      <GText variant="bodyBold" style={styles.section}>
        Breakup
      </GText>

      {rows.map((row) => (
        <ProfileDetailRow
          key={row.label}
          icon={ROW_ICONS[row.label] ?? 'money'}
          label={row.label}
          value={
            row.deduct
              ? `−${formatPaise(Math.abs(row.value))}`
              : formatPaise(row.value)
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
});
