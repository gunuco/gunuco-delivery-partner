import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { theme } from '../theme';

export type GCardPadding = 'none' | 'sm' | 'md' | 'lg';

export type GCardProps = {
  children: ReactNode;
  padding?: GCardPadding;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  elevated?: boolean;
};

const paddingMap: Record<GCardPadding, number> = {
  none: 0,
  sm: theme.spacing[3],
  md: theme.spacing[4],
  lg: theme.spacing[5],
};

export function GCard({
  children,
  padding = 'md',
  onPress,
  style,
  elevated = true,
}: GCardProps) {
  const cardStyle: StyleProp<ViewStyle> = [
    styles.card,
    elevated ? theme.shadows.sm : null,
    { padding: paddingMap[padding] },
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [cardStyle, pressed && styles.pressed]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  pressed: {
    opacity: 0.92,
  },
});
