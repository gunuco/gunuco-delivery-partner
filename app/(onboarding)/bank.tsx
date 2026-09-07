import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  GButton,
  GIcon,
  GInput,
  GStepIndicator,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import { StepBanner } from '@/src/features/onboarding/StepBanner';
import { OnboardingHeader } from '@/src/features/onboarding/OnboardingHeader';
import { ONBOARDING_UI_STEPS } from '@/src/features/onboarding/steps';
import { useOnboarding } from '@/src/hooks';

export default function BankDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { completeStep, updateStepState } = useOnboarding();

  const [holder, setHolder] = useState('');
  const [account, setAccount] = useState('');
  const [confirm, setConfirm] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [bankName, setBankName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loading = Boolean(updateStepState?.isLoading);
  const footerPad = useMemo(
    () => Math.max(insets.bottom, theme.spacing[3]) + 72,
    [insets.bottom],
  );

  const validate = () => {
    const next: Record<string, string> = {};
    if ((holder ?? '').trim().length < 3) next.holder = 'Enter account holder name';
    if (!/^\d{9,18}$/.test((account ?? '').trim())) {
      next.account = 'Enter a valid account number';
    }
    if ((account ?? '').trim() !== (confirm ?? '').trim()) {
      next.confirm = 'Account numbers do not match';
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test((ifsc ?? '').trim())) {
      next.ifsc = 'Enter a valid IFSC (e.g. HDFC0001234)';
    }
    if ((bankName ?? '').trim().length < 2) next.bankName = 'Enter bank name';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onContinue = async () => {
    if (!validate()) {
      showToast({ type: 'warning', message: 'Please fix the highlighted fields' });
      return;
    }
    try {
      await completeStep('BANK');
      router.push('/(onboarding)/training');
    } catch {
      showToast({ type: 'error', message: 'Could not save bank details' });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <OnboardingHeader title="Bank details" />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: footerPad }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <GStepIndicator steps={[...ONBOARDING_UI_STEPS]} currentIndex={5} />

        <StepBanner name="bank" />

        <GInput
          label="Account holder name"
          value={holder}
          onChangeText={setHolder}
          autoCapitalize="words"
          placeholder="Enter account holder name"
          error={errors.holder}
          leftAccessory={
            <GIcon name="profile" size={18} color={theme.colors.primary} />
          }
        />
        <GInput
          label="Account number"
          value={account}
          onChangeText={(t) => setAccount((t ?? '').replace(/\D/g, '').slice(0, 18))}
          keyboardType="number-pad"
          placeholder="Enter account number"
          error={errors.account}
          leftAccessory={
            <GIcon name="bank" size={18} color={theme.colors.primary} />
          }
        />
        <GInput
          label="Confirm account number"
          value={confirm}
          onChangeText={(t) => setConfirm((t ?? '').replace(/\D/g, '').slice(0, 18))}
          keyboardType="number-pad"
          placeholder="Re-enter account number"
          error={errors.confirm}
          leftAccessory={
            <GIcon name="checkCircle" size={18} color={theme.colors.primary} />
          }
        />
        <GInput
          label="IFSC"
          value={ifsc}
          onChangeText={(t) => setIfsc((t ?? '').toUpperCase().slice(0, 11))}
          autoCapitalize="characters"
          placeholder="HDFC0001234"
          error={errors.ifsc}
          leftAccessory={
            <GIcon name="building" size={18} color={theme.colors.primary} />
          }
        />
        <GInput
          label="Bank name"
          value={bankName}
          onChangeText={setBankName}
          placeholder="HDFC Bank"
          error={errors.bankName}
          leftAccessory={
            <GIcon name="building" size={18} color={theme.colors.primary} />
          }
        />

        <View style={styles.tipCard}>
          <GIcon name="info" size={20} color={theme.colors.primary} />
          <GText variant="body" color={theme.colors.primary} style={styles.tipText}>
            Make sure the bank details are correct. Incorrect details may delay your
            payouts.
          </GText>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, theme.spacing[3]) },
        ]}
      >
        <GButton
          title="Save & continue"
          size="lg"
          fullWidth
          loading={loading}
          onPress={() => {
            void onContinue();
          }}
          rightIcon={
            <GIcon name="arrowForward" size={18} color={theme.colors.textInverse} />
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: theme.colors.background },
  content: {
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[4],
    gap: theme.spacing[3],
  },
  tipCard: {
    flexDirection: 'row',
    gap: theme.spacing[3],
    backgroundColor: theme.colors.accentSoft,
    borderRadius: theme.radius.lg,
    padding: theme.spacing[4],
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
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
