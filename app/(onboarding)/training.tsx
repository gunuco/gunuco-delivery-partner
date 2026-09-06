import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  GButton,
  GCard,
  GCheckbox,
  GHeader,
  GStepIndicator,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import { ONBOARDING_UI_STEPS } from '@/src/features/onboarding/steps';
import { useOnboarding } from '@/src/hooks';

const MODULES = [
  {
    id: 'cake',
    title: 'Cake handling',
    body: 'Keep boxes upright, avoid sudden braking, and verify temperature tags before leaving the hub.',
  },
  {
    id: 'app',
    title: 'App usage',
    body: 'Accept orders quickly, follow status steps, and use in-app navigation for pickup and drop.',
  },
  {
    id: 'safety',
    title: 'Safety',
    body: 'Wear a helmet, park safely near customer gates, and never share customer details.',
  },
] as const;

export default function TrainingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { completeStep, updateStepState } = useOnboarding();
  const [checked, setChecked] = useState<Record<string, boolean>>({
    cake: false,
    app: false,
    safety: false,
  });

  const allDone = useMemo(
    () => MODULES.every((m) => checked[m.id]),
    [checked],
  );

  const onContinue = async () => {
    if (!allDone) {
      showToast({ type: 'warning', message: 'Complete all training modules' });
      return;
    }
    try {
      await completeStep('TRAINING');
      router.push('/(onboarding)/review');
    } catch {
      showToast({ type: 'error', message: 'Could not save training progress' });
    }
  };

  return (
    <View style={styles.flex}>
      <GHeader title="Partner training" showBack onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + theme.spacing[8] },
        ]}
      >
        <GStepIndicator steps={[...ONBOARDING_UI_STEPS]} currentIndex={6} />

        <GText variant="body" color={theme.colors.textSecondary}>
          Mark each module complete after you review it. This keeps cake deliveries safe
          and professional.
        </GText>

        {MODULES.map((module) => (
          <GCard key={module.id} padding="md" elevated={false}>
            <GText variant="bodyBold" style={styles.moduleTitle}>
              {module.title}
            </GText>
            <GText variant="body" color={theme.colors.textSecondary} style={styles.moduleBody}>
              {module.body}
            </GText>
            <GCheckbox
              label={`I completed: ${module.title}`}
              checked={!!checked[module.id]}
              onChange={(value) =>
                setChecked((prev) => ({ ...prev, [module.id]: value }))
              }
            />
          </GCard>
        ))}

        <GButton
          title="Continue to review"
          size="lg"
          fullWidth
          disabled={!allDone}
          loading={updateStepState.isLoading}
          onPress={() => {
            void onContinue();
          }}
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
    gap: theme.spacing[3],
  },
  moduleTitle: { marginBottom: theme.spacing[1] },
  moduleBody: { marginBottom: theme.spacing[3] },
});
