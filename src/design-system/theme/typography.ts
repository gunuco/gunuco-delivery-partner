import type { TextStyle } from 'react-native';

export const fontSizes = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 34,
} as const;

export const fontWeights = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
};

export const lineHeights = {
  tight: 1.2,
  snug: 1.3,
  normal: 1.45,
  relaxed: 1.6,
} as const;

/** System font stack — reliable across iOS / Android / web */
const fontFamily: TextStyle['fontFamily'] = undefined;

function buildType(
  fontSize: number,
  fontWeight: TextStyle['fontWeight'],
  lineHeightMultiplier: number,
  letterSpacing = 0,
): TextStyle {
  return {
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight: Math.round(fontSize * lineHeightMultiplier),
    letterSpacing,
  };
}

export const typography = {
  display: buildType(fontSizes['4xl'], fontWeights.bold, lineHeights.tight, -0.5),
  h1: buildType(fontSizes['3xl'], fontWeights.bold, lineHeights.tight, -0.3),
  h2: buildType(fontSizes['2xl'], fontWeights.bold, lineHeights.snug, -0.2),
  h3: buildType(fontSizes.xl, fontWeights.semibold, lineHeights.snug),
  title: buildType(fontSizes.lg, fontWeights.semibold, lineHeights.snug),
  body: buildType(fontSizes.md, fontWeights.regular, lineHeights.normal),
  bodyBold: buildType(fontSizes.md, fontWeights.semibold, lineHeights.normal),
  caption: buildType(fontSizes.sm, fontWeights.regular, lineHeights.normal),
  label: buildType(fontSizes.xs, fontWeights.medium, lineHeights.snug, 0.3),
  button: buildType(fontSizes.md, fontWeights.semibold, lineHeights.tight),
} as const;

export type TypographyVariant = keyof typeof typography;
export type Typography = typeof typography;
