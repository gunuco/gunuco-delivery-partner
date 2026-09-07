import { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import {
  GButton,
  GErrorState,
  GHeader,
  GLoader,
  GMapCard,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import {
  deliveryHubHref,
  deliveryPickupHref,
  deliveryVerifyHref,
  isCustomerPhase,
  isPickupPhase,
} from '@/src/features/orders/deliveryRouting';
import {
  formatAddress,
  formatDistanceKm,
  formatEtaMinutes,
} from '@/src/features/orders/orderFormat';
import { useOrder, useOrderActions } from '@/src/hooks';
import { openExternalNavigation } from '@/src/services/navigation';

export default function NavigateScreen() {
  const toast = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderId = typeof id === 'string' ? id : undefined;
  const { order, isLoading, error, refetch } = useOrder(orderId);
  const {
    goToPickup,
    markArrivedAtPickup,
    startDelivery,
    markArrivedAtCustomer,
    isActing,
  } = useOrderActions();

  const toCustomer = order ? isCustomerPhase(order.status) : false;
  const toPickup = order ? isPickupPhase(order.status) : true;

  const destination = useMemo(() => {
    if (!order) return null;
    if (toCustomer) {
      return {
        label: order.customerName,
        address: formatAddress(order.delivery?.address),
        coordinates: order.delivery?.address?.coordinates,
      };
    }
    return {
      label: order.pickup?.name ?? 'Pickup',
      address: formatAddress(order.pickup?.address),
      coordinates: order.pickup?.address?.coordinates,
    };
  }, [order, toCustomer]);

  const onOpenMaps = useCallback(async () => {
    if (!destination?.coordinates) {
      toast.showToast({ type: 'warning', message: 'No coordinates available' });
      return;
    }
    await openExternalNavigation({
      lat: destination.coordinates.latitude,
      lng: destination.coordinates.longitude,
      label: destination.label,
    });
  }, [destination, toast]);

  const onPrimary = useCallback(async () => {
    if (!order) return;
    try {
      if (order.status === 'ACCEPTED') {
        await goToPickup(order.id);
        await onOpenMaps();
        return;
      }
      if (order.status === 'GOING_TO_PICKUP') {
        await markArrivedAtPickup(order.id);
        router.replace(deliveryPickupHref(order.id));
        return;
      }
      if (order.status === 'PICKED_UP') {
        await startDelivery(order.id);
        await onOpenMaps();
        return;
      }
      if (order.status === 'GOING_TO_CUSTOMER') {
        await markArrivedAtCustomer(order.id);
        router.replace(deliveryVerifyHref(order.id));
        return;
      }
      await onOpenMaps();
    } catch {
      toast.showToast({ type: 'error', message: 'Could not update trip status' });
    }
  }, [
    goToPickup,
    markArrivedAtCustomer,
    markArrivedAtPickup,
    onOpenMaps,
    order,
    startDelivery,
    toast,
  ]);

  const primaryLabel = useMemo(() => {
    if (!order) return 'Navigate';
    switch (order.status) {
      case 'ACCEPTED':
        return 'Start trip to pickup';
      case 'GOING_TO_PICKUP':
        return "I've arrived at pickup";
      case 'PICKED_UP':
        return 'Start trip to customer';
      case 'GOING_TO_CUSTOMER':
        return "I've arrived at customer";
      default:
        return 'Open navigation';
    }
  }, [order]);

  if (isLoading) {
    return (
      <View style={styles.root}>
        <GHeader title="Navigate" showBack onBack={() => router.back()} />
        <GLoader label="Loading route…" />
      </View>
    );
  }

  if (error || !order || !destination) {
    return (
      <View style={styles.root}>
        <GHeader title="Navigate" showBack onBack={() => router.back()} />
        <GErrorState
          title="Route unavailable"
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
        title={toCustomer ? 'To customer' : 'To pickup'}
        subtitle={`#${order.orderNumber}`}
        showBack
        onBack={() => router.push(deliveryHubHref(order.id))}
      />
      <View style={styles.body}>
        <GMapCard
          destinationLabel={destination.label}
          distance={formatDistanceKm(order.distanceKm)}
          eta={formatEtaMinutes(order.estimatedDurationMinutes)}
          onNavigate={() => {
            void onOpenMaps();
          }}
        />
        <GText variant="body" color={theme.colors.textSecondary}>
          {destination.address}
        </GText>
        <GText variant="caption" color={theme.colors.textMuted}>
          {toPickup && !toCustomer
            ? 'Head to the GUNUCO pickup hub, then confirm items.'
            : 'Deliver carefully — keep cakes upright.'}
        </GText>
        <View style={styles.spacer} />
        <GButton
          title={primaryLabel}
          size="lg"
          fullWidth
          loading={isActing}
          onPress={() => {
            void onPrimary();
          }}
        />
        <GButton
          title="Open maps"
          variant="secondary"
          size="lg"
          fullWidth
          onPress={() => {
            void onOpenMaps();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  body: {
    flex: 1,
    padding: theme.spacing[4],
    gap: theme.spacing[3],
  },
  spacer: {
    flex: 1,
  },
});
