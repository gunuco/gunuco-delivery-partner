import { Pressable, StyleSheet, View } from 'react-native';

import { GIcon } from '../icons/GIcon';
import { theme } from '../theme';
import { GText } from './GText';

export type GCheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};

export function GCheckbox({
  label,
  checked,
  onChange,
  disabled = false,
}: GCheckboxProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => onChange(!checked)}
      style={({ pressed }) => [
        styles.row,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.box,
          {
            backgroundColor: checked ? theme.colors.primary : theme.colors.surface,
            borderColor: checked ? theme.colors.primary : theme.colors.borderStrong,
          },
        ]}
      >
        {checked ? (
          <GIcon name="check" size={16} color={theme.colors.textInverse} />
        ) : null}
      </View>
      <GText variant="body" style={styles.label}>
        {label}
      </GText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: theme.components.minTouchTarget,
    gap: theme.spacing[3],
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: theme.radius.sm,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.8,
  },
});
