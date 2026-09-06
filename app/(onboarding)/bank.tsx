import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  GButton,
  GHeader,
  GInput,
  GStepIndicator,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
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

  const validate = () => {
    const next: Record<string, string> = {};
    if (holder.trim().length < 3) next.holder = 'Enter account holder name';
    if (!/^\d{9,18}$/.test(account.trim())) next.account = 'Enter a valid account number';
    if (account.trim() !== confirm.trim()) next.confirm = 'Account numbers do not match';
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(ifsc.trim())) {
      next.ifsc = 'Enter a valid IFSC (e.g. HDFC0001234)';
    }
    if (bankName.trim().length < 2) next.bankName = 'Enter bank name';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onContinue = async () => {
    if (!validate()) return;
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
      <GHeader title="Bank details" showBack onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + theme.spacing[8] },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <GStepIndicator steps={[...ONBOARDING_UI_STEPS]} currentIndex={5} />

        <GText variant="body" color={theme.colors.textSecondary}>
          Payouts are sent to this account after successful deliveries. Double-check
          your details.
        </GText>

        <GInput
          label="Account holder name"
          value={holder}
          onChangeText={setHolder}
          autoCapitalize="words"
          error={errors.holder}
        />
        <GInput
          label="Account number"
          value={account}
          onChangeText={(t) => setAccount(t.replace(/\D/g, '').slice(0, 18))}
          keyboardType="number-pad"
          error={errors.account}
        />
        <GInput
          label="Confirm account number"
          value={confirm}
          onChangeText={(t) => setConfirm(t.replace(/\D/g, '').slice(0, 18))}
          keyboardType="number-pad"
          error={errors.confirm}
        />
        <GInput
          label="IFSC"
          value={ifsc}
          onChangeText={(t) => setIfsc(t.toUpperCase().slice(0, 11))}
          autoCapitalize="characters"
          placeholder="HDFC0001234"
          error={errors.ifsc}
        />
        <GInput
          label="Bank name"
          value={bankName}
          onChangeText={setBankName}
          placeholder="HDFC Bank"
          error={errors.bankName}
        />

        <GButton
          title="Save & continue"
          size="lg"
          fullWidth
          loading={updateStepState.isLoading}
          onPress={() => {
            void onContinue();
          }}
        />
      </ScrollView>
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
});
