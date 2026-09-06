export const components = {
  buttonHeights: {
    sm: 40,
    md: 48,
    lg: 56,
  },
  inputHeight: 52,
  iconSizes: {
    xs: 14,
    sm: 18,
    md: 22,
    lg: 28,
    xl: 36,
  },
  headerHeight: 56,
  tabBarHeight: 64,
  minTouchTarget: 44,
  avatarSizes: {
    sm: 32,
    md: 40,
    lg: 56,
    xl: 72,
  },
} as const;

export type ComponentTokens = typeof components;
