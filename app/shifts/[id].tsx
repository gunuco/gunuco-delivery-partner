import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import {
  GBadge,
  GButton,
  GCard,
  GConfirmationDialog,
  GEmptyState,
  GErrorState,
  GHeader,
  GListRow,
  GSkeleton,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import { useShifts } from '@/src/hooks';
import { formatDate } from '@/src/utils/date';
import { getErrorMessage } from '@/src/utils/errors';
import { shiftStatusTone } from '@/src/utils/labels';
import { formatPaise } from '@/src/utils/money';

function formatShiftClock(value: string): string {
  if (/^\d{1,2}:\d{2}$/.test(value)) {
    const [hRaw, m] = value.split(':');
    const h = Number(hRaw);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${m} ${suffix}`;
  }
  try {
    return new Intl.DateTimeFormat('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function ShiftDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const shiftId = Array.isArray(id) ? id[0] : id;
  const {
    shifts,
    upcoming,
    isLoading,
    error,
    refetch,
    bookShift,
    cancelShift,
    bookState,
    cancelState,
  } = useShifts();
  const { showToast } = useToast();
  const [confirmCancel, setConfirmCancel] = useState(false);

  const shift = useMemo(
    () =>
      shifts.find((s) => s.id === shiftId) ??
      upcoming.find((s) => s.id === shiftId),
    [shifts, upcoming, shiftId],
  );

  if (isLoading && !shift) {
    return (
      <View style={styles.screen}>
        <GHeader title="Shift" showBack onBack={() => router.back()} />
        <View style={styles.pad}>
          <GSkeleton height={160} borderRadius={theme.radius.lg} />
        </View>
      </View>
    );
  }

  if (error && !shift) {
    return (
      <View style={styles.screen}>
        <GHeader title="Shift" showBack onBack={() => router.back()} />
        <GErrorState
          title="Couldn’t load shift"
          description={getErrorMessage(error)}
          onRetry={() => {
            void refetch();
          }}
        />
      </View>
    );
  }

  if (!shift) {
    return (
      <View style={styles.screen}>
        <GHeader title="Shift" showBack onBack={() => router.back()} />
        <GEmptyState
          title="Shift not found"
          description="This slot may no longer be available."
          actionLabel="Back to shifts"
          onAction={() => router.replace('/shifts')}
        />
      </View>
    );
  }

  const busy = bookState.isLoading || cancelState.isLoading;

  return (
    <View style={styles.screen}>
      <GHeader title="Shift details" showBack onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <GCard padding="lg" style={styles.hero}>
          <View style={styles.heroTop}>
            <GText variant="h2" style={styles.flex}>
              {shift.hubName}
            </GText>
            <GBadge label={shift.status} tone={shiftStatusTone(shift.status)} />
          </View>
          <GText variant="body" color={theme.colors.textSecondary}>
            {shift.area}
          </GText>
          <GText variant="title">
            {formatShiftClock(shift.startTime)} – {formatShiftClock(shift.endTime)}
          </GText>
          <GText variant="caption" color={theme.colors.textMuted}>
            {formatDate(shift.date)}
          </GText>
        </GCard>

        <GListRow
          title="Estimated earnings"
          right={
            <GText variant="bodyBold">
              {typeof shift.estimatedEarningsPaise === 'number'
                ? formatPaise(shift.estimatedEarningsPaise)
                : '—'}
            </GText>
          }
        />
        {shift.incentiveNote ? (
          <GListRow title="Incentive note" subtitle={shift.incentiveNote} />
        ) : null}
        {typeof shift.capacity === 'number' ? (
          <GListRow
            title="Capacity"
            right={
              <GText variant="bodyBold">
                {shift.bookedCount ?? 0} / {shift.capacity}
              </GText>
            }
          />
        ) : null}

        <View style={styles.actions}>
          {shift.status === 'AVAILABLE' ? (
            <GButton
              title="Book this shift"
              fullWidth
              size="lg"
              loading={busy}
              onPress={() => {
                void (async () => {
                  try {
                    await bookShift(shift.id);
                    showToast({
                      type: 'success',
                      message: 'Shift booked successfully.',
                    });
                    void refetch();
                  } catch (err) {
                    Alert.alert('Booking failed', getErrorMessage(err));
                  }
                })();
              }}
            />
          ) : null}
          {shift.status === 'BOOKED' || shift.status === 'ACTIVE' ? (
            <GButton
              title="Cancel booking"
              fullWidth
              size="lg"
              variant="danger"
              loading={busy}
              onPress={() => setConfirmCancel(true)}
            />
          ) : null}
        </View>
      </ScrollView>

      <GConfirmationDialog
        visible={confirmCancel}
        title="Cancel this shift?"
        message="Late cancellations can affect reliability. Confirm only if you cannot make it."
        confirmLabel="Cancel shift"
        cancelLabel="Keep shift"
        destructive
        loading={cancelState.isLoading}
        onConfirm={() => {
          void (async () => {
            try {
              await cancelShift(shift.id);
              showToast({ type: 'success', message: 'Shift cancelled.' });
              setConfirmCancel(false);
              void refetch();
            } catch (err) {
              Alert.alert('Cancel failed', getErrorMessage(err));
            }
          })();
        }}
        onCancel={() => setConfirmCancel(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  pad: {
    padding: theme.spacing[4],
  },
  content: {
    paddingBottom: theme.spacing[8],
  },
  hero: {
    margin: theme.spacing[4],
    gap: theme.spacing[2],
  },
  heroTop: {
    flexDirection: 'row',
    gap: theme.spacing[3],
    alignItems: 'flex-start',
  },
  flex: {
    flex: 1,
  },
  actions: {
    padding: theme.spacing[4],
    gap: theme.spacing[3],
  },
});
