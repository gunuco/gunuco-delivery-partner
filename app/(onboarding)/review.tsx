import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  GButton,
  GCard,
  GHeader,
  GLoader,
  GStepIndicator,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import { ONBOARDING_UI_STEPS } from '@/src/features/onboarding/steps';
import { useDocuments, useOnboarding, usePartner, useVehicle } from '@/src/hooks';

export default function ReviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { partner, isLoading: partnerLoading } = usePartner();
  const { vehicle, isLoading: vehicleLoading } = useVehicle();
  const { documents, isLoading: docsLoading } = useDocuments();
  const { progress, submitForReview, submitState } = useOnboarding();

  const loading = partnerLoading || vehicleLoading || docsLoading;
  const uploadedCount = documents.filter(
    (d) => d.status === 'PENDING' || d.status === 'APPROVED',
  ).length;

  const missing = (progress?.requiredSteps ?? [])
    .filter((s) => s !== 'SUBMITTED')
    .filter((s) => !(progress?.completedSteps ?? []).includes(s));

  const onSubmit = async () => {
    if (missing.length > 0) {
      showToast({
        type: 'warning',
        message: 'Complete all required steps before submitting',
      });
      return;
    }
    try {
      await submitForReview();
      showToast({ type: 'success', message: 'Application submitted for review' });
      router.replace('/(onboarding)/status');
    } catch {
      showToast({
        type: 'error',
        message: 'Could not submit. Finish remaining steps and try again.',
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <GLoader label="Preparing review…" />
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <GHeader title="Review & submit" showBack onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + theme.spacing[8] },
        ]}
      >
        <GStepIndicator steps={[...ONBOARDING_UI_STEPS]} currentIndex={7} />

        <GText variant="body" color={theme.colors.textSecondary}>
          Confirm your details look correct, then submit for GUNUCO verification.
        </GText>

        <GCard padding="md">
          <GText variant="label" color={theme.colors.textSecondary}>
            PROFILE
          </GText>
          <GText variant="bodyBold">{partner?.name ?? '—'}</GText>
          <GText variant="caption" color={theme.colors.textSecondary}>
            {partner?.phone}
          </GText>
        </GCard>

        <GCard padding="md">
          <GText variant="label" color={theme.colors.textSecondary}>
            VEHICLE
          </GText>
          <GText variant="bodyBold">
            {vehicle ? `${vehicle.make} ${vehicle.model}` : 'Not set'}
          </GText>
          <GText variant="caption" color={theme.colors.textSecondary}>
            {vehicle?.number ?? '—'}
          </GText>
        </GCard>

        <GCard padding="md">
          <GText variant="label" color={theme.colors.textSecondary}>
            DOCUMENTS
          </GText>
          <GText variant="bodyBold">{uploadedCount} uploaded</GText>
          {missing.length > 0 ? (
            <GText variant="caption" color={theme.colors.warning}>
              Missing steps: {missing.join(', ')}
            </GText>
          ) : (
            <GText variant="caption" color={theme.colors.success}>
              All required steps complete
            </GText>
          )}
        </GCard>

        <GButton
          title="Submit for review"
          size="lg"
          fullWidth
          loading={submitState.isLoading}
          disabled={missing.length > 0}
          onPress={() => {
            void onSubmit();
          }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: theme.colors.background },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[4],
    gap: theme.spacing[3],
  },
});
