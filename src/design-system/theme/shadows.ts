import type { ViewStyle } from 'react-native';

import { colors } from './colors';

type ShadowStyle = Pick<
  ViewStyle,
  'elevation' | 'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius'
>;

export const shadows = {
  sm: {
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  } satisfies ShadowStyle,
  md: {
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  } satisfies ShadowStyle,
  lg: {
    elevation: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
  } satisfies ShadowStyle,
} as const;

export type ShadowKey = keyof typeof shadows;
export type Shadows = typeof shadows;
