import { Image } from 'expo-image';
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
  GEarningsCard,
  GEmptyState,
  GErrorState,
  GIcon,
  GSkeleton,
  GStatCard,
  GText,
  theme,
  type IconName,
} from '@/src/design-system';
import { useEarnings } from '@/src/hooks';
import { formatDate, formatRelativeTime } from '@/src/utils/date';
import { getErrorMessage } from '@/src/utils/errors';
import { formatPaise } from '@/src/utils/money';
import { earningsImageSources } from '../../assets/images/earnings/sources';

const BG = '#FFF5F7';
const BANNER_ASPECT = 1024 / 377;

type PeriodKey = 'today' | 'week' | 'month' | 'total';

const PERIODS: { key: PeriodKey; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'total', label: 'Total' },
];

function StatIcon({ name }: { name: IconName }) {
  return (
    <View style={styles.statIcon}>
      <GIcon name={name} size={16} color={theme.colors.primary} />
    </View>
  );
}

function NavRow({
  title,
  subtitle,
  icon,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: IconName;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [styles.navRow, pressed && styles.pressed]}
    >
      <View style={styles.rowIcon}>
        <GIcon name={icon} size={20} color={theme.colors.primary} />
      </View>
      <View style={styles.navCopy}>
        <GText variant="bodyBold">{title}</GText>
        <GText variant="caption" color={theme.colors.textSecondary}>
          {subtitle}
        </GText>
      </View>
      <GIcon name="chevronRight" size={18} color={theme.colors.textMuted} />
    </Pressable>
  );
}

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
          label: 'Week',
          amount: formatPaise(summary.weekPaise),
          subtitle: 'Week-to-date earnings',
        };
      case 'month':
        return {
          label: 'Month',
          amount: formatPaise(summary.monthPaise),
          subtitle: 'Month-to-date earnings',
        };
      case 'total':
        return {
          label: 'Lifetime',
          amount: formatPaise(summary.totalPaise),
          subtitle: 'Lifetime GUNUCO earnings',
        };
      case 'today':
      default:
        return {
          label: 'Today',
          amount: formatPaise(summary.todayPaise),
          subtitle: `${summary.todayOrders ?? 0} deliveries • ${(summary.todayDistanceKm ?? 0).toFixed(1)} km`,
        };
    }
  }, [period, summary]);

  if (isLoading && !summary) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={styles.heroBanner}>
          <GSkeleton height={140} borderRadius={0} />
        </View>
        <View style={styles.pad}>
          <GSkeleton height={132} borderRadius={theme.radius.xl} />
          <View style={styles.row}>
            <GSkeleton height={96} style={styles.flex} borderRadius={theme.radius.xl} />
            <GSkeleton height={96} style={styles.flex} borderRadius={theme.radius.xl} />
          </View>
        </View>
      </View>
    );
  }

  if (error && !summary) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <View style={styles.heroBanner}>
          <Image
            source={earningsImageSources.banner}
            style={styles.bannerImage}
            contentFit="contain"
            accessibilityLabel="Earnings — Track every rupee from deliveries"
          />
        </View>
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
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroBanner}>
          <Image
            source={earningsImageSources.banner}
            style={styles.bannerImage}
            contentFit="contain"
            contentPosition="center"
            accessibilityLabel="Earnings — Track every rupee from deliveries"
            transition={120}
          />
        </View>

        <View style={styles.body}>
          <GEarningsCard
            periodLabel={hero.label}
            amount={hero.amount}
            subtitle={hero.subtitle}
            backgroundSource={earningsImageSources.heroCard}
          />

          <View style={styles.chips}>
            {PERIODS.map((item) => {
              const selected = period === item.key;
              return (
                <Pressable
                  key={item.key}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                  accessibilityState={{ selected }}
                  onPress={() => setPeriod(item.key)}
                  style={({ pressed }) => [
                    styles.chip,
                    selected ? styles.chipSelected : styles.chipIdle,
                    pressed && !selected ? styles.pressed : null,
                  ]}
                >
                  <GText
                    variant="caption"
                    color={selected ? theme.colors.textInverse : theme.colors.text}
                    style={styles.chipLabel}
                  >
                    {item.label}
                  </GText>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.stats}>
            <GStatCard
              label="Today"
              value={formatPaise(summary?.todayPaise ?? 0)}
              subtitle={`${summary?.todayOrders ?? 0} orders`}
              icon={<StatIcon name="calendar" />}
            />
            <GStatCard
              label="Week"
              value={formatPaise(summary?.weekPaise ?? 0)}
              icon={<StatIcon name="chart" />}
            />
          </View>
          <View style={styles.stats}>
            <GStatCard
              label="Month"
              value={formatPaise(summary?.monthPaise ?? 0)}
              icon={<StatIcon name="calendar" />}
            />
            <GStatCard
              label="Lifetime"
              value={formatPaise(summary?.totalPaise ?? 0)}
              icon={<StatIcon name="infinity" />}
            />
          </View>

          <View style={styles.navGroup}>
            <NavRow
              title="Earnings breakdown"
              subtitle="Base, distance, surge, incentives"
              icon="money"
              onPress={() => router.push('/earnings/details')}
            />
            <View style={styles.navDivider} />
            <NavRow
              title="Payout history"
              subtitle="Weekly bank credits"
              icon="document"
              onPress={() => router.push('/earnings/payouts')}
            />
          </View>

          <View style={styles.sectionHeader}>
            <View style={styles.sectionCopy}>
              <GText variant="bodyBold">Delivery-wise</GText>
              <GText variant="caption" color={theme.colors.textSecondary}>
                Tap a delivery for full breakup
              </GText>
            </View>
          </View>

          {history.length === 0 ? (
            <GEmptyState
              title="No delivery earnings yet"
              description="Completed deliveries will show here with a full breakup."
            />
          ) : (
            history.map((item) => {
              const settled = item.status === 'SETTLED';
              return (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Delivery ${item.orderNumber}`}
                  onPress={() => router.push(`/earnings/delivery/${item.orderId}`)}
                  style={({ pressed }) => [
                    styles.deliveryRow,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.rowIcon}>
                    <GIcon name="package" size={20} color={theme.colors.primary} />
                  </View>
                  <View style={styles.deliveryCopy}>
                    <GText variant="bodyBold">{item.orderNumber}</GText>
                    <GText variant="caption" color={theme.colors.textSecondary}>
                      {formatDate(item.date)} • {formatRelativeTime(item.date)}
                    </GText>
                  </View>
                  <View style={styles.deliveryRight}>
                    <GText variant="bodyBold">
                      {formatPaise(item.breakdown?.netPaise ?? 0)}
                    </GText>
                    <View
                      style={[
                        styles.statusPill,
                        settled ? styles.statusSettled : styles.statusPending,
                      ]}
                    >
                      <GText
                        variant="label"
                        color={
                          settled
                            ? theme.colors.textInverse
                            : theme.colors.warning
                        }
                      >
                        {settled ? 'Settled' : 'Pending'}
                      </GText>
                    </View>
                  </View>
                  <GIcon name="chevronRight" size={18} color={theme.colors.textMuted} />
                </Pressable>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },
  content: {
    paddingBottom: theme.spacing[10],
  },
  pad: {
    padding: theme.spacing[4],
    gap: theme.spacing[3],
  },
  heroBanner: {
    width: '100%',
    aspectRatio: BANNER_ASPECT,
    backgroundColor: BG,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  body: {
    paddingHorizontal: theme.spacing[4],
    gap: theme.spacing[3],
    paddingTop: theme.spacing[1],
  },
  chips: {
    flexDirection: 'row',
    gap: theme.spacing[2],
  },
  chip: {
    flex: 1,
    minHeight: 40,
    borderRadius: theme.radius.full,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing[2],
  },
  chipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipIdle: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.borderStrong,
  },
  chipLabel: {
    fontWeight: '600',
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
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navGroup: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    minHeight: 64,
  },
  navDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border,
    marginLeft: theme.spacing[4] + 40 + theme.spacing[3],
  },
  navCopy: {
    flex: 1,
    gap: 2,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: theme.spacing[1],
  },
  sectionCopy: {
    gap: 2,
    flex: 1,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[3],
    ...theme.shadows.sm,
  },
  deliveryCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  deliveryRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusPill: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: 2,
    borderRadius: theme.radius.full,
  },
  statusSettled: {
    backgroundColor: theme.colors.success,
  },
  statusPending: {
    backgroundColor: theme.colors.warningSoft,
  },
  pressed: {
    opacity: 0.9,
  },
});
