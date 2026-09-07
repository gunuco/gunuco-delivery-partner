import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import { GIcon, GText, theme } from '@/src/design-system';
import { ORDER_STATUS_META } from '@/src/constants/orderStatus';
import {
  formatDistanceKm,
  formatOrderEarnings,
} from '@/src/features/orders/orderFormat';
import type { Order, OrderStatus } from '@/src/types';

export type RecentOrdersSectionProps = {
  orders: Order[];
  onViewAll: () => void;
  onOpenOrder: (order: Order) => void;
};

function statusBadgeStyle(status: OrderStatus): { bg: string; text: string } {
  if (status === 'DELIVERED') {
    return { bg: theme.colors.successSoft, text: theme.colors.success };
  }
  if (status === 'FAILED' || status === 'CANCELLED') {
    return { bg: theme.colors.dangerSoft, text: theme.colors.danger };
  }
  if (status === 'ASSIGNED') {
    return { bg: theme.colors.infoSoft, text: theme.colors.info };
  }
  return { bg: theme.colors.accentSoft, text: theme.colors.primary };
}

function formatOrderTime(order: Order): string {
  const raw =
    order.deliveredAt ?? order.failedAt ?? order.updatedAt ?? order.createdAt;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return '—';

  const now = new Date();
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  const time = date.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  if (sameDay) return `Today, ${time}`;
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  }) + `, ${time}`;
}

function itemsSummary(order: Order): string {
  const items = order.items ?? [];
  const first = items[0];
  if (!first) return 'No items';
  const extraCount = Math.max(0, items.length - 1);
  const base = `${first.quantity} x ${first.name}`;
  if (extraCount === 0) return base;
  return `${base} + ${extraCount} more`;
}

function OrderRow({
  order,
  onPress,
}: {
  order: Order;
  onPress: () => void;
}) {
  const items = order.items ?? [];
  const imageUrl = items.find((item) => item.imageUrl)?.imageUrl;
  const badge = statusBadgeStyle(order.status);
  const statusTitle =
    ORDER_STATUS_META[order.status]?.title?.toUpperCase() ??
    order.status.replace(/_/g, ' ');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Order ${order.orderNumber}`}
      onPress={onPress}
      style={styles.row}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.thumb}
          contentFit="cover"
          accessibilityLabel={items[0]?.name ?? 'Order item'}
        />
      ) : (
        <View style={[styles.thumb, styles.thumbFallback]}>
          <GIcon name="cake" size={22} color={theme.colors.primary} />
        </View>
      )}

      <View style={styles.center}>
        <GText variant="bodyBold">#{order.orderNumber}</GText>
        <GText variant="caption" color={theme.colors.textSecondary} numberOfLines={1}>
          {order.customerArea}
        </GText>
        <GText variant="caption" color={theme.colors.textMuted} numberOfLines={1}>
          {itemsSummary(order)}
        </GText>
        <View style={styles.distanceRow}>
          <GIcon name="location" size={12} color={theme.colors.textMuted} />
          <GText variant="caption" color={theme.colors.textMuted}>
            {formatDistanceKm(order.distanceKm)}
          </GText>
        </View>
      </View>

      <View style={styles.right}>
        <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
          <GText variant="label" color={badge.text}>
            {statusTitle}
          </GText>
        </View>
        <GText variant="bodyBold" color={theme.colors.success}>
          {formatOrderEarnings(order)}
        </GText>
        <View style={styles.metaRow}>
          <GIcon name="clock" size={12} color={theme.colors.textMuted} />
          <GText variant="caption" color={theme.colors.textMuted}>
            {formatOrderTime(order)}
          </GText>
          <GIcon name="chevronRight" size={14} color={theme.colors.textMuted} />
        </View>
      </View>
    </Pressable>
  );
}

export function RecentOrdersSection({
  orders,
  onViewAll,
  onOpenOrder,
}: RecentOrdersSectionProps) {
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <GIcon name="list" size={16} color={theme.colors.primary} />
          </View>
          <GText variant="bodyBold">Recent orders</GText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View all orders"
          onPress={onViewAll}
          hitSlop={8}
        >
          <GText variant="caption" color={theme.colors.primary}>
            View all {'>'}
          </GText>
        </Pressable>
      </View>

      <View style={styles.list}>
        {orders.map((order) => (
          <OrderRow
            key={order.id}
            order={order}
            onPress={() => onOpenOrder(order)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: theme.spacing[3],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  headerIcon: {
    width: 28,
    height: 28,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    gap: theme.spacing[3],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing[3],
    ...theme.shadows.sm,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.accentSoft,
  },
  thumbFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: 2,
    borderRadius: theme.radius.full,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
