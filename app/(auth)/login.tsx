import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GButton, GIcon, GText, theme, useToast } from '@/src/design-system';
import { useAuth } from '@/src/hooks';
import { getTenDigitMobile, isValidIndianMobile, toE164Indian } from '@/src/utils/phone';
import { authImageSources } from '../../assets/images/auth/sources';

const BG = '#FFF5F7';
/** Login hero natural ratio — full composition stays uncropped. */
const HERO_ASPECT = 912 / 1024;
/** Footer banner natural ratio. */
const FOOTER_ASPECT = 845 / 462;

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { sendOtp, sendOtpState } = useAuth();

  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [focused, setFocused] = useState(false);

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
          {
            paddingTop: insets.top,
            paddingBottom: Math.max(insets.bottom, theme.spacing[2]),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Edge-to-edge hero — matches mock full-bleed illustration */}
        <View style={styles.heroWrap}>
          <Image
            source={authImageSources.loginHero}
            style={styles.bleedImage}
            contentFit="contain"
            contentPosition="top"
            accessibilityLabel="Deliver Happiness Together — GUNUCO Delivery Partner"
            transition={120}
          />
        </View>

        {/* Form card pulls up slightly over hero like the mock */}
        <View style={styles.formSection}>
          <View style={styles.formCard}>
            <GText variant="caption" color={theme.colors.textMuted} style={styles.mobileLabel}>
              MOBILE NUMBER
            </GText>

            <View
              style={[
                styles.phoneField,
                focused ? styles.phoneFieldFocused : null,
                error ? styles.phoneFieldError : null,
              ]}
            >
              <View style={styles.phoneIcon}>
                <GIcon name="phone" size={16} color={theme.colors.textInverse} />
              </View>
              <GText variant="bodyBold" color={theme.colors.text}>
                +91
              </GText>
              <View style={styles.phoneDivider} />
              <TextInput
                value={phone}
                onChangeText={(text) => {
                  const digits = (text ?? '').replace(/\D/g, '').slice(0, 10);
                  setPhone(digits);
                  if (error) setError(undefined);
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                keyboardType="phone-pad"
                textContentType="telephoneNumber"
                autoComplete="tel"
                maxLength={10}
                placeholder="9876543210"
                placeholderTextColor={theme.colors.textMuted}
                accessibilityLabel="Mobile number"
                style={styles.phoneInput}
              />
            </View>

            {error ? (
              <GText variant="caption" color={theme.colors.danger}>
                {error}
              </GText>
            ) : null}

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

            <GText variant="caption" color={theme.colors.textMuted} center style={styles.legal}>
              By continuing you agree to GUNUCO partner{' '}
              <GText
                variant="caption"
                color={theme.colors.primary}
                style={styles.legalLink}
                onPress={() => router.push('/settings/legal')}
              >
                terms
              </GText>{' '}
              and{' '}
              <GText
                variant="caption"
                color={theme.colors.primary}
                style={styles.legalLink}
                onPress={() => router.push('/settings/legal')}
              >
                privacy policy
              </GText>
              .
            </GText>
          </View>
        </View>

        {/* Edge-to-edge footer landscape + slogan */}
        <View style={styles.footerWrap}>
          <Image
            source={authImageSources.loginFooter}
            style={styles.bleedImage}
            contentFit="cover"
            contentPosition="bottom"
            transition={120}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: BG },
  content: {
    flexGrow: 1,
  },
  heroWrap: {
    width: '100%',
    aspectRatio: HERO_ASPECT,
    backgroundColor: BG,
    marginTop: -theme.spacing[8],
  },
  bleedImage: {
    width: '100%',
    height: '100%',
  },
  formSection: {
    paddingHorizontal: theme.spacing[4],
    marginTop: -theme.spacing[6],
    zIndex: 2,
  },
  formCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 22,
    padding: theme.spacing[4],
    gap: theme.spacing[3],
    ...theme.shadows.md,
  },
  mobileLabel: {
    letterSpacing: 1.2,
    fontWeight: '700',
  },
  phoneField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    borderWidth: 1.5,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing[2],
    minHeight: 52,
    backgroundColor: theme.colors.surface,
  },
  phoneFieldFocused: {
    borderColor: theme.colors.primary,
  },
  phoneFieldError: {
    borderColor: theme.colors.danger,
  },
  phoneIcon: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneDivider: {
    width: 1,
    height: 22,
    backgroundColor: theme.colors.borderStrong,
  },
  phoneInput: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.text,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    paddingHorizontal: 0,
  },
  legal: {
    marginTop: theme.spacing[1],
  },
  legalLink: {
    textDecorationLine: 'underline',
    fontWeight: '700',
  },
  footerWrap: {
    height: '35%',
    width: '100%',
    aspectRatio: FOOTER_ASPECT,
    marginTop: -theme.spacing[2],
    marginBottom: -theme.spacing[2],
    marginLeft: -theme.spacing[14],
    backgroundColor: BG,
  },
});
