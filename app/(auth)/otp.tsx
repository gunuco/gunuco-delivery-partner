import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { appConfig } from '@/src/config/env';
import {
  GButton,
  GHeader,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import { getPostOtpHref } from '@/src/features/auth/routing';
import { useAuth } from '@/src/hooks';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

function paramString(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

export default function OtpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const params = useLocalSearchParams<{
    phone?: string;
    requestId?: string;
    maskedPhone?: string;
  }>();

  const phone = paramString(params.phone);
  const maskedPhone = paramString(params.maskedPhone) || phone;
  const [requestId, setRequestId] = useState(paramString(params.requestId));

  const { sendOtp, verifyOtp, verifyOtpState, sendOtpState } = useAuth();
  const [otp, setOtp] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const digits = useMemo(() => {
    const chars = otp.replace(/\D/g, '').slice(0, OTP_LENGTH).split('');
    return Array.from({ length: OTP_LENGTH }, (_, i) => chars[i] ?? '');
  }, [otp]);

  const canVerify = otp.replace(/\D/g, '').length === OTP_LENGTH && !!requestId && !!phone;

  const onVerify = async () => {
    const code = otp.replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (code.length !== OTP_LENGTH || !requestId || !phone) {
      return;
    }

    try {
      const result = await verifyOtp({ phone, otp: code, requestId });
      router.replace(getPostOtpHref(result.isNewPartner, result.partnerStatus));
    } catch {
      showToast({
        type: 'error',
        message: 'Incorrect or expired OTP. Please try again.',
      });
      setOtp('');
      inputRef.current?.focus();
    }
  };

  const onResend = async () => {
    if (secondsLeft > 0 || !phone) return;
    try {
      const result = await sendOtp({ phone, countryCode: '+91' });
      setRequestId(result.requestId);
      setOtp('');
      setSecondsLeft(RESEND_SECONDS);
      showToast({ type: 'success', message: 'OTP resent successfully' });
    } catch {
      showToast({ type: 'error', message: 'Unable to resend OTP' });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <GHeader title="Verify OTP" showBack onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + theme.spacing[6] },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <GText variant="body" color={theme.colors.textSecondary}>
          Enter the 6-digit code sent to{' '}
          <GText variant="bodyBold">{maskedPhone}</GText>
        </GText>

        {appConfig.uiTestMode ? (
          <GText variant="caption" color={theme.colors.textMuted} style={styles.testHint}>
            UI Test Mode: use 482916
          </GText>
        ) : null}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="OTP input"
          onPress={() => inputRef.current?.focus()}
          style={styles.otpRow}
        >
          {digits.map((digit, index) => (
            <View
              key={`otp-${index}`}
              style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
            >
              <GText variant="h2" center>
                {digit}
              </GText>
            </View>
          ))}
        </Pressable>

        <TextInput
          ref={inputRef}
          value={otp}
          onChangeText={(text) => setOtp(text.replace(/\D/g, '').slice(0, OTP_LENGTH))}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          maxLength={OTP_LENGTH}
          style={styles.hiddenInput}
          autoFocus
          caretHidden
        />

        <GButton
          title="Verify & continue"
          size="lg"
          fullWidth
          loading={verifyOtpState.isLoading}
          disabled={!canVerify || verifyOtpState.isLoading}
          onPress={() => {
            void onVerify();
          }}
        />

        <Pressable
          accessibilityRole="button"
          disabled={secondsLeft > 0 || sendOtpState.isLoading}
          onPress={() => {
            void onResend();
          }}
          style={styles.resend}
        >
          <GText
            variant="bodyBold"
            color={
              secondsLeft > 0 ? theme.colors.textMuted : theme.colors.primary
            }
            center
          >
            {secondsLeft > 0 ? `Resend OTP in ${secondsLeft}s` : 'Resend OTP'}
          </GText>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: theme.colors.background },
  content: {
    paddingHorizontal: theme.spacing[5],
    paddingTop: theme.spacing[5],
    gap: theme.spacing[4],
  },
  testHint: {
    backgroundColor: theme.colors.surfaceMuted,
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[3],
    borderRadius: theme.radius.md,
    overflow: 'hidden',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing[2],
    marginVertical: theme.spacing[2],
  },
  otpBox: {
    flex: 1,
    minHeight: 56,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxFilled: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surfaceMuted,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 1,
    width: 1,
  },
  resend: {
    minHeight: theme.components.minTouchTarget,
    justifyContent: 'center',
    marginTop: theme.spacing[2],
  },
});
