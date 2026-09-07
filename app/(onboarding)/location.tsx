import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GButton, GIcon, GStepIndicator, GText, theme, useToast } from '@/src/design-system';
import { OnboardingHeader } from '@/src/features/onboarding/OnboardingHeader';
import { StepBanner } from '@/src/features/onboarding/StepBanner';
import { ONBOARDING_UI_STEPS } from '@/src/features/onboarding/steps';

export default function LocationPermissionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [granted, setGranted] = useState(false);

  const footerPad = useMemo(() => Math.max(insets.bottom, theme.spacing[3]) + 160, [insets.bottom]);

  const requestPermission = async () => {
    setLoading(true);
    try {
      const result = await Location.requestForegroundPermissionsAsync();
      const status = result?.status;
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
      setGranted(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.flex}>
      <OnboardingHeader title="Location access" />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: footerPad }]}
        showsVerticalScrollIndicator={false}
      >
        <GStepIndicator steps={[...ONBOARDING_UI_STEPS]} currentIndex={2} />

        <StepBanner name="location" />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, theme.spacing[3]) }]}>
        <GButton
          title={granted ? 'Location enabled' : 'Allow location access'}
          size="lg"
          fullWidth
          loading={loading}
          variant={granted ? 'success' : 'primary'}
          onPress={() => {
            void requestPermission();
          }}
          leftIcon={<GIcon name="location" size={20} color={theme.colors.textInverse} />}
          rightIcon={
            granted ? undefined : (
              <GIcon name="arrowForward" size={20} color={theme.colors.textInverse} />
            )
          }
        />
        <GButton
          title="Continue"
          size="lg"
          fullWidth
          variant="outline"
          onPress={() => router.push('/(onboarding)/vehicle')}
        />

        <View style={styles.privacyRow}>
          <GIcon name="lock" size={20} color={theme.colors.textMuted} />
          <View>
            <GText variant="caption" color={theme.colors.textMuted} style={styles.privacyText}>
              Your location is secure with GUNUCO.
            </GText>
            <GText variant="caption" color={theme.colors.textMuted} style={styles.privacyText}>
              We never share it for marketing purposes.
            </GText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: theme.colors.background },
  content: {
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[4],
    gap: theme.spacing[3],
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 100,
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[3],
    gap: theme.spacing[2],
    backgroundColor: theme.colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
  },
  privacyRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    paddingTop: theme.spacing[5],
    paddingLeft: theme.spacing[11],
    paddingRight: theme.spacing[10],
  },
  privacyText: {
    fontWeight: '500',
    flex: 1,
  },
});
