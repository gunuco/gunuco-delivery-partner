import { Image } from 'expo-image';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  GEmptyState,
  GErrorState,
  GOrderCard,
  GSkeleton,
  GText,
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
import { ordersImageSources } from '../../assets/images/orders/sources';

const BG = '#FFF5F7';
const BANNER_ASPECT = 1024 / 433;

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
      <View style={styles.hero}>
        <Image
          source={ordersImageSources.banner}
          style={styles.banner}
          contentFit="contain"
          contentPosition="center"
          accessibilityLabel="Orders — Your delivery history"
          transition={120}
        />
      </View>

      <View style={styles.segments}>
        {SEGMENTS.map((item) => {
          const selected = segment === item.key;
          return (
            <Pressable
              key={item.key}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              accessibilityState={{ selected }}
              onPress={() => setSegment(item.key)}
              style={({ pressed }) => [
                styles.segment,
                selected ? styles.segmentSelected : styles.segmentIdle,
                pressed && !selected ? styles.segmentPressed : null,
              ]}
            >
              <GText
                variant="caption"
                color={selected ? theme.colors.textInverse : theme.colors.text}
                style={styles.segmentLabel}
              >
                {item.label}
              </GText>
            </Pressable>
          );
        })}
      </View>

      {isLoading ? (
        <View style={styles.skeleton}>
          <GSkeleton height={108} borderRadius={theme.radius.xl} />
          <GSkeleton height={108} borderRadius={theme.radius.xl} />
          <GSkeleton height={108} borderRadius={theme.radius.xl} />
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
          style={styles.listFlex}
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
    backgroundColor: BG,
  },
  hero: {
    width: '100%',
    aspectRatio: BANNER_ASPECT,
    backgroundColor: BG,
  },
  banner: {
    width: '100%',
    height: '100%',
  },
  segments: {
    flexDirection: 'row',
    gap: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[1],
    paddingBottom: theme.spacing[3],
  },
  segment: {
    flex: 1,
    minHeight: 40,
    paddingHorizontal: theme.spacing[3],
    borderRadius: theme.radius.full,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  segmentIdle: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.borderStrong,
  },
  segmentPressed: {
    opacity: 0.85,
  },
  segmentLabel: {
    fontWeight: '600',
  },
  listFlex: {
    flex: 1,
  },
  list: {
    paddingHorizontal: theme.spacing[4],
    paddingBottom: theme.spacing[10],
  },
  item: {
    marginBottom: theme.spacing[3],
  },
  skeleton: {
    paddingHorizontal: theme.spacing[4],
    gap: theme.spacing[3],
  },
});
