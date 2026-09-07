import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
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
  GLoader,
  GStepIndicator,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import type { IconName } from '@/src/design-system';
import { StepBanner } from '@/src/features/onboarding/StepBanner';
import { OnboardingHeader } from '@/src/features/onboarding/OnboardingHeader';
import { ONBOARDING_UI_STEPS } from '@/src/features/onboarding/steps';
import { useOnboarding, useVehicle } from '@/src/hooks';
import type { OwnershipStatus, VehicleType } from '@/src/types';

const VEHICLE_TYPES: { label: string; value: VehicleType; icon: IconName }[] = [
  { label: 'Two wheeler', value: 'TWO_WHEELER', icon: 'scooter' },
  { label: 'EV scooter', value: 'EV_SCOOTER', icon: 'bolt' },
  { label: 'Three wheeler', value: 'THREE_WHEELER', icon: 'car' },
  { label: 'Other', value: 'OTHER', icon: 'vehicle' },
];

const OWNERSHIP: { label: string; value: OwnershipStatus; icon: IconName }[] = [
  { label: 'Owned', value: 'OWNED', icon: 'key' },
  { label: 'Rented', value: 'RENTED', icon: 'home' },
  { label: 'Company', value: 'COMPANY', icon: 'building' },
];

export default function VehicleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { vehicle, isLoading, updateVehicle, updateState } = useVehicle();
  const { completeStep, updateStepState } = useOnboarding();

  const [type, setType] = useState<VehicleType>('TWO_WHEELER');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [number, setNumber] = useState('');
  const [color, setColor] = useState('');
  const [ownership, setOwnership] = useState<OwnershipStatus>('OWNED');
  const [year, setYear] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!vehicle) return;
    // Hydrate local draft from repository vehicle once available.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- form draft sync from server data
    setType(vehicle.type ?? 'TWO_WHEELER');
    setMake(vehicle.make ?? '');
    setModel(vehicle.model ?? '');
    setNumber(vehicle.number ?? '');
    setColor(vehicle.color ?? '');
    setOwnership(vehicle.ownership ?? 'OWNED');
    setYear(vehicle.year ? String(vehicle.year) : '');
  }, [vehicle]);

  const loading = Boolean(updateState?.isLoading || updateStepState?.isLoading);
  const footerPad = useMemo(
    () => Math.max(insets.bottom, theme.spacing[3]) + 72,
    [insets.bottom],
  );

  const validate = () => {
    const next: Record<string, string> = {};
    if (!make.trim()) next.make = 'Make is required';
    if (!model.trim()) next.model = 'Model is required';
    if ((number ?? '').trim().length < 6) {
      next.number = 'Enter a valid registration number';
    }
    if (year.trim()) {
      const y = Number(year);
      const current = new Date().getFullYear();
      if (!Number.isFinite(y) || y < 1990 || y > current + 1) {
        next.year = `Enter a year between 1990 and ${current + 1}`;
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onContinue = async () => {
    if (!validate()) {
      showToast({ type: 'warning', message: 'Please fix the highlighted fields' });
      return;
    }
    try {
      await updateVehicle({
        type,
        make: make.trim(),
        model: model.trim(),
        number: number.trim().toUpperCase(),
        color: color.trim() || undefined,
        ownership,
        year: year ? Number(year) : undefined,
      });
      await completeStep('VEHICLE');
      router.push('/(onboarding)/documents');
    } catch {
      showToast({ type: 'error', message: 'Could not save vehicle details' });
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <GLoader label="Loading vehicle…" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <OnboardingHeader title="Vehicle details" />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: footerPad }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <GStepIndicator steps={[...ONBOARDING_UI_STEPS]} currentIndex={3} />

        <StepBanner name="vehicle" />

        <View style={styles.fieldBlock}>
          <GText variant="label" color={theme.colors.textSecondary}>
            VEHICLE TYPE
          </GText>
          <View style={styles.chips}>
            {VEHICLE_TYPES.map((option) => {
              const selected = type === option.value;
              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setType(option.value)}
                  style={[styles.chip, selected && styles.chipSelected]}
                >
                  <GIcon
                    name={option.icon}
                    size={16}
                    color={selected ? theme.colors.textInverse : theme.colors.primary}
                  />
                  <GText
                    variant="caption"
                    color={selected ? theme.colors.textInverse : theme.colors.textSecondary}
                  >
                    {option.label}
                  </GText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <GInput
          label="Make"
          value={make}
          onChangeText={setMake}
          placeholder="Honda"
          error={errors.make}
          leftAccessory={
            <GIcon name="building" size={18} color={theme.colors.primary} />
          }
        />
        <GInput
          label="Model"
          value={model}
          onChangeText={setModel}
          placeholder="Activa 6G"
          error={errors.model}
          leftAccessory={
            <GIcon name="package" size={18} color={theme.colors.primary} />
          }
        />
        <GInput
          label="Registration number"
          value={number}
          onChangeText={(t) => setNumber((t ?? '').toUpperCase())}
          autoCapitalize="characters"
          placeholder="TS09XX1028"
          error={errors.number}
          leftAccessory={
            <GIcon name="idCard" size={18} color={theme.colors.primary} />
          }
        />
        <GInput
          label="Color"
          value={color}
          onChangeText={setColor}
          placeholder="Pearl Precious White"
          leftAccessory={
            <GIcon name="colorPalette" size={18} color={theme.colors.primary} />
          }
        />
        <GInput
          label="Year"
          value={year}
          onChangeText={(t) => setYear((t ?? '').replace(/\D/g, '').slice(0, 4))}
          keyboardType="number-pad"
          placeholder="2023"
          error={errors.year}
          leftAccessory={
            <GIcon name="calendar" size={18} color={theme.colors.primary} />
          }
        />

        <View style={styles.fieldBlock}>
          <GText variant="label" color={theme.colors.textSecondary}>
            OWNERSHIP
          </GText>
          <View style={styles.chips}>
            {OWNERSHIP.map((option) => {
              const selected = ownership === option.value;
              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setOwnership(option.value)}
                  style={[styles.chip, selected && styles.chipSelected]}
                >
                  <GIcon
                    name={option.icon}
                    size={16}
                    color={selected ? theme.colors.textInverse : theme.colors.textMuted}
                  />
                  <GText
                    variant="caption"
                    color={selected ? theme.colors.textInverse : theme.colors.textSecondary}
                  >
                    {option.label}
                  </GText>
                </Pressable>
              );
            })}
          </View>
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[4],
    gap: theme.spacing[3],
  },
  fieldBlock: {
    gap: theme.spacing[2],
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
    flexDirection: 'row',
    gap: theme.spacing[1],
  },
  chipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
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
