import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { theme } from '../theme';
import { GText } from './GText';

export type GButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type GButtonSize = 'sm' | 'md' | 'lg';

export type GButtonProps = Omit<PressableProps, 'children'> & {
  title: string;
  variant?: GButtonVariant;
  size?: GButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  onPress?: () => void;
};

const variantStyles: Record<
  GButtonVariant,
  { bg: string; text: string; border: string; pressed: string }
> = {
  primary: {
    bg: theme.colors.primary,
    text: theme.colors.textInverse,
    border: theme.colors.primary,
    pressed: theme.colors.primaryDark,
  },
  secondary: {
    bg: theme.colors.surfaceMuted,
    text: theme.colors.primary,
    border: theme.colors.surfaceMuted,
    pressed: theme.colors.border,
  },
  outline: {
    bg: theme.colors.transparent,
    text: theme.colors.primary,
    border: theme.colors.primary,
    pressed: theme.colors.surfaceMuted,
  },
  ghost: {
    bg: theme.colors.transparent,
    text: theme.colors.primary,
    border: theme.colors.transparent,
    pressed: theme.colors.surfaceMuted,
  },
  danger: {
    bg: theme.colors.danger,
    text: theme.colors.textInverse,
    border: theme.colors.danger,
    pressed: '#9E1F1F',
  },
  success: {
    bg: theme.colors.success,
    text: theme.colors.textInverse,
    border: theme.colors.success,
    pressed: '#145C3A',
  },
};

export function GButton({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  onPress,
  style,
  ...rest
}: GButtonProps) {
  const v = variantStyles[variant];
  const height = theme.components.buttonHeights[size];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          height,
          backgroundColor: pressed && !isDisabled ? v.pressed : v.bg,
          borderColor: v.border,
          opacity: isDisabled ? 0.5 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          width: fullWidth ? '100%' : undefined,
          paddingHorizontal: size === 'sm' ? theme.spacing[3] : theme.spacing[4],
        },
        style as StyleProp<ViewStyle>,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={v.text} />
      ) : (
        <View style={styles.content}>
          {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
          <GText variant="button" color={v.text}>
            {title}
          </GText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: theme.components.minTouchTarget,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  icon: {
    marginRight: theme.spacing[1],
  },
});
