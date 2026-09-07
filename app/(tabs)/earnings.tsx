import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  GBadge,
  GChip,
  GEarningsCard,
  GEmptyState,
  GErrorState,
  GHeader,
  GIcon,
  GListRow,
  GSectionHeader,
  GSkeleton,
  GStatCard,
  GText,
  theme,
} from '@/src/design-system';
import { useEarnings } from '@/src/hooks';
import { formatDate, formatRelativeTime } from '@/src/utils/date';
import { getErrorMessage } from '@/src/utils/errors';
import { formatPaise } from '@/src/utils/money';

type PeriodKey = 'today' | 'week' | 'month' | 'total';

export default function EarningsDashboardScreen() {
  const insets = useSafeAreaInsets();
  const { summary, history, isLoading, error, refetch, isFetching } =
    useEarnings();
  const [period, setPeriod] = useState<PeriodKey>('today');

  const hero = useMemo(() => {
    if (!summary) {
      return { amount: formatPaise(0), subtitle: 'Loading…', label: 'Today' };
    }
    switch (period) {
      case 'week':
        return {
          label: 'This week',
          amount: formatPaise(summary.weekPaise),
          subtitle: 'Week-to-date earnings',
        };
      case 'month':
        return {
          label: 'This month',
          amount: formatPaise(summary.monthPaise),
          subtitle: 'Month-to-date earnings',
        };
      case 'total':
        return {
          label: 'All time',
          amount: formatPaise(summary.totalPaise),
          subtitle: 'Lifetime GUNUCO earnings',
        };
      case 'today':
      default:
        return {
          label: 'Today',
          amount: formatPaise(summary.todayPaise),
          subtitle: `${summary.todayOrders ?? 0} deliveries · ${(summary.todayDistanceKm ?? 0).toFixed(1)} km`,
        };
    }
  }, [period, summary]);

  if (isLoading && !summary) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <GHeader title="Earnings" />
        <View style={styles.pad}>
          <GSkeleton height={140} borderRadius={theme.radius.lg} />
          <View style={styles.row}>
            <GSkeleton height={88} style={styles.flex} borderRadius={theme.radius.lg} />
            <GSkeleton height={88} style={styles.flex} borderRadius={theme.radius.lg} />
          </View>
          <GSkeleton height={56} borderRadius={theme.radius.md} />
          <GSkeleton height={56} borderRadius={theme.radius.md} />
        </View>
      </View>
    );
  }

  if (error && !summary) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <GHeader title="Earnings" />
        <GErrorState
          title="Couldn’t load earnings"
          description={getErrorMessage(error)}
          onRetry={() => {
            void refetch();
          }}
        />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <GHeader
        title="Earnings"
        subtitle="Track every rupee from deliveries"
        rightActions={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open payouts"
            onPress={() => router.push('/earnings/payouts')}
            hitSlop={8}
          >
            <GIcon name="money" size={22} color={theme.colors.primary} />
          </Pressable>
        }
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
        <GEarningsCard
          periodLabel={hero.label}
          amount={hero.amount}
          subtitle={hero.subtitle}
        />

        <View style={styles.chips}>
          {(
            [
              ['today', 'Today'],
              ['week', 'Week'],
              ['month', 'Month'],
              ['total', 'Total'],
            ] as const
          ).map(([key, label]) => (
            <GChip
              key={key}
              label={label}
              selected={period === key}
              onPress={() => setPeriod(key)}
            />
          ))}
        </View>

        <View style={styles.stats}>
          <GStatCard
            label="Today"
            value={formatPaise(summary?.todayPaise ?? 0)}
            subtitle={`${summary?.todayOrders ?? 0} orders`}
          />
          <GStatCard
            label="Week"
            value={formatPaise(summary?.weekPaise ?? 0)}
          />
        </View>
        <View style={styles.stats}>
          <GStatCard
            label="Month"
            value={formatPaise(summary?.monthPaise ?? 0)}
          />
          <GStatCard
            label="Lifetime"
            value={formatPaise(summary?.totalPaise ?? 0)}
          />
        </View>

        <GListRow
          title="Earnings breakdown"
          subtitle="Base, distance, surge, incentives"
          left={<GIcon name="money" size={22} color={theme.colors.primary} />}
          showChevron
          onPress={() => router.push('/earnings/details')}
        />
        <GListRow
          title="Payout history"
          subtitle="Weekly bank credits"
          left={<GIcon name="document" size={22} color={theme.colors.primary} />}
          showChevron
          onPress={() => router.push('/earnings/payouts')}
        />

        <GSectionHeader
          title="Delivery-wise"
          subtitle="Tap a delivery for full breakup"
        />
        {history.length === 0 ? (
          <GEmptyState
            title="No delivery earnings yet"
            description="Completed deliveries will show here with a full breakup."
          />
        ) : (
          history.map((item) => (
            <GListRow
              key={item.id}
              title={item.orderNumber}
              subtitle={`${formatDate(item.date)} · ${formatRelativeTime(item.date)}`}
              right={
                <View style={styles.earningRight}>
                  <GText variant="bodyBold">
                    {formatPaise(item.breakdown?.netPaise ?? 0)}
                  </GText>
                  <GBadge
                    label={item.status === 'SETTLED' ? 'Settled' : 'Pending'}
                    tone={item.status === 'SETTLED' ? 'success' : 'warning'}
                  />
                </View>
              }
              showChevron
              onPress={() =>
                router.push(`/earnings/delivery/${item.orderId}`)
              }
            />
          ))
        )}
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
    padding: theme.spacing[4],
    gap: theme.spacing[3],
    paddingBottom: theme.spacing[8],
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
  },
  stats: {
    flexDirection: 'row',
    gap: theme.spacing[3],
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing[3],
  },
  flex: {
    flex: 1,
  },
  earningRight: {
    alignItems: 'flex-end',
    gap: theme.spacing[1],
  },
});
