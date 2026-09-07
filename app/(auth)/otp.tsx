import { Image } from 'expo-image';
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
import { GButton, GIcon, GIconButton, GText, theme, useToast } from '@/src/design-system';
import { getPostOtpHref } from '@/src/features/auth/routing';
import { useAuth } from '@/src/hooks';
import { authImageSources } from '../../assets/images/auth/sources';

const BG = '#FFF5F7';
const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;
const HERO_ASPECT = 1024 / 682;
const FOOTER_ASPECT = 1024 / 682;

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
      <View style={[styles.topBar, { paddingTop: insets.top + theme.spacing[1] }]}>
        <GIconButton accessibilityLabel="Go back" onPress={() => router.back()} size={40}>
          <GIcon name="back" size={22} color={theme.colors.text} />
        </GIconButton>
        <GText variant="title" style={styles.topTitle}>
          Verify OTP
        </GText>
        {/* Spacer keeps title centered vs back button (settings ignored). */}
        <View style={styles.topSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, theme.spacing[2]) },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroWrap}>
          <Image
            source={authImageSources.otpHero}
            style={styles.bleedImage}
            contentFit="contain"
            contentPosition="center"
            accessibilityLabel="One Step Closer"
            transition={120}
          />
        </View>

        <View style={styles.formSection}>
          <View style={styles.formCard}>
            <GText variant="body" color={theme.colors.textSecondary}>
              Enter the 6-digit code sent to{' '}
              <GText variant="bodyBold">{maskedPhone || 'your number'}</GText>
            </GText>

            {appConfig.uiTestMode ? (
              <GText variant="caption" color={theme.colors.primaryLight} style={styles.testHint}>
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
                    {digit || ' '}
                  </GText>
                </View>
              ))}
            </Pressable>

            <TextInput
              ref={inputRef}
              value={otp}
              onChangeText={(text) => setOtp((text ?? '').replace(/\D/g, '').slice(0, OTP_LENGTH))}
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
                color={secondsLeft > 0 ? theme.colors.textMuted : theme.colors.primary}
                center
              >
                {secondsLeft > 0 ? `Resend OTP in ${secondsLeft}s` : 'Resend OTP'}
              </GText>
            </Pressable>
          </View>
        </View>

        <View style={styles.footerWrap}>
          <Image
            source={authImageSources.otpFooter}
            style={styles.bleedImage}
            contentFit="contain"
            contentPosition="center"
            accessibilityLabel="More Deliveries Brighter Days"
            transition={120}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: BG },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[3],
    paddingBottom: theme.spacing[1],
    backgroundColor: BG,
    zIndex: 2,
  },
  topTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '700',
  },
  topSpacer: {
    width: 40,
    height: 40,
  },
  content: {
    flexGrow: 1,
  },
  heroWrap: {
    width: '100%',
    aspectRatio: HERO_ASPECT,
    backgroundColor: BG,
    marginTop: -theme.spacing[2],
  },
  bleedImage: {
    width: '100%',
    height: '100%',
  },
  formSection: {
    paddingHorizontal: theme.spacing[4],
    marginTop: -theme.spacing[5],
    zIndex: 2,
  },
  formCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 22,
    padding: theme.spacing[4],
    gap: theme.spacing[3],
    ...theme.shadows.md,
  },
  testHint: {
    backgroundColor: theme.colors.accentSoft,
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[3],
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    fontWeight: '600',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing[2],
  },
  otpBox: {
    flex: 1,
    minHeight: 52,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxFilled: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.accentSoft,
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
  },
  footerWrap: {
    height: '37%',
    width: '100%',
    aspectRatio: FOOTER_ASPECT,
    marginLeft: -theme.spacing[5],
    marginTop: theme.spacing[1],
    backgroundColor: BG,
  },
});
