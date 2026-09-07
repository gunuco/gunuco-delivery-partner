import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import {
  GErrorState,
  GSkeleton,
  theme,
} from '@/src/design-system';
import {
  ProfileDetailRow,
  ProfileHeroCard,
  ProfileScreenShell,
  PROFILE_BG,
} from '@/src/features/profile/ProfileScreenShell';
import { useVehicle } from '@/src/hooks';
import { getErrorMessage } from '@/src/utils/errors';
import { formatEnumLabel, VEHICLE_TYPE_LABELS } from '@/src/utils/labels';

export default function VehicleScreen() {
  const { vehicle, isLoading, error, refetch, isFetching } = useVehicle();

  if (isLoading && !vehicle) {
    return (
      <ProfileScreenShell
        title="Vehicle"
        subtitle="Registered for deliveries"
        onBack={() => router.back()}
      >
        <GSkeleton height={96} borderRadius={theme.radius.xl} />
        <GSkeleton height={72} borderRadius={theme.radius.xl} />
      </ProfileScreenShell>
    );
  }

  if (error && !vehicle) {
    return (
      <View style={styles.fallback}>
        <ProfileScreenShell title="Vehicle" onBack={() => router.back()}>
          <GErrorState
            title="Couldn’t load vehicle"
            description={getErrorMessage(error)}
            onRetry={() => {
              void refetch();
            }}
          />
        </ProfileScreenShell>
      </View>
    );
  }

  if (!vehicle) {
    return (
      <ProfileScreenShell
        title="Vehicle"
        subtitle="Registered for deliveries"
        onBack={() => router.back()}
      >
        <ProfileHeroCard
          icon="vehicle"
          eyebrow="Fleet"
          title="No vehicle on file"
          body="Add your scooter or bike details to stay eligible for cake deliveries."
        />
      </ProfileScreenShell>
    );
  }

  return (
    <ProfileScreenShell
      title="Vehicle"
      subtitle="Registered for deliveries"
      onBack={() => router.back()}
      refreshing={isFetching && !isLoading}
      onRefresh={() => {
        void refetch();
      }}
    >
      <ProfileHeroCard
        icon="vehicle"
        eyebrow="On-road"
        title={`${vehicle.make} ${vehicle.model}`}
        body={vehicle.number}
      />

      <ProfileDetailRow
        icon="vehicle"
        label="Type"
        value={VEHICLE_TYPE_LABELS[vehicle.type] ?? vehicle.type}
      />
      <ProfileDetailRow icon="store" label="Make" value={vehicle.make} />
      <ProfileDetailRow icon="list" label="Model" value={vehicle.model} />
      <ProfileDetailRow icon="scan" label="Number" value={vehicle.number} />
      <ProfileDetailRow
        icon="colorPalette"
        label="Color"
        value={vehicle.color ?? '—'}
      />
      <ProfileDetailRow
        icon="key"
        label="Ownership"
        value={formatEnumLabel(vehicle.ownership)}
      />
      <ProfileDetailRow
        icon="calendar"
        label="Year"
        value={vehicle.year ? String(vehicle.year) : '—'}
      />
    </ProfileScreenShell>
  );
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    backgroundColor: PROFILE_BG,
  },
});
