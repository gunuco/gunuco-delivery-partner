import { useCallback, useMemo } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  GBadge,
  GButton,
  GCard,
  GEmptyState,
  GErrorState,
  GIcon,
  GOrderCard,
  GProgress,
  GSectionHeader,
  GSkeleton,
  GStatCard,
  GSwitch,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import {
  assignmentHref,
  getDeliveryDeepLink,
  orderDetailsHref,
} from '@/src/features/orders/deliveryRouting';
import {
  formatDistanceKm,
  formatOrderEarnings,
} from '@/src/features/orders/orderFormat';
import {
  useDemand,
  useEarnings,
  useIncentives,
  useOrders,
  usePartner,
} from '@/src/hooks';
import { formatPaise } from '@/src/utils/money';
import type { DemandLevel, Order } from '@/src/types';

function demandTone(level: DemandLevel): 'danger' | 'warning' | 'success' {
  if (level === 'HIGH') return 'danger';
  if (level === 'LOW') return 'success';
  return 'warning';
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const {
    partner,
    availability,
    isTogglingAvailability,
    isLoading: partnerLoading,
    goOnline,
    goOffline,
    refetch: refetchPartner,
  } = usePartner();
  const {
    orders,
    activeOrder,
    isLoading: ordersLoading,
    listError,
    refetchList,
    refetchActive,
  } = useOrders({ includeHistory: true });
  const { summary, isLoading: earningsLoading, refetch: refetchEarnings } =
    useEarnings();
  const { active: incentives, refetch: refetchIncentives } = useIncentives();
  const { zones, nearby, isLoading: demandLoading, refetch: refetchDemand } =
    useDemand();

  const isOnline = availability === 'ONLINE' || availability === 'BUSY';
  const assignedPending = activeOrder?.status === 'ASSIGNED' ? activeOrder : null;

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
        .slice(0, 5),
    [orders],
  );

  const demandZones = nearby.length > 0 ? nearby : zones;
  const topIncentive = incentives[0];

  const onToggleAvailability = useCallback(
    async (next: boolean) => {
      try {
        if (next) {
          await goOnline();
          toast.showToast({ type: 'success', message: 'You are online' });
        } else {
          await goOffline();
          toast.showToast({ type: 'info', message: 'You are offline' });
        }
      } catch {
        toast.showToast({
          type: 'error',
          message: 'Could not update availability. Please try again.',
        });
      }
    },
    [goOffline, goOnline, toast],
  );

  const onRefresh = useCallback(async () => {
    await Promise.all([
      refetchPartner(),
      refetchList(),
      refetchActive(),
      refetchEarnings(),
      refetchIncentives(),
      refetchDemand(),
    ]);
  }, [
    refetchActive,
    refetchDemand,
    refetchEarnings,
    refetchIncentives,
    refetchList,
    refetchPartner,
  ]);

  const openOrder = useCallback((order: Order) => {
    if (
      order.status === 'ASSIGNED' ||
      order.status === 'ACCEPTED' ||
      order.status === 'GOING_TO_PICKUP' ||
      order.status === 'ARRIVED_AT_PICKUP' ||
      order.status === 'PICKED_UP' ||
      order.status === 'GOING_TO_CUSTOMER' ||
      order.status === 'ARRIVED_AT_CUSTOMER' ||
      order.status === 'DELIVERY_VERIFICATION'
    ) {
      router.push(getDeliveryDeepLink(order));
      return;
    }
    router.push(orderDetailsHref(order.id));
  }, []);

  const loading = partnerLoading || ordersLoading || earningsLoading;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={styles.headerRow}>
          <View style={styles.brandCol}>
            <GText variant="caption" color={theme.colors.textSecondary}>
              GUNUCO Partner
            </GText>
            <GText variant="h2">{partner?.name ?? 'Delivery partner'}</GText>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            onPress={() => router.push('/notifications')}
            style={styles.iconBtn}
          >
            <GIcon name="notification" size={22} color={theme.colors.primary} />
          </Pressable>
        </View>

        <GCard padding="md" style={styles.availabilityCard}>
          <GSwitch
            label={isOnline ? 'Online' : 'Offline'}
            description={
              isOnline
                ? 'Receiving new order assignments'
                : 'Go online to start receiving orders'
            }
            value={isOnline}
            onValueChange={onToggleAvailability}
            disabled={isTogglingAvailability}
          />
          <GBadge
            label={availability ?? 'UNKNOWN'}
            tone={isOnline ? 'success' : 'neutral'}
          />
        </GCard>

        {assignedPending ? (
          <GCard padding="md" style={styles.assignBanner}>
            <GText variant="bodyBold">New order waiting</GText>
            <GText variant="body" color={theme.colors.textSecondary}>
              #{assignedPending.orderNumber} · {assignedPending.customerArea}
            </GText>
            <GButton
              title="Open assignment"
              size="lg"
              fullWidth
              onPress={() => router.push(assignmentHref(assignedPending.id))}
              style={styles.assignCta}
            />
          </GCard>
        ) : null}

        {loading ? (
          <View style={styles.skeletonBlock}>
            <GSkeleton height={88} borderRadius={theme.radius.lg} />
            <GSkeleton height={88} borderRadius={theme.radius.lg} />
            <GSkeleton height={120} borderRadius={theme.radius.lg} />
          </View>
        ) : listError ? (
          <GErrorState
            title="Couldn't load home"
            description="Check your connection and try again."
            onRetry={onRefresh}
          />
        ) : (
          <>
            <View style={styles.statsRow}>
              <GStatCard
                label="Today"
                value={formatPaise(summary?.todayPaise ?? 0)}
                subtitle={`${summary?.todayOrders ?? 0} orders`}
              />
              <GStatCard
                label="Distance"
                value={formatDistanceKm(summary?.todayDistanceKm ?? 0)}
                subtitle="Today"
              />
            </View>

            {topIncentive ? (
              <GCard padding="md" style={styles.sectionCard}>
                <GSectionHeader
                  title="Incentive"
                  subtitle={topIncentive.remainingLabel ?? topIncentive.title}
                />
                <GText variant="body" color={theme.colors.textSecondary}>
                  {topIncentive.description}
                </GText>
                <GProgress
                  progress={
                    topIncentive.targetValue > 0
                      ? topIncentive.currentValue / topIncentive.targetValue
                      : 0
                  }
                />
                <GText variant="caption" color={theme.colors.textMuted}>
                  {topIncentive.currentValue}/{topIncentive.targetValue} · Reward{' '}
                  {formatPaise(topIncentive.rewardPaise)}
                </GText>
              </GCard>
            ) : null}

            {activeOrder && activeOrder.status !== 'ASSIGNED' ? (
              <View style={styles.section}>
                <GSectionHeader title="Active order" />
                <GOrderCard
                  orderNumber={activeOrder.orderNumber}
                  status={activeOrder.status}
                  customerArea={activeOrder.customerArea}
                  earnings={formatOrderEarnings(activeOrder)}
                  distance={formatDistanceKm(activeOrder.distanceKm)}
                  onPress={() => openOrder(activeOrder)}
                />
              </View>
            ) : null}

            <View style={styles.section}>
              <GSectionHeader
                title="Demand nearby"
                subtitle={demandLoading ? 'Updating…' : undefined}
              />
              {demandZones.length === 0 ? (
                <GEmptyState
                  title="No demand data"
                  description="Demand zones will appear when available."
                />
              ) : (
                <View style={styles.demandList}>
                  {demandZones.slice(0, 4).map((zone) => (
                    <View key={zone.id} style={styles.demandRow}>
                      <GText variant="bodyBold" style={styles.demandName}>
                        {zone.name}
                      </GText>
                      <GBadge label={zone.level} tone={demandTone(zone.level)} />
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.section}>
              <GSectionHeader title="Quick actions" />
              <View style={styles.quickRow}>
                <GButton
                  title="Support"
                  variant="secondary"
                  onPress={() => router.push('/support')}
                  style={styles.quickBtn}
                />
                <GButton
                  title="Emergency"
                  variant="danger"
                  onPress={() => router.push('/emergency')}
                  style={styles.quickBtn}
                />
                <GButton
                  title="Alerts"
                  variant="outline"
                  onPress={() => router.push('/notifications')}
                  style={styles.quickBtn}
                />
              </View>
            </View>

            <View style={styles.section}>
              <GSectionHeader title="Recent orders" />
              {recentOrders.length === 0 ? (
                <GEmptyState
                  title="No recent orders"
                  description="Completed and active orders will show up here."
                />
              ) : (
                <View style={styles.orderList}>
                  {recentOrders.map((order) => (
                    <GOrderCard
                      key={order.id}
                      orderNumber={order.orderNumber}
                      status={order.status}
                      customerArea={order.customerArea}
                      earnings={formatOrderEarnings(order)}
                      distance={formatDistanceKm(order.distanceKm)}
                      onPress={() => openOrder(order)}
                    />
                  ))}
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing[4],
    paddingBottom: theme.spacing[10],
    gap: theme.spacing[4],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandCol: {
    flex: 1,
    gap: 2,
  },
  iconBtn: {
    width: theme.components.minTouchTarget,
    height: theme.components.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  availabilityCard: {
    gap: theme.spacing[2],
  },
  assignBanner: {
    gap: theme.spacing[2],
    borderColor: theme.colors.info,
    backgroundColor: '#E6EEFC',
  },
  assignCta: {
    marginTop: theme.spacing[2],
  },
  skeletonBlock: {
    gap: theme.spacing[3],
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing[3],
  },
  section: {
    gap: theme.spacing[2],
  },
  sectionCard: {
    gap: theme.spacing[2],
  },
  demandList: {
    gap: theme.spacing[2],
  },
  demandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing[3],
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  demandName: {
    flex: 1,
    marginRight: theme.spacing[2],
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
  },
  quickBtn: {
    flexGrow: 1,
  },
  orderList: {
    gap: theme.spacing[3],
  },
});
