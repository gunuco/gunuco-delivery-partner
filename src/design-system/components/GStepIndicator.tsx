import { StyleSheet, View } from 'react-native';

import { GIcon } from '../icons/GIcon';
import { theme } from '../theme';
import { GText } from './GText';

export type GStepIndicatorProps = {
  steps: string[];
  currentIndex: number;
};

export function GStepIndicator({ steps, currentIndex }: GStepIndicatorProps) {
  return (
    <View
      style={styles.wrap}
      accessibilityRole="progressbar"
      accessibilityValue={{
        min: 0,
        max: Math.max(steps.length - 1, 0),
        now: currentIndex,
        text: steps[currentIndex],
      }}
    >
      {steps.map((step, index) => {
        const done = index < currentIndex;
        const active = index === currentIndex;
        const color = done || active ? theme.colors.primary : theme.colors.borderStrong;

        return (
          <View key={`${step}-${index}`} style={styles.stepCol}>
            <View style={styles.trackRow}>
              {index > 0 ? (
                <View
                  style={[
                    styles.line,
                    {
                      backgroundColor:
                        index <= currentIndex ? theme.colors.primary : theme.colors.border,
                    },
                  ]}
                />
              ) : (
                <View style={styles.lineSpacer} />
              )}
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: done || active ? theme.colors.primary : theme.colors.surface,
                    borderColor: color,
                  },
                ]}
              >
                {done ? (
                  <GIcon name="check" size={14} color={theme.colors.textInverse} />
                ) : (
                  <GText
                    variant="label"
                    color={active ? theme.colors.textInverse : theme.colors.textMuted}
                  >
                    {index + 1}
                  </GText>
                )}
              </View>
              {index < steps.length - 1 ? (
                <View
                  style={[
                    styles.line,
                    {
                      backgroundColor:
                        index < currentIndex ? theme.colors.primary : theme.colors.border,
                    },
                  ]}
                />
              ) : (
                <View style={styles.lineSpacer} />
              )}
            </View>
            <GText
              variant="caption"
              center
              color={active ? theme.colors.text : theme.colors.textMuted}
              numberOfLines={2}
              style={styles.label}
            >
              {step}
            </GText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepCol: {
    flex: 1,
    alignItems: 'center',
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: theme.spacing[2],
  },
  line: {
    flex: 1,
    height: 2,
  },
  lineSpacer: {
    flex: 1,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: theme.radius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    paddingHorizontal: theme.spacing[1],
  },
});
