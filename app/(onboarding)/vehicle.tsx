import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
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
  GLoader,
  GStepIndicator,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import { ONBOARDING_UI_STEPS } from '@/src/features/onboarding/steps';
import { useOnboarding, useVehicle } from '@/src/hooks';
import type { OwnershipStatus, VehicleType } from '@/src/types';

const VEHICLE_TYPES: { label: string; value: VehicleType }[] = [
  { label: 'Two-wheeler', value: 'TWO_WHEELER' },
  { label: 'EV scooter', value: 'EV_SCOOTER' },
  { label: 'Three-wheeler', value: 'THREE_WHEELER' },
  { label: 'Other', value: 'OTHER' },
];

const OWNERSHIP: { label: string; value: OwnershipStatus }[] = [
  { label: 'Owned', value: 'OWNED' },
  { label: 'Rented', value: 'RENTED' },
  { label: 'Company', value: 'COMPANY' },
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
    setType(vehicle.type);
    setMake(vehicle.make);
    setModel(vehicle.model);
    setNumber(vehicle.number);
    setColor(vehicle.color ?? '');
    setOwnership(vehicle.ownership);
    setYear(vehicle.year ? String(vehicle.year) : '');
  }, [vehicle]);

  const loading = updateState.isLoading || updateStepState.isLoading;

  const validate = () => {
    const next: Record<string, string> = {};
    if (!make.trim()) next.make = 'Make is required';
    if (!model.trim()) next.model = 'Model is required';
    if (number.trim().length < 6) next.number = 'Enter a valid registration number';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onContinue = async () => {
    if (!validate()) return;
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
      <GHeader title="Vehicle details" showBack onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + theme.spacing[8] },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <GStepIndicator steps={[...ONBOARDING_UI_STEPS]} currentIndex={3} />

        <GText variant="label" color={theme.colors.textSecondary}>
          VEHICLE TYPE
        </GText>
        <View style={styles.chips}>
          {VEHICLE_TYPES.map((option) => {
            const selected = type === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => setType(option.value)}
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

        <GInput label="Make" value={make} onChangeText={setMake} placeholder="Honda" error={errors.make} />
        <GInput label="Model" value={model} onChangeText={setModel} placeholder="Activa 6G" error={errors.model} />
        <GInput
          label="Registration number"
          value={number}
          onChangeText={(t) => setNumber(t.toUpperCase())}
          autoCapitalize="characters"
          placeholder="TS09AB1234"
          error={errors.number}
        />
        <GInput label="Color" value={color} onChangeText={setColor} placeholder="White" />
        <GInput
          label="Year"
          value={year}
          onChangeText={(t) => setYear(t.replace(/\D/g, '').slice(0, 4))}
          keyboardType="number-pad"
          placeholder="2023"
        />

        <GText variant="label" color={theme.colors.textSecondary}>
          OWNERSHIP
        </GText>
        <View style={styles.chips}>
          {OWNERSHIP.map((option) => {
            const selected = ownership === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => setOwnership(option.value)}
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
