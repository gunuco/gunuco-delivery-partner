import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  GCard,
  GHeader,
  GSectionHeader,
  GText,
  theme,
} from '@/src/design-system';
import { useGetOnboardingProgressQuery } from '@/src/api/endpoints/partnerApi';
import { useAppSelector } from '@/src/store/hooks';

const MODULES = [
  {
    title: 'Keep cakes upright',
    body: 'Always keep boxes level. Never tilt, stack bags on top, or lay a multi-tier cake on its side.',
  },
  {
    title: 'Smooth riding',
    body: 'Brake early, avoid sudden turns, and use the cake base provided at the hub staging counter.',
  },
  {
    title: 'Customer handoff',
    body: 'Confirm the order number, complete OTP/QR/photo verification, and wait until the customer accepts the cake.',
  },
  {
    title: 'Partner safety',
    body: 'If you feel unsafe, move to a public place and use Emergency. Your safety comes before the order.',
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
    <View style={styles.screen}>
      <GHeader
        title="Training"
        subtitle="GUNUCO cake delivery essentials"
        showBack
        onBack={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <GCard padding="lg" style={styles.hero}>
          <GText variant="h3">
            {trainingDone ? 'Training completed' : 'Complete your training'}
          </GText>
          <GText variant="body" color={theme.colors.textSecondary}>
            These modules keep celebration cakes safe from hub to doorstep.
          </GText>
        </GCard>

        <GSectionHeader title="Modules" />
        {MODULES.map((module, index) => (
          <GCard key={module.title} padding="md" style={styles.card}>
            <GText variant="label" color={theme.colors.textMuted}>
              Module {index + 1}
            </GText>
            <GText variant="bodyBold">{module.title}</GText>
            <GText variant="body" color={theme.colors.textSecondary}>
              {module.body}
            </GText>
          </GCard>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing[4],
    gap: theme.spacing[3],
    paddingBottom: theme.spacing[8],
  },
  hero: {
    gap: theme.spacing[2],
  },
  card: {
    gap: theme.spacing[1],
  },
});
