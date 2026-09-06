import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import {
  GBadge,
  GButton,
  GCard,
  GChip,
  GConfirmationDialog,
  GEmptyState,
  GErrorState,
  GHeader,
  GSectionHeader,
  GSkeleton,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import { useShifts } from '@/src/hooks';
import type { Shift } from '@/src/types';
import { formatDate } from '@/src/utils/date';
import { getErrorMessage } from '@/src/utils/errors';
import { shiftStatusTone } from '@/src/utils/labels';
import { formatPaise } from '@/src/utils/money';

function formatShiftClock(value: string): string {
  // Seeded shifts use "HH:mm"; ISO strings also work via Date.
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

type Segment = 'available' | 'booked' | 'history';

function isHistoryStatus(status: Shift['status']): boolean {
  return (
    status === 'COMPLETED' ||
    status === 'MISSED' ||
    status === 'CANCELLED'
  );
}

function isBookedStatus(status: Shift['status']): boolean {
  return status === 'BOOKED' || status === 'ACTIVE';
}

function ShiftCard({
  shift,
  onBook,
  onCancel,
  busy,
}: {
  shift: Shift;
  onBook: (id: string) => void;
  onCancel: (id: string) => void;
  busy: boolean;
}) {
  return (
    <GCard
      padding="md"
      style={styles.card}
      onPress={() => router.push(`/shifts/${shift.id}`)}
    >
      <View style={styles.cardTop}>
        <View style={styles.flex}>
          <GText variant="bodyBold">{shift.hubName}</GText>
          <GText variant="caption" color={theme.colors.textSecondary}>
            {shift.area} · {formatDate(shift.date)}
          </GText>
        </View>
        <GBadge label={shift.status} tone={shiftStatusTone(shift.status)} />
      </View>
      <GText variant="body">
        {formatShiftClock(shift.startTime)} – {formatShiftClock(shift.endTime)}
      </GText>
      {typeof shift.estimatedEarningsPaise === 'number' ? (
        <GText variant="caption" color={theme.colors.textSecondary}>
          Est. {formatPaise(shift.estimatedEarningsPaise)}
          {shift.incentiveNote ? ` · ${shift.incentiveNote}` : ''}
        </GText>
      ) : null}
      {shift.status === 'AVAILABLE' ? (
        <GButton
          title="Book shift"
          size="sm"
          fullWidth
          loading={busy}
          onPress={() => onBook(shift.id)}
          style={styles.action}
        />
      ) : null}
      {isBookedStatus(shift.status) ? (
        <GButton
          title="Cancel booking"
          size="sm"
          variant="outline"
          fullWidth
          loading={busy}
          onPress={() => onCancel(shift.id)}
          style={styles.action}
        />
      ) : null}
    </GCard>
  );
}

export default function ShiftsIndexScreen() {
  const { shifts, upcoming, isLoading, error, refetch, isFetching, bookShift, cancelShift, bookState, cancelState } =
    useShifts();
  const { showToast } = useToast();
  const [segment, setSegment] = useState<Segment>('available');
  const [cancelId, setCancelId] = useState<string | null>(null);

  const list = useMemo(() => {
    if (segment === 'available') {
      return shifts.filter((s) => s.status === 'AVAILABLE');
    }
    if (segment === 'booked') {
      const booked = shifts.filter((s) => isBookedStatus(s.status));
      return booked.length > 0 ? booked : upcoming.filter((s) => isBookedStatus(s.status));
    }
    return shifts.filter((s) => isHistoryStatus(s.status));
  }, [segment, shifts, upcoming]);

  const busy = bookState.isLoading || cancelState.isLoading;

  const handleBook = async (shiftId: string) => {
    try {
      await bookShift(shiftId);
      showToast({ type: 'success', message: 'Shift booked. See you at the hub.' });
      void refetch();
    } catch (err) {
      Alert.alert('Booking failed', getErrorMessage(err));
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelId) return;
    try {
      await cancelShift(cancelId);
      showToast({ type: 'success', message: 'Shift cancelled.' });
      setCancelId(null);
      void refetch();
    } catch (err) {
      Alert.alert('Cancel failed', getErrorMessage(err));
    }
  };

  if (isLoading && shifts.length === 0) {
    return (
      <View style={styles.screen}>
        <GHeader title="Shifts" showBack onBack={() => router.back()} />
        <View style={styles.pad}>
          <GSkeleton height={120} borderRadius={theme.radius.lg} />
          <GSkeleton height={120} borderRadius={theme.radius.lg} />
        </View>
      </View>
    );
  }

  if (error && shifts.length === 0) {
    return (
      <View style={styles.screen}>
        <GHeader title="Shifts" showBack onBack={() => router.back()} />
        <GErrorState
          title="Couldn’t load shifts"
          description={getErrorMessage(error)}
          onRetry={() => {
            void refetch();
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <GHeader
        title="Shifts"
        subtitle="Book slots near your hub"
        showBack
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={() => {
              void refetch();
            }}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={styles.chips}>
          <GChip
            label="Available"
            selected={segment === 'available'}
            onPress={() => setSegment('available')}
          />
          <GChip
            label="Booked"
            selected={segment === 'booked'}
            onPress={() => setSegment('booked')}
          />
          <GChip
            label="History"
            selected={segment === 'history'}
            onPress={() => setSegment('history')}
          />
        </View>

        <GSectionHeader
          title={
            segment === 'available'
              ? 'Open slots'
              : segment === 'booked'
                ? 'Your bookings'
                : 'Past shifts'
          }
        />

        {list.length === 0 ? (
          <GEmptyState
            title={
              segment === 'available'
                ? 'No open shifts'
                : segment === 'booked'
                  ? 'No booked shifts'
                  : 'No shift history'
            }
            description="New GUNUCO hub slots appear as demand planning updates."
          />
        ) : (
          list.map((shift) => (
            <ShiftCard
              key={shift.id}
              shift={shift}
              busy={busy}
              onBook={(id) => {
                void handleBook(id);
              }}
              onCancel={setCancelId}
            />
          ))
        )}
      </ScrollView>

      <GConfirmationDialog
        visible={cancelId !== null}
        title="Cancel this shift?"
        message="Cancelling late may affect your reliability score. You can book another open slot later."
        confirmLabel="Cancel shift"
        cancelLabel="Keep shift"
        destructive
        loading={cancelState.isLoading}
        onConfirm={() => {
          void handleConfirmCancel();
        }}
        onCancel={() => setCancelId(null)}
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
    gap: theme.spacing[3],
  },
  content: {
    padding: theme.spacing[4],
    gap: theme.spacing[3],
    paddingBottom: theme.spacing[8],
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
  },
  card: {
    gap: theme.spacing[2],
  },
  cardTop: {
    flexDirection: 'row',
    gap: theme.spacing[3],
    alignItems: 'flex-start',
  },
  flex: {
    flex: 1,
  },
  action: {
    marginTop: theme.spacing[2],
  },
});
