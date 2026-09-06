import { router } from 'expo-router';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import {
  GEmptyState,
  GErrorState,
  GHeader,
  GListRow,
  GSkeleton,
  theme,
} from '@/src/design-system';
import { useVehicle } from '@/src/hooks';
import { getErrorMessage } from '@/src/utils/errors';
import { formatEnumLabel, VEHICLE_TYPE_LABELS } from '@/src/utils/labels';

export default function VehicleScreen() {
  const { vehicle, isLoading, error, refetch, isFetching } = useVehicle();

  if (isLoading && !vehicle) {
    return (
      <View style={styles.screen}>
        <GHeader title="Vehicle" showBack onBack={() => router.back()} />
        <View style={styles.pad}>
          <GSkeleton height={56} borderRadius={theme.radius.md} />
          <GSkeleton height={56} borderRadius={theme.radius.md} />
        </View>
      </View>
    );
  }

  if (error && !vehicle) {
    return (
      <View style={styles.screen}>
        <GHeader title="Vehicle" showBack onBack={() => router.back()} />
        <GErrorState
          title="Couldn’t load vehicle"
          description={getErrorMessage(error)}
          onRetry={() => {
            void refetch();
          }}
        />
      </View>
    );
  }

  if (!vehicle) {
    return (
      <View style={styles.screen}>
        <GHeader title="Vehicle" showBack onBack={() => router.back()} />
        <GEmptyState
          title="No vehicle on file"
          description="Add your scooter or bike details to stay eligible for cake deliveries."
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <GHeader
        title="Vehicle"
        subtitle="Registered for deliveries"
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
        <GListRow
          title="Type"
          subtitle={VEHICLE_TYPE_LABELS[vehicle.type] ?? vehicle.type}
        />
        <GListRow title="Make" subtitle={vehicle.make} />
        <GListRow title="Model" subtitle={vehicle.model} />
        <GListRow title="Number" subtitle={vehicle.number} />
        <GListRow title="Color" subtitle={vehicle.color ?? '—'} />
        <GListRow
          title="Ownership"
          subtitle={formatEnumLabel(vehicle.ownership)}
        />
        <GListRow
          title="Year"
          subtitle={vehicle.year ? String(vehicle.year) : '—'}
        />
      </ScrollView>
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
    paddingBottom: theme.spacing[8],
  },
});
