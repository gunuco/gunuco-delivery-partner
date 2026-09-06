import { useRouter } from 'expo-router';
import { useState } from 'react';
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
  GHeading,
  GInput,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import { useAuth } from '@/src/hooks';
import { getTenDigitMobile, isValidIndianMobile, toE164Indian } from '@/src/utils/phone';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { sendOtp, sendOtpState } = useAuth();

  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | undefined>();

  const ten = getTenDigitMobile(phone);
  const canSubmit = isValidIndianMobile(phone) && !sendOtpState.isLoading;

  const onSendOtp = async () => {
    if (!isValidIndianMobile(phone)) {
      setError('Enter a valid 10-digit Indian mobile number');
      return;
    }
    setError(undefined);
    const e164 = toE164Indian(phone);
    if (!e164 || !ten) {
      setError('Enter a valid mobile number');
      return;
    }

    try {
      const result = await sendOtp({ phone: e164, countryCode: '+91' });
      router.push({
        pathname: '/(auth)/otp',
        params: {
          phone: e164,
          requestId: result.requestId,
          maskedPhone: result.maskedPhone,
        },
      });
    } catch {
      showToast({
        type: 'error',
        message: 'Unable to send OTP. Please try again.',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + theme.spacing[8], paddingBottom: insets.bottom + theme.spacing[6] },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brand}>
          <GText variant="caption" color={theme.colors.primaryLight} style={styles.brandEyebrow}>
            DELIVERY PARTNER
          </GText>
          <GHeading level={1} style={styles.brandTitle}>
            GUNUCO
          </GHeading>
          <GText variant="body" color={theme.colors.textSecondary} style={styles.subtitle}>
            Sign in with your mobile number to start delivering cakes across Hyderabad.
          </GText>
        </View>

        <View style={styles.form}>
          <GInput
            label="Mobile number"
            value={phone}
            onChangeText={(text) => {
              const digits = text.replace(/\D/g, '').slice(0, 10);
              setPhone(digits);
              if (error) setError(undefined);
            }}
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            autoComplete="tel"
            maxLength={10}
            placeholder="9876543210"
            error={error}
            leftAccessory={
              <GText variant="bodyBold" color={theme.colors.textSecondary}>
                +91
              </GText>
            }
          />

          <GButton
            title="Send OTP"
            size="lg"
            fullWidth
            loading={sendOtpState.isLoading}
            disabled={!canSubmit}
            onPress={() => {
              void onSendOtp();
            }}
          />
        </View>

        <GText variant="caption" color={theme.colors.textMuted} center>
          By continuing you agree to GUNUCO partner terms and privacy policy.
        </GText>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: theme.colors.background },
  content: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing[5],
    justifyContent: 'center',
    gap: theme.spacing[7],
  },
  brand: { gap: theme.spacing[2] },
  brandEyebrow: {
    letterSpacing: 1.2,
    fontWeight: '700',
  },
  brandTitle: {
    color: theme.colors.primary,
  },
  subtitle: {
    marginTop: theme.spacing[1],
    maxWidth: 320,
  },
  form: {
    gap: theme.spacing[4],
  },
});
