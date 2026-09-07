import { Redirect, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { IconName } from '@/src/design-system';
import {
  GBadge,
  GButton,
  GCard,
  GIcon,
  GLoader,
  GStepIndicator,
  GText,
  theme,
} from '@/src/design-system';
import { STATUS_SCREEN_STATUSES } from '@/src/features/auth/routing';
import { OnboardingHeader } from '@/src/features/onboarding/OnboardingHeader';
import { StepBanner } from '@/src/features/onboarding/StepBanner';
import {
  nextIncompleteRoute,
  ONBOARDING_UI_STEPS,
  stepIndexFromProgress,
} from '@/src/features/onboarding/steps';
import { useOnboarding, usePartner } from '@/src/hooks';

const HUB_STEPS: {
  title: string;
  subtitle: string;
  route: string;
  stepKey: string;
  icon: IconName;
}[] = [
  {
    title: 'Personal details',
    subtitle: 'Name, date of birth, and address',
    route: '/(onboarding)/personal',
    stepKey: 'PERSONAL_DETAILS',
    icon: 'profile',
  },
  {
    title: 'Profile photo',
    subtitle: 'Clear face photo for verification',
    route: '/(onboarding)/photo',
    stepKey: 'PHOTO',
    icon: 'camera',
  },
  {
    title: 'Location access',
    subtitle: 'Needed for live delivery tracking',
    route: '/(onboarding)/location',
    stepKey: 'LOCATION',
    icon: 'location',
  },
  {
    title: 'Vehicle details',
    subtitle: 'Bike / scooter used for deliveries',
    route: '/(onboarding)/vehicle',
    stepKey: 'VEHICLE',
    icon: 'vehicle',
  },
  {
    title: 'Documents',
    subtitle: 'DL, RC, insurance, and ID proof',
    route: '/(onboarding)/documents',
    stepKey: 'DOCUMENTS',
    icon: 'document',
  },
  {
    title: 'Bank details',
    subtitle: 'Account for payouts',
    route: '/(onboarding)/bank',
    stepKey: 'BANK',
    icon: 'bank',
  },
  {
    title: 'Training',
    subtitle: 'Cake handling, app usage, safety',
    route: '/(onboarding)/training',
    stepKey: 'TRAINING',
    icon: 'training',
  },
  {
    title: 'Submit for review',
    subtitle: 'Send your application to GUNUCO',
    route: '/(onboarding)/review',
    stepKey: 'SUBMITTED',
    icon: 'send',
  },
];

function isStepDone(stepKey: string, completed: Set<string>): boolean {
  if (stepKey === 'PHOTO' || stepKey === 'LOCATION') {
    return completed.has('PERSONAL_DETAILS');
  }
  return completed.has(stepKey);
}

export default function OnboardingHubScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { partner, isLoading: partnerLoading } = usePartner();
  const { progress, isLoading } = useOnboarding();

  if (partnerLoading || isLoading) {
    return (
      <View style={styles.center}>
        <GLoader label="Loading onboarding…" />
      </View>
    );
  }

  if (partner?.status && STATUS_SCREEN_STATUSES.has(partner.status)) {
    return <Redirect href="/(onboarding)/status" />;
  }

  const completed = new Set(progress?.completedSteps ?? []);
  const currentIndex = stepIndexFromProgress(progress);
  const continueRoute = nextIncompleteRoute(progress);
  const doneCount = HUB_STEPS.filter((item) => isStepDone(item.stepKey, completed)).length;

  return (
    <View style={styles.flex}>
      <OnboardingHeader
        title="Partner setup"
        subtitle="Complete these steps to go live"
        showBack={router.canGoBack()}
      />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 96 }]}
        showsVerticalScrollIndicator={false}
      >
        <StepBanner name="hub" />

        <GCard padding="md" elevated={false} style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <GText variant="bodyBold">Your progress</GText>
            <GText variant="caption" color={theme.colors.textSecondary}>
              {doneCount} of {HUB_STEPS.length} completed
            </GText>
          </View>
          <GStepIndicator steps={[...ONBOARDING_UI_STEPS]} currentIndex={currentIndex} />
        </GCard>

        <View style={styles.checklistHeader}>
          <GText variant="bodyBold">Setup checklist</GText>
          <View style={styles.liveBadge}>
            <GText variant="label" color={theme.colors.primary}>
              Complete all steps to go live
            </GText>
          </View>
        </View>

        <View style={styles.list}>
          {HUB_STEPS.map((item) => {
            const done = isStepDone(item.stepKey, completed);

            return (
              <Pressable
                key={item.route}
                accessibilityRole="button"
                accessibilityLabel={item.title}
                onPress={() => router.push(item.route as never)}
                style={({ pressed }) => [pressed && styles.pressed]}
              >
                <GCard padding="md" elevated style={styles.card}>
                  <View style={styles.row}>
                    <View style={[styles.iconWrap, done && styles.iconWrapDone]}>
                      <GIcon
                        name={done ? 'check' : item.icon}
                        size={20}
                        color={done ? theme.colors.textInverse : theme.colors.primary}
                      />
                    </View>

                    <View style={styles.copy}>
                      <GText variant="bodyBold">{item.title}</GText>
                      <GText variant="caption" color={theme.colors.textSecondary}>
                        {item.subtitle}
                      </GText>
                    </View>

                    <GBadge label={done ? 'Done' : 'To do'} tone={done ? 'success' : 'warning'} />
                    <GIcon name="chevronRight" size={18} color={theme.colors.primary} />
                  </View>
                </GCard>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, theme.spacing[3]) }]}>
        <GButton
          title="Continue setup"
          size="lg"
          fullWidth
          onPress={() => router.push(continueRoute as never)}
          rightIcon={<GIcon name="arrowForward" size={18} color={theme.colors.textInverse} />}
        />
      </View>
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
    // paddingHorizontal: theme.spacing[4],
    // paddingTop: theme.spacing[4],
    gap: theme.spacing[4],
  },
  progressCard: {
    marginTop: -theme.spacing[10],
    marginLeft: theme.spacing[2],
    marginRight: theme.spacing[2],
    backgroundColor: theme.colors.surfaceMuted,
    gap: theme.spacing[3],
    position: 'absolute',
    width: '100%',
    top: 250,
    right: theme.spacing[1],
    left: -theme.spacing[2],
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checklistHeader: {
    // marginTop: theme.spacing[8],
    marginTop: theme.spacing[8],
    marginLeft: theme.spacing[3],
    marginRight: theme.spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing[2],
  },
  liveBadge: {
    backgroundColor: theme.colors.accentSoft,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  list: { gap: theme.spacing[3], paddingLeft: theme.spacing[3], paddingRight: theme.spacing[3] },
  card: {
    backgroundColor: theme.colors.surface,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapDone: {
    backgroundColor: theme.colors.success,
  },
  copy: { flex: 1, gap: 2, minWidth: 0 },
  pressed: { opacity: 0.92 },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[3],
    backgroundColor: theme.colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
  },
});
