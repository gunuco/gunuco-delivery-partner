import { useRouter } from 'expo-router';
import { useMemo, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { IconName } from '@/src/design-system';
import {
  GButton,
  GCard,
  GIcon,
  GLoader,
  GStepIndicator,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import { OnboardingHeader } from '@/src/features/onboarding/OnboardingHeader';
import { StepBanner } from '@/src/features/onboarding/StepBanner';
import { ONBOARDING_UI_STEPS } from '@/src/features/onboarding/steps';
import { useDocuments, useOnboarding, usePartner, useVehicle } from '@/src/hooks';
import { maskPhone } from '@/src/utils/phone';

type SummaryCardProps = {
  label: string;
  title: string;
  subtitle: string;
  icon: IconName;
  onEdit: () => void;
  footer?: ReactNode;
};

function SummaryCard({ label, title, subtitle, icon, onEdit, footer }: SummaryCardProps) {
  return (
    <GCard padding="md" elevated style={styles.summaryCard}>
      <View style={styles.summaryRow}>
        <View style={styles.summaryIcon}>
          <GIcon name={icon} size={20} color={theme.colors.primary} />
        </View>
        <View style={styles.summaryCopy}>
          <GText variant="label" color={theme.colors.textSecondary}>
            {label}
          </GText>
          <GText variant="bodyBold" numberOfLines={1}>
            {title}
          </GText>
          <GText variant="caption" color={theme.colors.textSecondary} numberOfLines={2}>
            {subtitle}
          </GText>
          {footer}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Edit ${label.toLowerCase()}`}
          onPress={onEdit}
          style={({ pressed }) => [styles.editChip, pressed && styles.editPressed]}
        >
          <GIcon name="edit" size={14} color={theme.colors.primary} />
          <GText variant="label" color={theme.colors.primary}>
            Edit
          </GText>
        </Pressable>
      </View>
    </GCard>
  );
}

function formatDisplayPhone(phone?: string | null): string {
  if (!phone) return '—';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `+91 ${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2)}`;
  }
  try {
    return maskPhone(phone);
  } catch {
    return phone;
  }
}

export default function ReviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { partner, isLoading: partnerLoading } = usePartner();
  const { vehicle, isLoading: vehicleLoading } = useVehicle();
  const { documents, isLoading: docsLoading } = useDocuments();
  const { progress, submitForReview, submitState } = useOnboarding();

  const loading = partnerLoading || vehicleLoading || docsLoading;
  const safeDocs = documents ?? [];
  const uploadedCount = safeDocs.filter(
    (d) => d?.status === 'PENDING' || d?.status === 'APPROVED',
  ).length;

  const STEP_LABELS: Record<string, string> = {
    PERSONAL_DETAILS: 'Personal details',
    VEHICLE: 'Vehicle',
    DOCUMENTS: 'Documents',
    BANK: 'Bank',
    TRAINING: 'Training',
    SUBMITTED: 'Submit',
  };

  const missing = (progress?.requiredSteps ?? [])
    .filter((s) => s !== 'SUBMITTED')
    .filter((s) => !(progress?.completedSteps ?? []).includes(s));

  const missingLabel = missing
    .map((s) => STEP_LABELS[s] ?? s.replace(/_/g, ' ').toLowerCase())
    .join(', ');

  const allComplete = missing.length === 0;
  const submitting = Boolean(submitState?.isLoading);
  const footerPad = useMemo(() => Math.max(insets.bottom, theme.spacing[3]) + 200, [insets.bottom]);

  const vehicleTitle = vehicle
    ? `${vehicle.make ?? ''} ${vehicle.model ?? ''}`.trim() || 'Vehicle set'
    : 'Not set';
  const vehicleSubtitle = vehicle?.number ?? '—';
  const profileName = partner?.name?.trim() || 'Partner';

  const onSubmit = async () => {
    if (!allComplete) {
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
      <OnboardingHeader title="Review & submit" />

      <ScrollView contentContainerStyle={[styles.content]} showsVerticalScrollIndicator={false}>
        <GStepIndicator steps={[...ONBOARDING_UI_STEPS]} currentIndex={7} />

        <GText variant="body" color={theme.colors.textSecondary}>
          Confirm your details look correct, then submit for GUNUCO verification.
        </GText>

        <SummaryCard
          label="PROFILE"
          title={profileName}
          subtitle={formatDisplayPhone(partner?.phone)}
          icon="profile"
          onEdit={() => router.push('/(onboarding)/personal')}
        />

        <SummaryCard
          label="VEHICLE"
          title={vehicleTitle}
          subtitle={vehicleSubtitle}
          icon="scooter"
          onEdit={() => router.push('/(onboarding)/vehicle')}
        />

        <SummaryCard
          label="DOCUMENTS"
          title={`${uploadedCount} uploaded`}
          subtitle={
            allComplete
              ? 'Ready for verification'
              : missingLabel
                ? `Missing: ${missingLabel}`
                : 'Finish remaining steps'
          }
          icon="document"
          onEdit={() => router.push('/(onboarding)/documents')}
          footer={
            allComplete ? (
              <View style={styles.completeRow}>
                <GIcon name="checkCircle" size={16} color={theme.colors.success} />
                <GText variant="caption" color={theme.colors.success}>
                  All required steps complete
                </GText>
              </View>
            ) : (
              <GText variant="caption" color={theme.colors.warning}>
                Finish remaining steps before submit
              </GText>
            )
          }
        />

        <GButton
          title="Submit for review"
          size="lg"
          fullWidth
          loading={submitting}
          disabled={!allComplete}
          onPress={() => {
            void onSubmit();
          }}
          rightIcon={<GIcon name="arrowForward" size={18} color={theme.colors.textInverse} />}
        />
      </ScrollView>
      <StepBanner name="review" />
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
    paddingBottom: theme.spacing[8],
    paddingTop: theme.spacing[4],
    gap: theme.spacing[3],
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing[3],
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  editChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.accentSoft,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: 6,
    borderRadius: theme.radius.full,
  },
  editPressed: {
    opacity: 0.85,
  },
  completeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[1],
    marginTop: theme.spacing[1],
  },
});
