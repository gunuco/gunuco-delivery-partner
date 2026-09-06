import { colors } from './colors';
import { components } from './components';
import { radius } from './radius';
import { shadows } from './shadows';
import { spacing } from './spacing';
import { typography } from './typography';

export const theme = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  components,
} as const;

export type Theme = typeof theme;

export { colors } from './colors';
export type { Colors, OrderStatusColorKey, PartnerStatusColorKey } from './colors';
export { typography, fontSizes, fontWeights, lineHeights } from './typography';
export type { Typography, TypographyVariant } from './typography';
export { spacing } from './spacing';
export type { Spacing, SpacingKey } from './spacing';
export { radius } from './radius';
export type { Radius, RadiusKey } from './radius';
export { shadows } from './shadows';
export type { Shadows, ShadowKey } from './shadows';
export { components } from './components';
export type { ComponentTokens } from './components';
