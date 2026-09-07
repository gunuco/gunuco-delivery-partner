import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import {
  GButton,
  GCard,
  GErrorState,
  GHeader,
  GLoader,
  GStatusBadge,
  GStepIndicator,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import { ORDER_STATUS_META } from '@/src/constants/orderStatus';
import {
  deliveryCompleteHref,
  deliveryFailHref,
  deliveryNavigateHref,
  deliveryPickupHref,
  deliveryVerifyHref,
  getPrimaryActionLabel,
} from '@/src/features/orders/deliveryRouting';
import {
  formatAddress,
  formatDistanceKm,
  formatEtaMinutes,
  formatOrderEarnings,
} from '@/src/features/orders/orderFormat';
import { useOrder, useOrderActions } from '@/src/hooks';
import { callPhone } from '@/src/services/linking';
import { openExternalNavigation } from '@/src/services/navigation';
import {
  getAvailableOrderActions,
  getNextPrimaryAction,
  getOrderProgressSteps,
} from '@/src/utils/orderWorkflow';

export default function DeliveryHubScreen() {
  const toast = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderId = typeof id === 'string' ? id : undefined;
  const { order, isLoading, error, refetch } = useOrder(orderId);
  const actions = useOrderActions();
  const [busy, setBusy] = useState(false);

  const steps = useMemo(
    () => (order ? getOrderProgressSteps(order.status) : []),
    [order],
  );
  const stepLabels = steps.map((s) => s.label);
  const currentIndex = Math.max(
    0,
    steps.findIndex((s) => s.current),
  );
  const primary = order ? getNextPrimaryAction(order) : null;
  const available = order ? getAvailableOrderActions(order) : [];
  const meta = order ? ORDER_STATUS_META[order.status] : null;

  useEffect(() => {
    if (order?.status === 'DELIVERED') {
      router.replace(deliveryCompleteHref(order.id));
    }
  }, [order?.id, order?.status]);

  const runPrimary = useCallback(async () => {
    if (!order || !primary) return;
    setBusy(true);
    try {
      switch (primary) {
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
          router.replace(deliveryCompleteHref(order.id));
          break;
        case 'ACCEPT':
          await actions.accept(order.id);
          break;
        default:
          break;
      }
    } catch {
      toast.showToast({ type: 'error', message: 'Could not update delivery status' });
    } finally {
      setBusy(false);
    }
  }, [actions, order, primary, toast]);

  const onNavigate = useCallback(async () => {
    if (!order) return;
    const toCustomer =
      order.status === 'PICKED_UP' ||
      order.status === 'GOING_TO_CUSTOMER' ||
      order.status === 'ARRIVED_AT_CUSTOMER' ||
      order.status === 'DELIVERY_VERIFICATION';
    const coords = toCustomer
      ? order.delivery?.address?.coordinates
      : order.pickup?.address?.coordinates;
    if (!coords) {
      toast.showToast({ type: 'warning', message: 'No map coordinates' });
      return;
    }
    await openExternalNavigation({
      lat: coords.latitude,
      lng: coords.longitude,
      label: toCustomer ? order.customerName : order.pickup?.name,
    });
  }, [order, toast]);

  if (isLoading) {
    return (
      <View style={styles.root}>
        <GHeader title="Delivery" showBack onBack={() => router.back()} />
        <GLoader label="Loading delivery…" />
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={styles.root}>
        <GHeader title="Delivery" showBack onBack={() => router.back()} />
        <GErrorState
          title="Delivery not found"
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
        subtitle="Active delivery"
        showBack
        onBack={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <GStatusBadge status={order.status} />
        <GText variant="h3">{meta?.title}</GText>
        <GText variant="body" color={theme.colors.textSecondary}>
          {meta?.description}
        </GText>

        <GStepIndicator steps={stepLabels} currentIndex={currentIndex} />

        <GCard padding="md" style={styles.card}>
          <GText variant="label" color={theme.colors.textSecondary}>
            {order.status === 'PICKED_UP' ||
            order.status === 'GOING_TO_CUSTOMER' ||
            order.status === 'ARRIVED_AT_CUSTOMER' ||
            order.status === 'DELIVERY_VERIFICATION'
              ? 'Deliver to'
              : 'Pickup from'}
          </GText>
          <GText variant="bodyBold">
            {order.status === 'PICKED_UP' ||
            order.status === 'GOING_TO_CUSTOMER' ||
            order.status === 'ARRIVED_AT_CUSTOMER' ||
            order.status === 'DELIVERY_VERIFICATION'
              ? order.customerName
              : order.pickup?.name ?? 'Pickup'}
          </GText>
          <GText variant="body" color={theme.colors.textSecondary}>
            {order.status === 'PICKED_UP' ||
            order.status === 'GOING_TO_CUSTOMER' ||
            order.status === 'ARRIVED_AT_CUSTOMER' ||
            order.status === 'DELIVERY_VERIFICATION'
              ? formatAddress(order.delivery?.address)
              : formatAddress(order.pickup?.address)}
          </GText>
          <GText variant="caption" color={theme.colors.textMuted}>
            {formatDistanceKm(order.distanceKm)} ·{' '}
            {formatEtaMinutes(order.estimatedDurationMinutes)} ·{' '}
            {formatOrderEarnings(order)}
          </GText>
        </GCard>

        <View style={styles.row}>
          {available.includes('NAVIGATE') ? (
            <GButton
              title="Navigate"
              variant="secondary"
              size="lg"
              style={styles.flex}
              onPress={() => {
                void onNavigate();
              }}
            />
          ) : null}
          {available.includes('CALL_CUSTOMER') ? (
            <GButton
              title="Call"
              variant="outline"
              size="lg"
              style={styles.flex}
              onPress={() => {
                void (async () => {
                  try {
                    if (order.customerPhoneMasked) {
                      await callPhone(order.customerPhoneMasked);
                    }
                  } catch (err) {
                    toast.showToast({
                      type: 'error',
                      message:
                        err instanceof Error ? err.message : 'Call failed',
                    });
                  }
                })();
              }}
            />
          ) : null}
        </View>

        {primary ? (
          <GButton
            title={getPrimaryActionLabel(primary)}
            size="lg"
            fullWidth
            loading={busy || actions.isActing}
            onPress={() => {
              void runPrimary();
            }}
          />
        ) : null}

        {available.includes('FAIL') ? (
          <GButton
            title="Can't complete"
            variant="danger"
            size="lg"
            fullWidth
            onPress={() => router.push(deliveryFailHref(order.id))}
          />
        ) : null}
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
    gap: theme.spacing[3],
    paddingBottom: theme.spacing[10],
  },
  card: {
    gap: theme.spacing[2],
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing[2],
  },
  flex: {
    flex: 1,
  },
});
