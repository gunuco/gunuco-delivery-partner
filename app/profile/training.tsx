import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { GIcon, GText, theme } from '@/src/design-system';
import {
  ProfileHeroCard,
  ProfileScreenShell,
} from '@/src/features/profile/ProfileScreenShell';
import { useGetOnboardingProgressQuery } from '@/src/api/endpoints/partnerApi';
import { useAppSelector } from '@/src/store/hooks';

const MODULES = [
  {
    title: 'Keep cakes upright',
    body: 'Always keep boxes level. Never tilt, stack bags on top, or lay a multi-tier cake on its side.',
    icon: 'cake' as const,
  },
  {
    title: 'Smooth riding',
    body: 'Brake early, avoid sudden turns, and use the cake base provided at the hub staging counter.',
    icon: 'vehicle' as const,
  },
  {
    title: 'Customer handoff',
    body: 'Confirm the order number, complete OTP/QR/photo verification, and wait until the customer accepts the cake.',
    icon: 'checkCircle' as const,
  },
  {
    title: 'Partner safety',
    body: 'If you feel unsafe, move to a public place and use Emergency. Your safety comes before the order.',
    icon: 'shield' as const,
  },
] as const;

export default function TrainingScreen() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const onboardingQuery = useGetOnboardingProgressQuery(undefined, {
    skip: !isAuthenticated,
  });
  const trainingDone =
    onboardingQuery.data?.completedSteps.includes('TRAINING') ?? false;

  return (
    <ProfileScreenShell
      title="Training"
      subtitle="GUNUCO cake delivery essentials"
      onBack={() => router.back()}
    >
      <ProfileHeroCard
        tone="primary"
        icon="training"
        eyebrow={trainingDone ? 'Completed' : 'In progress'}
        title={trainingDone ? 'Training completed' : 'Complete your training'}
        body="These modules keep celebration cakes safe from hub to doorstep."
      />

      <GText variant="bodyBold" style={styles.section}>
        Modules
      </GText>

      {MODULES.map((module, index) => (
        <View key={module.title} style={styles.card}>
          <View style={styles.iconCircle}>
            <GIcon name={module.icon} size={18} color={theme.colors.primary} />
          </View>
          <View style={styles.copy}>
            <GText variant="label" color={theme.colors.textMuted}>
              Module {index + 1}
            </GText>
            <GText variant="bodyBold">{module.title}</GText>
            <GText variant="body" color={theme.colors.textSecondary}>
              {module.body}
            </GText>
          </View>
        </View>
      ))}
    </ProfileScreenShell>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: theme.spacing[1],
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing[3],
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing[3],
    ...theme.shadows.sm,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: theme.spacing[1],
    minWidth: 0,
  },
});
