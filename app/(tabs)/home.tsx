import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  GButton,
  GCard,
  GEmptyState,
  GErrorState,
  GOrderCard,
  GSectionHeader,
  GSkeleton,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import { DemandAreasRow } from '@/src/features/home/DemandAreasRow';
import { HomeHeader } from '@/src/features/home/HomeHeader';
import { HomeStatsRow } from '@/src/features/home/HomeStatsRow';
import { OnlineStatusCard } from '@/src/features/home/OnlineStatusCard';
import { QuickActionsGrid } from '@/src/features/home/QuickActionsGrid';
import { RecentOrdersSection } from '@/src/features/home/RecentOrdersSection';
import { WeeklyIncentiveCard } from '@/src/features/home/WeeklyIncentiveCard';
import {
  assignmentHref,
  getDeliveryDeepLink,
  orderDetailsHref,
} from '@/src/features/orders/deliveryRouting';
import { formatDistanceKm, formatOrderEarnings } from '@/src/features/orders/orderFormat';
import {
  useDemand,
  useEarnings,
  useIncentives,
  useNotifications,
  useOrders,
  usePartner,
} from '@/src/hooks';
import type { Order } from '@/src/types';

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
  const { summary, isLoading: earningsLoading, refetch: refetchEarnings } = useEarnings();
  const { active: incentives, refetch: refetchIncentives } = useIncentives();
  const { zones, nearby, isLoading: demandLoading, refetch: refetchDemand } = useDemand();
  const { unreadCount, refetch: refetchNotifications } = useNotifications();

  const isOnline = availability === 'ONLINE' || availability === 'BUSY';
  const assignedPending = activeOrder?.status === 'ASSIGNED' ? activeOrder : null;

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5),
    [orders],
  );

  const demandZones = nearby.length > 0 ? nearby : zones;
  const topIncentive = incentives.find((i) => i.targetType === 'WEEKLY') ?? incentives[0];

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
      refetchNotifications(),
    ]);
  }, [
    refetchActive,
    refetchDemand,
    refetchEarnings,
    refetchIncentives,
    refetchList,
    refetchNotifications,
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
  const partnerName = partner?.name ?? 'Partner';

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
        <HomeHeader
          partnerName={partnerName}
          photoUrl={partner?.photoUrl}
          isOnline={isOnline}
          unreadCount={unreadCount}
          onNotifications={() => router.push('/notifications')}
          onProfile={() => router.push('/(tabs)/profile')}
        />

        <OnlineStatusCard
          isOnline={isOnline}
          isToggling={isTogglingAvailability}
          onToggle={onToggleAvailability}
        />

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
            <GSkeleton height={88} borderRadius={theme.radius.xl} />
            <GSkeleton height={88} borderRadius={theme.radius.xl} />
            <GSkeleton height={120} borderRadius={theme.radius.xl} />
          </View>
        ) : listError ? (
          <GErrorState
            title="Couldn't load home"
            description="Check your connection and try again."
            onRetry={onRefresh}
          />
        ) : (
          <>
            <HomeStatsRow summary={summary} rating={partner?.rating ?? 0} />

            {topIncentive ? <WeeklyIncentiveCard incentive={topIncentive} /> : null}

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

            {demandZones.length > 0 ? (
              <DemandAreasRow
                zones={demandZones.slice(0, 8)}
                onViewMap={() => router.push('/demand')}
              />
            ) : demandLoading ? null : (
              <GEmptyState
                title="No demand data"
                description="Demand zones will appear when available."
              />
            )}

            <QuickActionsGrid
              onSupport={() => router.push('/support')}
              onEmergency={() => router.push('/emergency')}
              onAlerts={() => router.push('/notifications')}
              onHelp={() => router.push('/support/faq')}
            />

            {recentOrders.length === 0 ? (
              <GEmptyState
                title="No recent orders"
                description="Completed and active orders will show up here."
              />
            ) : (
              <RecentOrdersSection
                orders={recentOrders}
                onViewAll={() => router.push('/(tabs)/orders')}
                onOpenOrder={openOrder}
              />
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFF5F7',

    // backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing[4],
    paddingBottom: theme.spacing[10],
    gap: theme.spacing[4],
  },
  assignBanner: {
    gap: theme.spacing[2],
    borderColor: theme.colors.info,
    backgroundColor: theme.colors.infoSoft,
  },
  assignCta: {
    marginTop: theme.spacing[2],
  },
  skeletonBlock: {
    gap: theme.spacing[3],
  },
  section: {
    gap: theme.spacing[2],
  },
});
