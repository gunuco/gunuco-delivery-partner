import type { ReactNode } from 'react';
import { Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { theme } from '../theme';

export type GIconButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  accessibilityLabel: string;
  children: ReactNode;
  size?: number;
  shape?: 'circle' | 'square';
  variant?: 'plain' | 'filled' | 'outline';
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function GIconButton({
  accessibilityLabel,
  children,
  size = theme.components.minTouchTarget,
  shape = 'circle',
  variant = 'plain',
  disabled,
  onPress,
  style,
  ...rest
}: GIconButtonProps) {
  const bg =
    variant === 'filled'
      ? theme.colors.surfaceMuted
      : theme.colors.transparent;
  const borderWidth = variant === 'outline' ? 1.5 : 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: shape === 'circle' ? theme.radius.full : theme.radius.md,
          backgroundColor: pressed ? theme.colors.border : bg,
          borderWidth,
          borderColor: theme.colors.border,
          opacity: disabled ? 0.45 : 1,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: theme.components.minTouchTarget,
    minHeight: theme.components.minTouchTarget,
  },
});
