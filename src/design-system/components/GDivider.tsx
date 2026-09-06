import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { theme } from '../theme';

export type GDividerProps = {
  vertical?: boolean;
  spacing?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export function GDivider({
  vertical = false,
  spacing = theme.spacing[3],
  color = theme.colors.border,
  style,
}: GDividerProps) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={[
        vertical
          ? { width: StyleSheet.hairlineWidth, alignSelf: 'stretch', marginHorizontal: spacing }
          : { height: StyleSheet.hairlineWidth, alignSelf: 'stretch', marginVertical: spacing },
        { backgroundColor: color },
        style,
      ]}
    />
  );
}
