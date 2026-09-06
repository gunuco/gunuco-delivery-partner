import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  GChip,
  GEmptyState,
  GErrorState,
  GHeader,
  GOrderCard,
  GSkeleton,
  theme,
} from '@/src/design-system';
import {
  getDeliveryDeepLink,
  orderDetailsHref,
} from '@/src/features/orders/deliveryRouting';
import {
  filterOrdersBySegment,
  formatDistanceKm,
  formatOrderEarnings,
  type OrdersSegment,
} from '@/src/features/orders/orderFormat';
import { useOrders } from '@/src/hooks';
import type { Order } from '@/src/types';

const SEGMENTS: { key: OrdersSegment; label: string }[] = [
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'failed', label: 'Failed' },
];

export default function OrdersTabScreen() {
  const insets = useSafeAreaInsets();
  const [segment, setSegment] = useState<OrdersSegment>('active');
  const { orders, isLoading, listError, refetchList, isFetching } = useOrders({
    includeHistory: true,
  });

  const filtered = useMemo(
    () => filterOrdersBySegment(orders, segment),
    [orders, segment],
  );

  const openOrder = useCallback(
    (order: Order) => {
      if (segment === 'active') {
        router.push(getDeliveryDeepLink(order));
        return;
      }
      router.push(orderDetailsHref(order.id));
    },
    [segment],
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <GHeader title="Orders" subtitle="Your delivery history" />
      <View style={styles.segments}>
        {SEGMENTS.map((item) => (
          <GChip
            key={item.key}
            label={item.label}
            selected={segment === item.key}
            onPress={() => setSegment(item.key)}
          />
        ))}
      </View>

      {isLoading ? (
        <View style={styles.skeleton}>
          <GSkeleton height={96} borderRadius={theme.radius.lg} />
          <GSkeleton height={96} borderRadius={theme.radius.lg} />
          <GSkeleton height={96} borderRadius={theme.radius.lg} />
        </View>
      ) : listError ? (
        <GErrorState
          title="Couldn't load orders"
          description="Pull to retry or tap below."
          onRetry={() => {
            void refetchList();
          }}
        />
      ) : (
        <FlashList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshing={isFetching}
          onRefresh={() => {
            void refetchList();
          }}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <GOrderCard
                orderNumber={item.orderNumber}
                status={item.status}
                customerArea={item.customerArea}
                earnings={formatOrderEarnings(item)}
                distance={formatDistanceKm(item.distanceKm)}
                onPress={() => openOrder(item)}
              />
            </View>
          )}
          ListEmptyComponent={
            <GEmptyState
              title={
                segment === 'active'
                  ? 'No active orders'
                  : segment === 'completed'
                    ? 'No completed orders'
                    : 'No failed orders'
              }
              description="Orders in this segment will appear here."
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  segments: {
    flexDirection: 'row',
    gap: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
  },
  list: {
    paddingHorizontal: theme.spacing[4],
    paddingBottom: theme.spacing[10],
  },
  item: {
    marginBottom: theme.spacing[3],
  },
  skeleton: {
    padding: theme.spacing[4],
    gap: theme.spacing[3],
  },
});
