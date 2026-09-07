import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  GBadge,
  GButton,
  GCard,
  GConfirmationDialog,
  GEmptyState,
  GErrorState,
  GHeader,
  GLoader,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import { deliveryHubHref } from '@/src/features/orders/deliveryRouting';
import {
  collectHandlingInstructions,
  formatAddress,
  formatDistanceKm,
  formatEtaMinutes,
  formatOrderEarnings,
  getItemsCount,
  hasCakeOrFragileItems,
} from '@/src/features/orders/orderFormat';
import { useOrder, useOrderActions, useOrders } from '@/src/hooks';

function useCountdown(expiresAt?: string) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!expiresAt) {
      return;
    }
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const remainingMs = expiresAt
    ? Math.max(0, new Date(expiresAt).getTime() - now)
    : 0;
  const totalSeconds = Math.floor(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return {
    remainingMs,
    label: `${minutes}:${seconds.toString().padStart(2, '0')}`,
    expired: Boolean(expiresAt) && remainingMs <= 0,
  };
}

export default function OrderAssignmentScreen() {
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const params = useLocalSearchParams<{ id?: string }>();
  const { activeOrder, isLoading: activeLoading, refetchActive } = useOrders();
  const paramId = typeof params.id === 'string' ? params.id : undefined;
  const { order: detailOrder, isLoading: detailLoading, error, refetch } = useOrder(paramId);
  const order =
    detailOrder ??
    (activeOrder?.status === 'ASSIGNED' ? activeOrder : undefined);
  const { accept, reject, isActing, rejectState } = useOrderActions();
  const [declineOpen, setDeclineOpen] = useState(false);
  const countdown = useCountdown(order?.expiresAt);

  const handling = useMemo(
    () => (order ? collectHandlingInstructions(order.items) : []),
    [order],
  );

  const onAccept = useCallback(async () => {
    if (!order) return;
    try {
      await accept(order.id);
      toast.showToast({ type: 'success', message: 'Order accepted' });
      router.replace(deliveryHubHref(order.id));
    } catch {
      toast.showToast({ type: 'error', message: 'Could not accept order' });
    }
  }, [accept, order, toast]);

  const onDecline = useCallback(async () => {
    if (!order) return;
    try {
      await reject(order.id, 'Partner declined');
      setDeclineOpen(false);
      toast.showToast({ type: 'info', message: 'Order declined' });
      router.back();
    } catch {
      toast.showToast({ type: 'error', message: 'Could not decline order' });
    }
  }, [order, reject, toast]);

  const loading = activeLoading || detailLoading;

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <GHeader title="New assignment" showBack onBack={() => router.back()} />
      {loading ? (
        <GLoader label="Loading assignment…" />
      ) : error && !order ? (
        <GErrorState
          title="Assignment unavailable"
          onRetry={() => {
            void refetch();
            void refetchActive();
          }}
        />
      ) : !order || order.status !== 'ASSIGNED' ? (
        <GEmptyState
          title="No pending assignment"
          description="New orders will appear here when assigned."
          actionLabel="Go back"
          onAction={() => router.back()}
        />
      ) : (
        <View style={styles.body}>
          <GCard padding="lg" style={styles.hero}>
            <View style={styles.topRow}>
              <GText variant="h2">#{order.orderNumber}</GText>
              {order.expiresAt ? (
                <GBadge
                  label={countdown.expired ? 'Expired' : countdown.label}
                  tone={countdown.expired ? 'danger' : 'warning'}
                />
              ) : null}
            </View>
            <GText variant="body" color={theme.colors.textSecondary}>
              Pickup · {order.pickup?.name ?? 'Pickup'}
            </GText>
            <GText variant="caption" color={theme.colors.textMuted}>
              {formatAddress(order.pickup?.address)}
            </GText>
            <GText variant="bodyBold" style={styles.gap}>
              Customer area · {order.customerArea}
            </GText>
            <View style={styles.metaRow}>
              <Meta label="Distance" value={formatDistanceKm(order.distanceKm)} />
              <Meta label="ETA" value={formatEtaMinutes(order.estimatedDurationMinutes)} />
              <Meta label="Earn" value={formatOrderEarnings(order)} />
              <Meta label="Items" value={`${getItemsCount(order)}`} />
            </View>
          </GCard>

          {hasCakeOrFragileItems(order.items) || handling.length > 0 ? (
            <GCard padding="md" style={styles.block}>
              <GText variant="title">Cake & handling</GText>
              {handling.length === 0 ? (
                <GText variant="body" color={theme.colors.textSecondary}>
                  Fragile / cake items — handle carefully.
                </GText>
              ) : (
                handling.map((item) => (
                  <GText key={item} variant="bodyBold" color={theme.colors.accent}>
                    · {item}
                  </GText>
                ))
              )}
            </GCard>
          ) : null}

          {order.specialInstructions ? (
            <GCard padding="md" style={styles.block}>
              <GText variant="title">Special instructions</GText>
              <GText variant="body" color={theme.colors.textSecondary}>
                {order.specialInstructions}
              </GText>
            </GCard>
          ) : null}

          <View style={styles.actions}>
            <GButton
              title="Decline"
              variant="outline"
              size="lg"
              fullWidth
              disabled={isActing || countdown.expired}
              onPress={() => setDeclineOpen(true)}
            />
            <GButton
              title="Accept"
              size="lg"
              fullWidth
              loading={isActing && !rejectState.isLoading}
              disabled={isActing || countdown.expired}
              onPress={() => {
                void onAccept();
              }}
            />
          </View>
        </View>
      )}

      <GConfirmationDialog
        visible={declineOpen}
        title="Decline this order?"
        message="This assignment will be released. You may receive fewer offers if you decline often."
        confirmLabel="Decline"
        destructive
        loading={rejectState.isLoading}
        onCancel={() => setDeclineOpen(false)}
        onConfirm={() => {
          void onDecline();
        }}
      />
    </View>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaItem}>
      <GText variant="caption" color={theme.colors.textMuted}>
        {label}
      </GText>
      <GText variant="bodyBold">{value}</GText>
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
  hero: {
    gap: theme.spacing[2],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing[2],
  },
  gap: {
    marginTop: theme.spacing[2],
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[4],
    marginTop: theme.spacing[3],
  },
  metaItem: {
    minWidth: 72,
    gap: 2,
  },
  block: {
    gap: theme.spacing[2],
  },
  actions: {
    marginTop: 'auto',
    gap: theme.spacing[3],
  },
});
