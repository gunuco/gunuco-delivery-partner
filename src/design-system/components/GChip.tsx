import { Pressable, StyleSheet } from 'react-native';

import { theme } from '../theme';
import { GText } from './GText';

export type GChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
};

export function GChip({ label, selected = false, onPress, disabled = false }: GChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled }}
      disabled={disabled || !onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? theme.colors.primary : theme.colors.surface,
          borderColor: selected ? theme.colors.primary : theme.colors.border,
          opacity: disabled ? 0.45 : pressed ? 0.85 : 1,
        },
      ]}
    >
      <GText
        variant="caption"
        color={selected ? theme.colors.textInverse : theme.colors.text}
        style={styles.label}
      >
        {label}
      </GText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: theme.components.minTouchTarget,
    paddingHorizontal: theme.spacing[3],
    borderRadius: theme.radius.full,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '600',
  },
});
