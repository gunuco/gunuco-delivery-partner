import { StyleSheet, View } from 'react-native';

import { theme } from '../theme';

export type GProgressProps = {
  progress: number;
  height?: number;
  trackColor?: string;
  fillColor?: string;
};

export function GProgress({
  progress,
  height = 8,
  trackColor = theme.colors.surfaceMuted,
  fillColor = theme.colors.primary,
}: GProgressProps) {
  const clamped = Math.max(0, Math.min(1, progress));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={[styles.track, { height, borderRadius: height / 2, backgroundColor: trackColor }]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${clamped * 100}%`,
            height,
            borderRadius: height / 2,
            backgroundColor: fillColor,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    minWidth: 0,
  },
});
