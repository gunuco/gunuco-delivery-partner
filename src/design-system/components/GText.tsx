import { Text, type TextProps, type TextStyle } from 'react-native';

import { theme, type TypographyVariant } from '../theme';

export type GTextProps = TextProps & {
  variant?: TypographyVariant;
  color?: string;
  center?: boolean;
  numberOfLines?: number;
};

export function GText({
  variant = 'body',
  color = theme.colors.text,
  center = false,
  style,
  children,
  ...rest
}: GTextProps) {
  const textStyle: TextStyle = {
    ...theme.typography[variant],
    color,
    ...(center ? { textAlign: 'center' as const } : null),
  };

  return (
    <Text style={[textStyle, style]} {...rest}>
      {children}
    </Text>
  );
}
