import { Redirect, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  GButton,
  GCard,
  GHeader,
  GIcon,
  GLoader,
  GStatusBadge,
  GStepIndicator,
  GText,
  theme,
} from '@/src/design-system';
import { STATUS_SCREEN_STATUSES } from '@/src/features/auth/routing';
import {
  nextIncompleteRoute,
  ONBOARDING_UI_STEPS,
  stepIndexFromProgress,
} from '@/src/features/onboarding/steps';
import { useOnboarding, usePartner } from '@/src/hooks';

const HUB_STEPS: { title: string; subtitle: string; route: string; stepKey: string }[] = [
  {
    title: 'Personal details',
    subtitle: 'Name, date of birth, and address',
    route: '/(onboarding)/personal',
    stepKey: 'PERSONAL_DETAILS',
  },
  {
    title: 'Profile photo',
    subtitle: 'Clear face photo for verification',
    route: '/(onboarding)/photo',
    stepKey: 'PERSONAL_DETAILS',
  },
  {
    title: 'Location access',
    subtitle: 'Needed for live delivery tracking',
    route: '/(onboarding)/location',
    stepKey: 'PERSONAL_DETAILS',
  },
  {
    title: 'Vehicle details',
    subtitle: 'Bike / scooter used for deliveries',
    route: '/(onboarding)/vehicle',
    stepKey: 'VEHICLE',
  },
  {
    title: 'Documents',
    subtitle: 'DL, RC, insurance, and ID proof',
    route: '/(onboarding)/documents',
    stepKey: 'DOCUMENTS',
  },
  {
    title: 'Bank details',
    subtitle: 'Account for payouts',
    route: '/(onboarding)/bank',
    stepKey: 'BANK',
  },
  {
    title: 'Training',
    subtitle: 'Cake handling, app usage, safety',
    route: '/(onboarding)/training',
    stepKey: 'TRAINING',
  },
  {
    title: 'Submit for review',
    subtitle: 'Send your application to GUNUCO',
    route: '/(onboarding)/review',
    stepKey: 'SUBMITTED',
  },
];

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

  return (
    <View style={styles.flex}>
      <GHeader title="Partner setup" subtitle="Complete these steps to go live" />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + theme.spacing[8] },
        ]}
      >
        <GStepIndicator steps={[...ONBOARDING_UI_STEPS]} currentIndex={currentIndex} />

        <GText variant="body" color={theme.colors.textSecondary} style={styles.intro}>
          Welcome{partner?.name && partner.name !== 'New Partner' ? `, ${partner.name}` : ''}.
          Finish onboarding to deliver with GUNUCO in Hyderabad.
        </GText>

        <View style={styles.list}>
          {HUB_STEPS.map((item) => {
            const done =
              item.stepKey === 'SUBMITTED'
                ? completed.has('SUBMITTED')
                : item.stepKey === 'PERSONAL_DETAILS'
                  ? completed.has('PERSONAL_DETAILS')
                  : completed.has(item.stepKey);
            // Photo / location soft-complete when personal done (UI-only)
            const softDone =
              (item.route.includes('photo') || item.route.includes('location')) &&
              completed.has('PERSONAL_DETAILS');

            return (
              <Pressable
                key={item.route}
                accessibilityRole="button"
                onPress={() => router.push(item.route as never)}
                style={({ pressed }) => [pressed && styles.pressed]}
              >
                <GCard padding="md" elevated={false} style={styles.card}>
                  <View style={styles.row}>
                    <View
                      style={[
                        styles.iconWrap,
                        (done || softDone) && styles.iconWrapDone,
                      ]}
                    >
                      <GIcon
                        name={done || softDone ? 'check' : 'forward'}
                        size={18}
                        color={
                          done || softDone
                            ? theme.colors.textInverse
                            : theme.colors.primary
                        }
                      />
                    </View>
                    <View style={styles.copy}>
                      <GText variant="bodyBold">{item.title}</GText>
                      <GText variant="caption" color={theme.colors.textSecondary}>
                        {item.subtitle}
                      </GText>
                    </View>
                    <GStatusBadge
                      status={done || softDone ? 'verified' : 'pending_verification'}
                      kind="partner"
                      label={done || softDone ? 'Done' : 'To do'}
                    />
                  </View>
                </GCard>
              </Pressable>
            );
          })}
        </View>

        <GButton
          title="Continue setup"
          size="lg"
          fullWidth
          onPress={() => router.push(continueRoute as never)}
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
    gap: theme.spacing[4],
  },
  intro: { marginTop: theme.spacing[1] },
  list: { gap: theme.spacing[3] },
  card: { backgroundColor: theme.colors.surface },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapDone: {
    backgroundColor: theme.colors.success,
  },
  copy: { flex: 1, gap: 2 },
  pressed: { opacity: 0.92 },
});
