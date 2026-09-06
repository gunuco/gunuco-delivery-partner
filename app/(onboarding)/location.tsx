import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  GButton,
  GCard,
  GHeader,
  GIcon,
  GStepIndicator,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import { ONBOARDING_UI_STEPS } from '@/src/features/onboarding/steps';

export default function LocationPermissionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [granted, setGranted] = useState(false);

  const requestPermission = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showToast({
          type: 'warning',
          message: 'Location is required for live deliveries',
        });
        setGranted(false);
        return;
      }
      setGranted(true);
      showToast({ type: 'success', message: 'Location access enabled' });
    } catch {
      showToast({ type: 'error', message: 'Could not request location permission' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.flex}>
      <GHeader title="Location access" showBack onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + theme.spacing[8] },
        ]}
      >
        <GStepIndicator steps={[...ONBOARDING_UI_STEPS]} currentIndex={2} />

        <GCard padding="lg">
          <View style={styles.iconWrap}>
            <GIcon name="location" size={36} color={theme.colors.primary} />
          </View>
          <GText variant="h3" style={styles.title}>
            Why we need your location
          </GText>
          <GText variant="body" color={theme.colors.textSecondary}>
            GUNUCO uses your live location to assign nearby cake orders, guide you to
            hubs and customers, and keep delivery ETAs accurate.
          </GText>
          <View style={styles.bullets}>
            <GText variant="body">• Foreground location while you are online</GText>
            <GText variant="body">• Never shared for marketing</GText>
            <GText variant="body">• You can go offline anytime</GText>
          </View>
        </GCard>

        <GButton
          title={granted ? 'Location enabled' : 'Allow location access'}
          size="lg"
          fullWidth
          loading={loading}
          variant={granted ? 'success' : 'primary'}
          onPress={() => {
            void requestPermission();
          }}
        />
        <GButton
          title="Continue"
          size="lg"
          fullWidth
          variant={granted ? 'primary' : 'outline'}
          onPress={() => router.push('/(onboarding)/vehicle')}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: theme.colors.background },
  content: {
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[4],
    gap: theme.spacing[4],
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[3],
  },
  title: { marginBottom: theme.spacing[2] },
  bullets: { marginTop: theme.spacing[4], gap: theme.spacing[2] },
});
