import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { theme } from '../theme';
import { GText } from './GText';

export type GLoaderProps = {
  label?: string;
  size?: 'small' | 'large';
  color?: string;
};

export function GLoader({
  label,
  size = 'large',
  color = theme.colors.primary,
}: GLoaderProps) {
  return (
    <View style={styles.wrap} accessibilityRole="progressbar" accessibilityLabel={label ?? 'Loading'}>
      <ActivityIndicator size={size} color={color} />
      {label ? (
        <GText variant="caption" color={theme.colors.textSecondary} style={styles.label}>
          {label}
        </GText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing[4],
    gap: theme.spacing[3],
  },
  label: {
    marginTop: theme.spacing[1],
  },
});
