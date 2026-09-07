import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { PACKAGING_CHECKLIST } from '@/src/constants/packagingChecklist';
import {
  GBadge,
  GButton,
  GCard,
  GCheckbox,
  GErrorState,
  GHeader,
  GLoader,
  GMapCard,
  GSectionHeader,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import {
  deliveryHubHref,
  deliveryNavigateHref,
} from '@/src/features/orders/deliveryRouting';
import {
  collectHandlingInstructions,
  formatAddress,
  formatDistanceKm,
  formatEtaMinutes,
} from '@/src/features/orders/orderFormat';
import { useOrder, useOrderActions } from '@/src/hooks';
import { openExternalNavigation } from '@/src/services/navigation';

export default function PickupScreen() {
  const toast = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderId = typeof id === 'string' ? id : undefined;
  const { order, isLoading, error, refetch } = useOrder(orderId);
  const { markArrivedAtPickup, confirmPickup, isActing, arrivedPickupState } =
    useOrderActions();

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [checkedPackaging, setCheckedPackaging] = useState<Record<string, boolean>>(
    {},
  );

  const handling = useMemo(
    () => (order ? collectHandlingInstructions(order.items) : []),
    [order],
  );

  const allItemsChecked = useMemo(() => {
    if (!order) return false;
    return (order.items ?? []).every((item) => checkedItems[item.id]);
  }, [checkedItems, order]);

  const allPackagingChecked = useMemo(
    () => PACKAGING_CHECKLIST.every((item) => checkedPackaging[item.id]),
    [checkedPackaging],
  );

  const canConfirm = allItemsChecked && allPackagingChecked;

  const onNavigate = useCallback(async () => {
    if (!order?.pickup?.address?.coordinates) {
      toast.showToast({ type: 'warning', message: 'No pickup coordinates' });
      return;
    }
    const { latitude, longitude } = order.pickup.address.coordinates;
    await openExternalNavigation({
      lat: latitude,
      lng: longitude,
      label: order.pickup.name,
    });
  }, [order, toast]);

  const onMarkArrived = useCallback(async () => {
    if (!order) return;
    try {
      await markArrivedAtPickup(order.id);
      toast.showToast({ type: 'success', message: 'Marked arrived at pickup' });
    } catch {
      toast.showToast({ type: 'error', message: 'Could not mark arrival' });
    }
  }, [markArrivedAtPickup, order, toast]);

  const onConfirm = useCallback(async () => {
    if (!order || !canConfirm) return;
    try {
      if (order.status === 'GOING_TO_PICKUP') {
        await markArrivedAtPickup(order.id);
      }
      await confirmPickup(order.id);
      toast.showToast({ type: 'success', message: 'Pickup confirmed' });
      router.replace(deliveryNavigateHref(order.id));
    } catch {
      toast.showToast({ type: 'error', message: 'Could not confirm pickup' });
    }
  }, [canConfirm, confirmPickup, markArrivedAtPickup, order, toast]);

  if (isLoading) {
    return (
      <View style={styles.root}>
        <GHeader title="Pickup" showBack onBack={() => router.back()} />
        <GLoader label="Loading pickup…" />
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={styles.root}>
        <GHeader title="Pickup" showBack onBack={() => router.back()} />
        <GErrorState
          title="Pickup unavailable"
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
        title="Pickup"
        subtitle={`#${order.orderNumber}`}
        showBack
        onBack={() => router.push(deliveryHubHref(order.id))}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <GMapCard
          destinationLabel={order.pickup?.name ?? 'Pickup'}
          distance={formatDistanceKm(order.distanceKm)}
          eta={formatEtaMinutes(order.estimatedDurationMinutes)}
          onNavigate={() => {
            void onNavigate();
          }}
        />

        <GCard padding="md" style={styles.card}>
          <GText variant="bodyBold">{order.pickup?.name ?? 'Pickup'}</GText>
          <GText variant="body" color={theme.colors.textSecondary}>
            {formatAddress(order.pickup?.address)}
          </GText>
          {order.pickup?.instructions ? (
            <GText variant="caption" color={theme.colors.textMuted}>
              {order.pickup.instructions}
            </GText>
          ) : null}
        </GCard>

        {handling.length > 0 ? (
          <GCard padding="md" style={styles.card}>
            <GSectionHeader title="Cake handling" subtitle="From order items" />
            <View style={styles.chips}>
              {handling.map((instruction) => (
                <GBadge key={instruction} label={instruction} tone="accent" />
              ))}
            </View>
            {(order.items ?? [])
              .filter((item) => (item.handlingInstructions ?? []).length > 0)
              .map((item) => (
                <View key={item.id} style={styles.handlingItem}>
                  <GText variant="bodyBold">{item.name}</GText>
                  {(item.handlingInstructions ?? []).map((instruction) => (
                    <GText
                      key={`${item.id}-${instruction}`}
                      variant="caption"
                      color={theme.colors.accent}
                    >
                      · {instruction}
                    </GText>
                  ))}
                </View>
              ))}
          </GCard>
        ) : null}

        <GCard padding="md" style={styles.card}>
          <GSectionHeader title="Item checklist" />
          {(order.items ?? []).map((item) => (
            <GCheckbox
              key={item.id}
              label={`${item.quantity}× ${item.name}`}
              checked={Boolean(checkedItems[item.id])}
              onChange={(checked) =>
                setCheckedItems((prev) => ({ ...prev, [item.id]: checked }))
              }
            />
          ))}
        </GCard>

        <GCard padding="md" style={styles.card}>
          <GSectionHeader title="Packaging checklist" />
          {PACKAGING_CHECKLIST.map((item) => (
            <GCheckbox
              key={item.id}
              label={item.label}
              checked={Boolean(checkedPackaging[item.id])}
              onChange={(checked) =>
                setCheckedPackaging((prev) => ({ ...prev, [item.id]: checked }))
              }
            />
          ))}
        </GCard>

        {order.status === 'GOING_TO_PICKUP' ? (
          <GButton
            title="I've arrived at pickup"
            size="lg"
            fullWidth
            variant="secondary"
            loading={arrivedPickupState.isLoading}
            onPress={() => {
              void onMarkArrived();
            }}
          />
        ) : null}

        <GButton
          title="Confirm pickup"
          size="lg"
          fullWidth
          disabled={!canConfirm}
          loading={isActing}
          onPress={() => {
            void onConfirm();
          }}
        />
        {!canConfirm ? (
          <GText variant="caption" color={theme.colors.textMuted} center>
            Check all items and packaging before confirming.
          </GText>
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
  },
  handlingItem: {
    gap: 2,
    marginTop: theme.spacing[2],
  },
});
