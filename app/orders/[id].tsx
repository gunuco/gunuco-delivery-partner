import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import {
  GEmptyState,
  GErrorState,
  GLoader,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import type { OrderAction } from '@/src/constants/orderStatus';
import { ORDER_STATUS_META } from '@/src/constants/orderStatus';
import {
  deliveryFailHref,
  deliveryHubHref,
  deliveryNavigateHref,
  deliveryPickupHref,
  deliveryVerifyHref,
  getDeliveryDeepLink,
  getPrimaryActionLabel,
} from '@/src/features/orders/deliveryRouting';
import {
  formatAddress,
  formatDistanceKm,
  formatEtaMinutes,
  formatOrderEarnings,
  getItemsCount,
} from '@/src/features/orders/orderFormat';
import { OrderDetailsActions } from '@/src/features/orders/OrderDetailsActions';
import { OrderDetailsTopBar } from '@/src/features/orders/OrderDetailsTopBar';
import { OrderItemsCard } from '@/src/features/orders/OrderItemsCard';
import { OrderLocationsCard } from '@/src/features/orders/OrderLocationsCard';
import { OrderStatusBanner } from '@/src/features/orders/OrderStatusBanner';
import { OrderTimelineScroll } from '@/src/features/orders/OrderTimelineScroll';
import { buildOrderTimeline } from '@/src/features/orders/orderTimeline';
import { TripSummaryCard } from '@/src/features/orders/TripSummaryCard';
import { useOrder, useOrderActions } from '@/src/hooks';
import { callPhone } from '@/src/services/linking';
import { openExternalNavigation } from '@/src/services/navigation';
import type { Order } from '@/src/types';
import { formatShortDateTime, formatTime } from '@/src/utils/date';
import { getNextPrimaryAction } from '@/src/utils/orderWorkflow';

function buildTopBarSubtitle(order: Order): string {
  if (order.status === 'DELIVERED') {
    const when = order.deliveredAt ?? order.updatedAt;
    return `Delivered on ${formatShortDateTime(when)}`;
  }
  if (order.status === 'FAILED') {
    const when = order.failedAt ?? order.updatedAt;
    return `Failed on ${formatShortDateTime(when)}`;
  }
  if (order.status === 'CANCELLED') {
    return `Cancelled · ${formatShortDateTime(order.updatedAt)}`;
  }
  return ORDER_STATUS_META[order.status]?.title ?? order.status;
}

function buildBannerCopy(order: Order): { title: string; message: string } {
  if (order.status === 'DELIVERED') {
    return {
      title: 'Delivered',
      message: 'Order successfully delivered. Great job!',
    };
  }
  const meta = ORDER_STATUS_META[order.status];
  return {
    title: meta?.title ?? order.status,
    message: meta?.description ?? '',
  };
}

function buildTripCaption(order: Order): string {
  const count = getItemsCount(order);
  if (order.status === 'DELIVERED' && order.deliveredAt) {
    return `${count} items • Completed at ${formatTime(order.deliveredAt)}`;
  }
  if (order.status === 'FAILED' || order.status === 'CANCELLED') {
    return `${count} items • ${ORDER_STATUS_META[order.status]?.title ?? order.status}`;
  }
  return `${count} items • ETA ${formatEtaMinutes(order.estimatedDurationMinutes)}`;
}

export default function OrderDetailsScreen() {
  const toast = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderId = typeof id === 'string' ? id : undefined;
  const { order, isLoading, error, refetch } = useOrder(orderId);
  const actions = useOrderActions();
  const [acting, setActing] = useState(false);

  const timeline = useMemo(
    () => (order ? buildOrderTimeline(order) : []),
    [order],
  );
  const primary = order ? getNextPrimaryAction(order) : null;
  const banner = order ? buildBannerCopy(order) : null;

  const runPrimary = useCallback(async () => {
    if (!order || !primary) return;
    setActing(true);
    try {
      switch (primary) {
        case 'ACCEPT':
          await actions.accept(order.id);
          router.push(deliveryHubHref(order.id));
          break;
        case 'GO_TO_PICKUP':
          await actions.goToPickup(order.id);
          router.push(deliveryNavigateHref(order.id));
          break;
        case 'ARRIVED_PICKUP':
          await actions.markArrivedAtPickup(order.id);
          router.push(deliveryPickupHref(order.id));
          break;
        case 'CONFIRM_PICKUP':
          router.push(deliveryPickupHref(order.id));
          break;
        case 'START_DELIVERY':
          await actions.startDelivery(order.id);
          router.push(deliveryNavigateHref(order.id));
          break;
        case 'ARRIVED_CUSTOMER':
          await actions.markArrivedAtCustomer(order.id);
          router.push(deliveryVerifyHref(order.id));
          break;
        case 'VERIFY_DELIVERY':
          router.push(deliveryVerifyHref(order.id));
          break;
        case 'COMPLETE':
          await actions.complete(order.id);
          router.push(getDeliveryDeepLink({ ...order, status: 'DELIVERED' }));
          break;
        default:
          router.push(getDeliveryDeepLink(order));
      }
    } catch {
      toast.showToast({ type: 'error', message: 'Action failed. Try again.' });
    } finally {
      setActing(false);
    }
  }, [actions, order, primary, toast]);

  const onCall = useCallback(
    async (action: OrderAction) => {
      if (!order) return;
      try {
        if (action === 'CALL_CUSTOMER' && order.customerPhoneMasked) {
          await callPhone(order.customerPhoneMasked);
        } else if (action === 'CALL_STORE') {
          toast.showToast({
            type: 'info',
            message: 'Store contact will be available from support.',
          });
        }
      } catch (err) {
        toast.showToast({
          type: 'error',
          message: err instanceof Error ? err.message : 'Unable to place call',
        });
      }
    },
    [order, toast],
  );

  const openMap = useCallback(
    async (target: 'pickup' | 'delivery') => {
      if (!order) return;
      const coords =
        target === 'delivery'
          ? order.delivery?.address?.coordinates
          : order.pickup?.address?.coordinates;
      if (!coords) {
        toast.showToast({ type: 'warning', message: 'No coordinates available' });
        return;
      }
      await openExternalNavigation({
        lat: coords.latitude,
        lng: coords.longitude,
        label: target === 'delivery' ? order.customerName : order.pickup?.name,
      });
    },
    [order, toast],
  );

  const onNavigate = useCallback(async () => {
    if (!order) return;
    const toCustomer =
      order.status === 'GOING_TO_CUSTOMER' ||
      order.status === 'PICKED_UP' ||
      order.status === 'ARRIVED_AT_CUSTOMER' ||
      order.status === 'DELIVERY_VERIFICATION' ||
      order.status === 'DELIVERED';
    await openMap(toCustomer ? 'delivery' : 'pickup');
  }, [openMap, order]);

  if (isLoading) {
    return (
      <View style={styles.root}>
        <OrderDetailsTopBar
          orderNumber="…"
          subtitle="Loading"
          onBack={() => router.back()}
          onSupport={() => router.push('/support')}
        />
        <GLoader label="Loading order…" />
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={styles.root}>
        <OrderDetailsTopBar
          orderNumber="Order"
          subtitle="Unavailable"
          onBack={() => router.back()}
          onSupport={() => router.push('/support')}
        />
        <GErrorState
          title="Order not found"
          onRetry={() => {
            void refetch();
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <OrderDetailsTopBar
        orderNumber={order.orderNumber}
        subtitle={buildTopBarSubtitle(order)}
        onBack={() => router.back()}
        onSupport={() => router.push('/support')}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {banner ? (
          <OrderStatusBanner
            status={order.status}
            title={banner.title}
            message={banner.message}
          />
        ) : null}

        <OrderTimelineScroll points={timeline} />

        <TripSummaryCard
          distanceLabel={formatDistanceKm(order.distanceKm)}
          durationLabel={formatEtaMinutes(order.estimatedDurationMinutes)}
          earningsLabel={formatOrderEarnings(order)}
          caption={buildTripCaption(order)}
          onPressEarnings={() => router.push(`/earnings/delivery/${order.id}`)}
        />

        <OrderLocationsCard
          pickupName={order.pickup?.name ?? 'Pickup'}
          pickupAddress={formatAddress(order.pickup?.address)}
          pickupInstructions={order.pickup?.instructions}
          customerName={order.customerName}
          deliveryAddress={formatAddress(order.delivery?.address)}
          deliveryInstructions={order.delivery?.instructions}
          onOpenPickupMap={() => {
            void openMap('pickup');
          }}
          onOpenDeliveryMap={() => {
            void openMap('delivery');
          }}
        />

        <OrderItemsCard items={order.items ?? []} itemsCount={getItemsCount(order)} />

        {order.specialInstructions ? (
          <View style={styles.specialCard}>
            <GText variant="bodyBold">Special instructions</GText>
            <GText variant="body" color={theme.colors.textSecondary}>
              {order.specialInstructions}
            </GText>
          </View>
        ) : null}

        {(order.items ?? []).length === 0 ? (
          <GEmptyState title="No items on this order" />
        ) : null}
      </ScrollView>

      <OrderDetailsActions
        primaryLabel={primary ? getPrimaryActionLabel(primary) : null}
        primaryLoading={acting || actions.isActing}
        onPrimary={
          primary
            ? () => {
                void runPrimary();
              }
            : undefined
        }
        onCallCustomer={() => {
          void onCall('CALL_CUSTOMER');
        }}
        onNavigate={() => {
          void onNavigate();
        }}
        onOpenHub={() => router.push(deliveryHubHref(order.id))}
        onReportIssue={() => router.push(deliveryFailHref(order.id))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.spacing[4],
    paddingBottom: theme.spacing[6],
    gap: theme.spacing[4],
  },
  specialCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    padding: theme.spacing[4],
    gap: theme.spacing[2],
    ...theme.shadows.sm,
  },
});
