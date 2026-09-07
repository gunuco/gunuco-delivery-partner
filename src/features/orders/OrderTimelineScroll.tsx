import { ScrollView, StyleSheet, View } from 'react-native';

import { GIcon, GText, theme } from '@/src/design-system';

import type { TimelinePoint } from './orderTimeline';

export type OrderTimelineScrollProps = {
  points: TimelinePoint[];
};

const DOT = 22;
const STEP_WIDTH = 72;

export function OrderTimelineScroll({ points }: OrderTimelineScrollProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {points.map((point, index) => {
        const next = points[index + 1];
        const lineCompleted =
          point.completed && (next?.completed || next?.current);

        return (
          <View key={point.key} style={styles.step}>
            <View style={styles.trackRow}>
              <View
                style={[
                  styles.dot,
                  point.completed && styles.dotCompleted,
                  point.current && !point.completed && styles.dotCurrent,
                  !point.completed && !point.current && styles.dotFuture,
                ]}
              >
                {point.completed ? (
                  <GIcon name="check" size={12} color={theme.colors.white} />
                ) : null}
              </View>
              {index < points.length - 1 ? (
                <View
                  style={[
                    styles.line,
                    {
                      backgroundColor: lineCompleted
                        ? theme.colors.primary
                        : theme.colors.borderStrong,
                    },
                  ]}
                />
              ) : null}
            </View>
            <GText
              variant="label"
              color={
                point.completed || point.current
                  ? theme.colors.text
                  : theme.colors.textMuted
              }
              center
              numberOfLines={2}
              style={styles.label}
            >
              {point.label}
            </GText>
            {point.timeLabel ? (
              <GText
                variant="caption"
                color={theme.colors.textMuted}
                center
                numberOfLines={1}
              >
                {point.timeLabel}
              </GText>
            ) : null}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    gap: 0,
  },
  step: {
    width: STEP_WIDTH,
    alignItems: 'center',
    gap: 4,
  },
  trackRow: {
    width: '100%',
    height: DOT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: theme.spacing[1],
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  dotCompleted: {
    backgroundColor: theme.colors.primary,
  },
  dotCurrent: {
    backgroundColor: theme.colors.white,
    borderWidth: 2.5,
    borderColor: theme.colors.primary,
  },
  dotFuture: {
    backgroundColor: theme.colors.borderStrong,
  },
  line: {
    flex: 1,
    height: 2,
    marginLeft: -1,
  },
  label: {
    fontWeight: '600',
    fontSize: 10,
    lineHeight: 13,
  },
});
