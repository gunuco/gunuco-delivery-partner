import { theme } from '../theme';
import { GText, type GTextProps } from './GText';

export type GHeadingProps = Omit<GTextProps, 'variant'> & {
  level?: 1 | 2 | 3;
};

const levelVariant = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
} as const;

export function GHeading({
  level = 2,
  color = theme.colors.text,
  ...rest
}: GHeadingProps) {
  return <GText variant={levelVariant[level]} color={color} accessibilityRole="header" {...rest} />;
}
