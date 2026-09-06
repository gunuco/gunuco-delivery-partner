import { useRouter } from 'expo-router';
import { useState } from 'react';
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
  GHeader,
  GInput,
  GStepIndicator,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import {
  HYDERABAD_AREA_SUGGESTIONS,
  ONBOARDING_UI_STEPS,
} from '@/src/features/onboarding/steps';
import { useOnboarding } from '@/src/hooks';
import type { Gender } from '@/src/types';

const GENDER_OPTIONS: { label: string; value: Gender }[] = [
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
  { label: 'Other', value: 'OTHER' },
  { label: 'Prefer not to say', value: 'PREFER_NOT_TO_SAY' },
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

  const loading = updateProfileState.isLoading || updateStepState.isLoading;

  const validate = () => {
    const next: Record<string, string> = {};
    if (fullName.trim().length < 3) next.fullName = 'Enter your full name';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth.trim())) {
      next.dateOfBirth = 'Use YYYY-MM-DD format';
    }
    if (address.trim().length < 8) next.address = 'Enter a complete address';
    if (!city.trim()) next.city = 'City is required';
    if (!/^\d{6}$/.test(pincode.trim())) next.pincode = 'Enter a 6-digit pincode';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onContinue = async () => {
    if (!validate()) return;
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

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <GHeader
        title="Personal details"
        showBack
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + theme.spacing[8] },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <GStepIndicator steps={[...ONBOARDING_UI_STEPS]} currentIndex={0} />

        <GInput
          label="Full name"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
          placeholder="Keshava Reddy"
          error={errors.fullName}
        />
        <GInput
          label="Date of birth"
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          placeholder="1994-08-14"
          helperText="Format: YYYY-MM-DD"
          error={errors.dateOfBirth}
        />

        <GText variant="label" color={theme.colors.textSecondary}>
          GENDER
        </GText>
        <View style={styles.chips}>
          {GENDER_OPTIONS.map((option) => {
            const selected = gender === option.value;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                onPress={() => setGender(option.value)}
                style={[styles.chip, selected && styles.chipSelected]}
              >
                <GText
                  variant="caption"
                  color={selected ? theme.colors.textInverse : theme.colors.text}
                >
                  {option.label}
                </GText>
              </Pressable>
            );
          })}
        </View>

        <GInput
          label="Address"
          value={address}
          onChangeText={setAddress}
          placeholder="Flat / street / landmark"
          error={errors.address}
        />

        <GText variant="caption" color={theme.colors.textMuted}>
          Hyderabad area suggestions
        </GText>
        <View style={styles.chips}>
          {HYDERABAD_AREA_SUGGESTIONS.map((area) => (
            <Pressable
              key={area}
              accessibilityRole="button"
              onPress={() =>
                setAddress((prev) => (prev ? `${prev}, ${area}` : area))
              }
              style={styles.chip}
            >
              <GText variant="caption">{area}</GText>
            </Pressable>
          ))}
        </View>

        <GInput
          label="City"
          value={city}
          onChangeText={setCity}
          error={errors.city}
        />
        <GInput
          label="State"
          value={stateName}
          onChangeText={setStateName}
        />
        <GInput
          label="Pincode"
          value={pincode}
          onChangeText={(t) => setPincode(t.replace(/\D/g, '').slice(0, 6))}
          keyboardType="number-pad"
          maxLength={6}
          placeholder="500033"
          error={errors.pincode}
        />

        <GButton
          title="Save & continue"
          size="lg"
          fullWidth
          loading={loading}
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
  },
  chip: {
    minHeight: theme.components.minTouchTarget,
    paddingHorizontal: theme.spacing[3],
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
});
