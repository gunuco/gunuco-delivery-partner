import type { ImageSource } from 'expo-image';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { IconName } from '@/src/design-system';
import {
  GButton,
  GCard,
  GCheckbox,
  GIcon,
  GStepIndicator,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import { OnboardingHeader } from '@/src/features/onboarding/OnboardingHeader';
import { StepBanner } from '@/src/features/onboarding/StepBanner';
import { ONBOARDING_UI_STEPS } from '@/src/features/onboarding/steps';
import { useOnboarding } from '@/src/hooks';

const CAKE_IMAGE = require('../../assets/images/training-module-cake.png');
const APP_IMAGE = require('../../assets/images/training-module-app.png');
const SAFETY_IMAGE = require('../../assets/images/training-module-safety.png');

const MODULES: {
  id: string;
  title: string;
  body: string;
  icon: IconName;
  image: ImageSource;
}[] = [
  {
    id: 'cake',
    title: 'Cake handling',
    body: 'Keep boxes upright, avoid sudden braking, and verify temperature tags before leaving the hub.',
    icon: 'cake',
    image: CAKE_IMAGE,
  },
  {
    id: 'app',
    title: 'App usage',
    body: 'Accept orders quickly, follow status steps, and use in-app navigation for pickup and drop.',
    icon: 'navigation',
    image: APP_IMAGE,
  },
  {
    id: 'safety',
    title: 'Safety',
    body: 'Wear a helmet, park safely near customer gates, and never share customer details.',
    icon: 'shield',
    image: SAFETY_IMAGE,
  },
];

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

  const allDone = useMemo(() => MODULES.every((m) => Boolean(checked[m.id])), [checked]);
  const loading = Boolean(updateStepState?.isLoading);
  const footerPad = useMemo(() => Math.max(insets.bottom, theme.spacing[3]) + 72, [insets.bottom]);

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
      <OnboardingHeader title="Partner training" />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: footerPad }]}
        showsVerticalScrollIndicator={false}
      >
        <GStepIndicator steps={[...ONBOARDING_UI_STEPS]} currentIndex={6} />

        <StepBanner name="training" />

        <View style={styles.instruction}>
          <View style={styles.instructionIcon}>
            <GIcon name="training" size={18} color={theme.colors.textInverse} />
          </View>
          <GText variant="body" color={theme.colors.textSecondary} style={styles.instructionText}>
            <GText variant="bodyBold" color={theme.colors.text}>
              Mark each module complete after you review it.
            </GText>{' '}
            This keeps cake deliveries safe and professional.
          </GText>
        </View>

        {MODULES.map((module) => (
          <GCard key={module.id} padding="md" elevated style={styles.moduleCard}>
            <View style={styles.moduleRow}>
              <View style={styles.moduleIcon}>
                <GIcon name={module.icon} size={22} color={theme.colors.primary} />
              </View>
              <View style={styles.moduleCopy}>
                <GText variant="bodyBold">{module.title}</GText>
                <GText variant="caption" color={theme.colors.textSecondary}>
                  {module.body}
                </GText>
                <GCheckbox
                  label={`I completed: ${module.title}`}
                  checked={Boolean(checked[module.id])}
                  onChange={(value) =>
                    setChecked((prev) => ({
                      ...(prev ?? {}),
                      [module.id]: value,
                    }))
                  }
                />
              </View>
              <View style={styles.moduleArtWrap}>
                <Image
                  source={module.image}
                  style={styles.moduleArt}
                  contentFit="contain"
                  accessibilityLabel={`${module.title} illustration`}
                />
              </View>
            </View>
          </GCard>
        ))}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, theme.spacing[3]) }]}>
        <GButton
          title="Continue to review"
          size="lg"
          fullWidth
          disabled={!allDone}
          loading={loading}
          onPress={() => {
            void onContinue();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: theme.colors.background },
  content: {
    // paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[4],
    gap: theme.spacing[3],
  },
  instruction: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing[3],
    backgroundColor: theme.colors.surfaceMuted,
    marginHorizontal: theme.spacing[4],
    borderRadius: theme.radius.lg,
    padding: theme.spacing[5],
  },
  instructionIcon: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionText: {
    flex: 1,
  },
  moduleCard: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing[4],
  },
  moduleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing[3],
  },
  moduleIcon: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleCopy: {
    flex: 1,
    gap: theme.spacing[2],
    minWidth: 0,
  },
  moduleArtWrap: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  moduleArt: {
    width: 68,
    height: 68,
  },
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
