import { useState, type ReactNode } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { theme } from '../theme';
import { GText } from './GText';

export type GInputProps = TextInputProps & {
  label?: string;
  error?: string;
  helperText?: string;
  leftAccessory?: ReactNode;
  rightAccessory?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

export function GInput({
  label,
  error,
  helperText,
  leftAccessory,
  rightAccessory,
  containerStyle,
  secureTextEntry,
  editable = true,
  style,
  ...rest
}: GInputProps) {
  const [focused, setFocused] = useState(false);
  const borderColor = error
    ? theme.colors.danger
    : focused
      ? theme.colors.primary
      : theme.colors.border;

  return (
    <View style={[styles.wrap, containerStyle]}>
      {label ? (
        <GText variant="label" color={theme.colors.textSecondary} style={styles.label}>
          {label}
        </GText>
      ) : null}
      <View
        style={[
          styles.field,
          {
            borderColor,
            backgroundColor: editable ? theme.colors.surface : theme.colors.surfaceMuted,
            opacity: editable ? 1 : 0.7,
          },
        ]}
      >
        {leftAccessory ? <View style={styles.accessory}>{leftAccessory}</View> : null}
        <TextInput
          accessibilityLabel={label ?? rest.placeholder}
          editable={editable}
          secureTextEntry={secureTextEntry}
          placeholderTextColor={theme.colors.textMuted}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          style={[styles.input, style]}
          {...rest}
        />
        {rightAccessory ? <View style={styles.accessory}>{rightAccessory}</View> : null}
      </View>
      {error ? (
        <GText variant="caption" color={theme.colors.danger} style={styles.hint}>
          {error}
        </GText>
      ) : helperText ? (
        <GText variant="caption" color={theme.colors.textMuted} style={styles.hint}>
          {helperText}
        </GText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  label: { marginBottom: theme.spacing[1], textTransform: 'uppercase' },
  field: {
    minHeight: theme.components.inputHeight,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing[3],
  },
  input: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.text,
    paddingVertical: theme.spacing[2],
  },
  accessory: { marginHorizontal: theme.spacing[1] },
  hint: { marginTop: theme.spacing[1] },
});
