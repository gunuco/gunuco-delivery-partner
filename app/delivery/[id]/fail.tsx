import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { FAIL_REASON_OPTIONS } from '@/src/constants/failReasons';
import {
  GButton,
  GCard,
  GConfirmationDialog,
  GErrorState,
  GHeader,
  GInput,
  GLoader,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import { deliveryHubHref } from '@/src/features/orders/deliveryRouting';
import { useOrder, useOrderActions } from '@/src/hooks';
import type { FailReason } from '@/src/types';

export default function DeliveryFailScreen() {
  const toast = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderId = typeof id === 'string' ? id : undefined;
  const { order, isLoading, error, refetch } = useOrder(orderId);
  const { fail, failState } = useOrderActions();
  const [reason, setReason] = useState<FailReason | null>(null);
  const [notes, setNotes] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const onConfirm = useCallback(async () => {
    if (!order || !reason) return;
    try {
      await fail(order.id, reason);
      setConfirmOpen(false);
      toast.showToast({ type: 'info', message: 'Delivery marked as failed' });
      router.replace('/(tabs)/orders');
    } catch {
      toast.showToast({ type: 'error', message: 'Could not fail delivery' });
    }
  }, [fail, order, reason, toast]);

  if (isLoading) {
    return (
      <View style={styles.root}>
        <GHeader title="Report issue" showBack onBack={() => router.back()} />
        <GLoader label="Loading…" />
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={styles.root}>
        <GHeader title="Report issue" showBack onBack={() => router.back()} />
        <GErrorState
          title="Order unavailable"
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
        title="Can't complete"
        subtitle={`#${order.orderNumber}`}
        showBack
        onBack={() => router.push(deliveryHubHref(order.id))}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <GText variant="body" color={theme.colors.textSecondary}>
          Select a reason. Add notes if helpful.
        </GText>
        {FAIL_REASON_OPTIONS.map((option) => {
          const selected = reason === option.value;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => setReason(option.value)}
              style={[styles.option, selected && styles.optionSelected]}
            >
              <GText variant="bodyBold">{option.label}</GText>
              <GText variant="caption" color={theme.colors.textSecondary}>
                {option.description}
              </GText>
            </Pressable>
          );
        })}

        <GInput
          label="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          placeholder="Extra context for support"
          multiline
          numberOfLines={3}
          style={styles.notes}
        />

        <GCard padding="md">
          <GText variant="caption" color={theme.colors.textMuted}>
            Failing an order notifies support. Use only when delivery cannot be completed.
          </GText>
        </GCard>

        <GButton
          title="Confirm failure"
          variant="danger"
          size="lg"
          fullWidth
          disabled={!reason}
          onPress={() => setConfirmOpen(true)}
        />
      </ScrollView>

      <GConfirmationDialog
        visible={confirmOpen}
        title="Mark delivery as failed?"
        message="This cannot be undone from the partner app."
        confirmLabel="Confirm"
        destructive
        loading={failState.isLoading}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          void onConfirm();
        }}
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
    padding: theme.spacing[4],
    gap: theme.spacing[3],
    paddingBottom: theme.spacing[10],
  },
  option: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    padding: theme.spacing[3],
    gap: 4,
  },
  optionSelected: {
    borderColor: theme.colors.danger,
    backgroundColor: '#F8E4E4',
  },
  notes: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
});
