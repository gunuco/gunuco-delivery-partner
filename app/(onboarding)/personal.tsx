import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
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
import type { IconName } from '@/src/design-system';
import { StepBanner } from '@/src/features/onboarding/StepBanner';
import { OnboardingHeader } from '@/src/features/onboarding/OnboardingHeader';
import {
  HYDERABAD_AREA_SUGGESTIONS,
  ONBOARDING_UI_STEPS,
} from '@/src/features/onboarding/steps';
import { useOnboarding } from '@/src/hooks';
import type { Gender } from '@/src/types';

const GENDER_OPTIONS: { label: string; value: Gender; icon: IconName }[] = [
  { label: 'Male', value: 'MALE', icon: 'male' },
  { label: 'Female', value: 'FEMALE', icon: 'female' },
  { label: 'Other', value: 'OTHER', icon: 'genderOther' },
  { label: 'Prefer not to say', value: 'PREFER_NOT_TO_SAY', icon: 'genderPreferNot' },
];

export default function PersonalDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { completeStep, updateProfile, updateProfileState, updateStepState } =
    useOnboarding();

  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<Gender | undefined>();
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [stateName, setStateName] = useState('Telangana');
  const [pincode, setPincode] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loading = Boolean(
    updateProfileState?.isLoading || updateStepState?.isLoading,
  );

  const footerPad = useMemo(
    () => Math.max(insets.bottom, theme.spacing[3]) + 72,
    [insets.bottom],
  );

  const validate = () => {
    const next: Record<string, string> = {};
    if (fullName.trim().length < 3) next.fullName = 'Enter your full name';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth.trim())) {
      next.dateOfBirth = 'Use YYYY-MM-DD format';
    } else {
      const ms = Date.parse(dateOfBirth.trim());
      if (!Number.isFinite(ms)) next.dateOfBirth = 'Enter a valid date';
    }
    if (!gender) next.gender = 'Select a gender option';
    if (address.trim().length < 8) next.address = 'Enter a complete address';
    if (!city.trim()) next.city = 'City is required';
    if (!stateName.trim()) next.stateName = 'State is required';
    if (!/^\d{6}$/.test(pincode.trim())) next.pincode = 'Enter a 6-digit pincode';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onContinue = async () => {
    if (!validate()) {
      showToast({ type: 'warning', message: 'Please fix the highlighted fields' });
      return;
    }
    try {
      await updateProfile({
        name: fullName.trim(),
        personalDetails: {
          fullName: fullName.trim(),
          dateOfBirth: dateOfBirth.trim(),
          gender,
          address: address.trim(),
          city: city.trim(),
          state: stateName.trim(),
          pincode: pincode.trim(),
        },
      });
      await completeStep('PERSONAL_DETAILS');
      router.push('/(onboarding)/photo');
    } catch {
      showToast({ type: 'error', message: 'Could not save personal details' });
    }
  };

  const appendArea = (area: string) => {
    setAddress((prev) => {
      const current = (prev ?? '').trim();
      if (!current) return area;
      if (current.toLowerCase().includes(area.toLowerCase())) return current;
      return `${current}, ${area}`;
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <OnboardingHeader title="Personal details" />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: footerPad }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <GStepIndicator steps={[...ONBOARDING_UI_STEPS]} currentIndex={0} />

        <StepBanner name="personal" />

        <GInput
          label="Full name"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
          placeholder="Keshava Reddy"
          error={errors.fullName}
          leftAccessory={
            <GIcon name="profile" size={18} color={theme.colors.primary} />
          }
        />

        <GInput
          label="Date of birth"
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          placeholder="1994-08-14"
          helperText="Format: YYYY-MM-DD"
          error={errors.dateOfBirth}
          keyboardType="numbers-and-punctuation"
          leftAccessory={
            <GIcon name="calendar" size={18} color={theme.colors.primary} />
          }
          rightAccessory={
            <GIcon name="calendar" size={18} color={theme.colors.textMuted} />
          }
        />

        <View style={styles.fieldBlock}>
          <GText variant="label" color={theme.colors.textSecondary}>
            GENDER
          </GText>
          <View style={styles.genderRow}>
            {GENDER_OPTIONS.map((option) => {
              const selected = gender === option.value;
              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => {
                    setGender(option.value);
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.gender;
                      return next;
                    });
                  }}
                  style={[styles.genderChip, selected && styles.genderChipSelected]}
                >
                  <GIcon
                    name={option.icon}
                    size={16}
                    color={selected ? theme.colors.primary : theme.colors.textMuted}
                  />
                  <GText
                    variant="caption"
                    color={selected ? theme.colors.primary : theme.colors.textSecondary}
                    numberOfLines={1}
                  >
                    {option.label}
                  </GText>
                </Pressable>
              );
            })}
          </View>
          {errors.gender ? (
            <GText variant="caption" color={theme.colors.danger}>
              {errors.gender}
            </GText>
          ) : null}
        </View>

        <GInput
          label="Address"
          value={address}
          onChangeText={setAddress}
          placeholder="Flat / street / landmark"
          error={errors.address}
          leftAccessory={
            <GIcon name="location" size={18} color={theme.colors.primary} />
          }
        />

        <View style={styles.fieldBlock}>
          <View style={styles.areaHeader}>
            <GIcon name="location" size={14} color={theme.colors.primary} />
            <GText variant="caption" color={theme.colors.textMuted}>
              Hyderabad area suggestions
            </GText>
          </View>
          <View style={styles.areaChips}>
            {(HYDERABAD_AREA_SUGGESTIONS ?? []).map((area) => (
              <Pressable
                key={area}
                accessibilityRole="button"
                accessibilityLabel={`Add ${area}`}
                onPress={() => appendArea(area)}
                style={({ pressed }) => [
                  styles.areaChip,
                  pressed && styles.areaChipPressed,
                ]}
              >
                <GText variant="caption" color={theme.colors.text}>
                  {area}
                </GText>
              </Pressable>
            ))}
          </View>
        </View>

        <GInput
          label="City"
          value={city}
          onChangeText={setCity}
          error={errors.city}
          leftAccessory={
            <GIcon name="building" size={18} color={theme.colors.primary} />
          }
        />

        <GInput
          label="State"
          value={stateName}
          onChangeText={setStateName}
          error={errors.stateName}
          leftAccessory={
            <GIcon name="map" size={18} color={theme.colors.primary} />
          }
          rightAccessory={
            <GIcon name="chevronDown" size={18} color={theme.colors.textMuted} />
          }
        />

        <GInput
          label="Pincode"
          value={pincode}
          onChangeText={(t) => setPincode((t ?? '').replace(/\D/g, '').slice(0, 6))}
          keyboardType="number-pad"
          maxLength={6}
          placeholder="500033"
          error={errors.pincode}
          leftAccessory={
            <GIcon name="home" size={18} color={theme.colors.primary} />
          }
        />
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, theme.spacing[3]) },
        ]}
      >
        <GButton
          title="Continue"
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
  fieldBlock: {
    gap: theme.spacing[2],
  },
  genderRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
  },
  genderChip: {
    flexGrow: 1,
    flexBasis: '46%',
    minHeight: theme.components.minTouchTarget,
    paddingHorizontal: theme.spacing[3],
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: theme.spacing[1],
  },
  genderChipSelected: {
    backgroundColor: theme.colors.accentSoft,
    borderColor: theme.colors.primary,
  },
  areaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[1],
  },
  areaChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
  },
  areaChip: {
    minHeight: 36,
    paddingHorizontal: theme.spacing[3],
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  areaChipPressed: {
    backgroundColor: theme.colors.accentSoft,
    borderColor: theme.colors.accent,
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
