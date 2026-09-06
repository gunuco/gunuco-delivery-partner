import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import {
  GButton,
  GCard,
  GEmptyState,
  GErrorState,
  GHeader,
  GListRow,
  GLoader,
  GStatusBadge,
  GStepIndicator,
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
  collectHandlingInstructions,
  formatAddress,
  formatDistanceKm,
  formatEtaMinutes,
  formatOrderEarnings,
  getItemsCount,
} from '@/src/features/orders/orderFormat';
import { useOrder, useOrderActions } from '@/src/hooks';
import { callPhone } from '@/src/services/linking';
import { openExternalNavigation } from '@/src/services/navigation';
import {
  getNextPrimaryAction,
  getOrderProgressSteps,
} from '@/src/utils/orderWorkflow';

export default function OrderDetailsScreen() {
  const toast = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderId = typeof id === 'string' ? id : undefined;
  const { order, isLoading, error, refetch } = useOrder(orderId);
  const actions = useOrderActions();
  const [acting, setActing] = useState(false);

  const steps = useMemo(
    () => (order ? getOrderProgressSteps(order.status) : []),
    [order],
  );
  const stepLabels = steps.map((step) => step.label);
  const currentIndex = Math.max(
    0,
    steps.findIndex((step) => step.current),
  );
  const primary = order ? getNextPrimaryAction(order) : null;
  const meta = order ? ORDER_STATUS_META[order.status] : null;
  const handling = order ? collectHandlingInstructions(order.items) : [];

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

  const onNavigate = useCallback(async () => {
    if (!order) return;
    const coords =
      order.status === 'GOING_TO_CUSTOMER' ||
      order.status === 'PICKED_UP' ||
      order.status === 'ARRIVED_AT_CUSTOMER'
        ? order.delivery.address.coordinates
        : order.pickup.address.coordinates;
    if (!coords) {
      toast.showToast({ type: 'warning', message: 'No coordinates available' });
      return;
    }
    await openExternalNavigation({
      lat: coords.latitude,
      lng: coords.longitude,
      label:
        order.status === 'GOING_TO_CUSTOMER' || order.status === 'PICKED_UP'
          ? order.customerName
          : order.pickup.name,
    });
  }, [order, toast]);

  if (isLoading) {
    return (
      <View style={styles.root}>
        <GHeader title="Order" showBack onBack={() => router.back()} />
        <GLoader label="Loading order…" />
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={styles.root}>
        <GHeader title="Order" showBack onBack={() => router.back()} />
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
      <GHeader
        title={`#${order.orderNumber}`}
        subtitle={meta?.title}
        showBack
        onBack={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statusRow}>
          <GStatusBadge status={order.status} kind="order" />
          <GText variant="caption" color={theme.colors.textSecondary}>
            {meta?.description}
          </GText>
        </View>

        <GStepIndicator steps={stepLabels} currentIndex={currentIndex} />

        <GCard padding="md" style={styles.card}>
          <GText variant="title">Trip</GText>
          <GText variant="body">
            {formatDistanceKm(order.distanceKm)} ·{' '}
            {formatEtaMinutes(order.estimatedDurationMinutes)} ·{' '}
            {formatOrderEarnings(order)}
          </GText>
          <GText variant="caption" color={theme.colors.textMuted}>
            {getItemsCount(order)} items
          </GText>
        </GCard>

        <GCard padding="md" style={styles.card}>
          <GText variant="title">Pickup</GText>
          <GText variant="bodyBold">{order.pickup.name}</GText>
          <GText variant="body" color={theme.colors.textSecondary}>
            {formatAddress(order.pickup.address)}
          </GText>
          {order.pickup.instructions ? (
            <GText variant="caption" color={theme.colors.textMuted}>
              {order.pickup.instructions}
            </GText>
          ) : null}
        </GCard>

        <GCard padding="md" style={styles.card}>
          <GText variant="title">Customer</GText>
          <GText variant="bodyBold">{order.customerName}</GText>
          <GText variant="body" color={theme.colors.textSecondary}>
            {formatAddress(order.delivery.address)}
          </GText>
          {order.delivery.instructions ? (
            <GText variant="caption" color={theme.colors.textMuted}>
              {order.delivery.instructions}
            </GText>
          ) : null}
        </GCard>

        <GCard padding="md" style={styles.card}>
          <GText variant="title">Items</GText>
          {order.items.map((item) => (
            <GListRow
              key={item.id}
              title={`${item.quantity}× ${item.name}`}
              subtitle={item.handlingInstructions.join(' · ') || undefined}
            />
          ))}
          {handling.length === 0 ? (
            <GEmptyState title="No special handling" />
          ) : null}
        </GCard>

        {order.specialInstructions ? (
          <GCard padding="md" style={styles.card}>
            <GText variant="title">Special instructions</GText>
            <GText variant="body">{order.specialInstructions}</GText>
          </GCard>
        ) : null}

        <View style={styles.contactRow}>
          <GButton
            title="Call customer"
            variant="secondary"
            onPress={() => {
              void onCall('CALL_CUSTOMER');
            }}
            style={styles.flex}
          />
          <GButton
            title="Navigate"
            variant="outline"
            onPress={() => {
              void onNavigate();
            }}
            style={styles.flex}
          />
        </View>

        {primary ? (
          <GButton
            title={getPrimaryActionLabel(primary)}
            size="lg"
            fullWidth
            loading={acting || actions.isActing}
            onPress={() => {
              void runPrimary();
            }}
          />
        ) : null}

        <GButton
          title="Open delivery hub"
          variant="ghost"
          fullWidth
          onPress={() => router.push(deliveryHubHref(order.id))}
        />
        <GButton
          title="Report issue"
          variant="danger"
          fullWidth
          onPress={() => router.push(deliveryFailHref(order.id))}
        />
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
    gap: theme.spacing[4],
    paddingBottom: theme.spacing[10],
  },
  statusRow: {
    gap: theme.spacing[2],
  },
  card: {
    gap: theme.spacing[2],
  },
  contactRow: {
    flexDirection: 'row',
    gap: theme.spacing[2],
  },
  flex: {
    flex: 1,
  },
});
