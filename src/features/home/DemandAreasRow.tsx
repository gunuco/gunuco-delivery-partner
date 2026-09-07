import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { GIcon, GText, theme } from '@/src/design-system';
import type { DemandLevel, DemandZone } from '@/src/types';

export type DemandAreasRowProps = {
  zones: DemandZone[];
  onViewMap?: () => void;
};

function demandLabel(level: DemandLevel): string {
  if (level === 'HIGH') return 'High Demand';
  if (level === 'NORMAL') return 'Normal';
  return 'Moderate';
}

function demandColors(level: DemandLevel): { bg: string; text: string; icon: string } {
  if (level === 'HIGH') {
    return {
      bg: theme.colors.dangerSoft,
      text: theme.colors.danger,
      icon: theme.colors.danger,
    };
  }
  if (level === 'NORMAL') {
    return {
      bg: theme.colors.successSoft,
      text: theme.colors.success,
      icon: theme.colors.success,
    };
  }
  return {
    bg: theme.colors.orangeSoft,
    text: theme.colors.warning,
    icon: theme.colors.warning,
  };
}

export function DemandAreasRow({ zones, onViewMap }: DemandAreasRowProps) {
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <GIcon name="chart" size={18} color={theme.colors.primary} />
          <GText variant="bodyBold">High demand areas</GText>
        </View>
        {onViewMap ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="View map"
            onPress={onViewMap}
            hitSlop={8}
          >
            <GText variant="caption" color={theme.colors.primary}>
              View map {'>'}
            </GText>
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {zones.map((zone) => {
          const colors = demandColors(zone.level);
          return (
            <View key={zone.id} style={styles.card}>
              <View style={styles.cardTop}>
                <GText variant="bodyBold" numberOfLines={1} style={styles.zoneName}>
                  {zone.name}
                </GText>
                <GIcon name="chart" size={16} color={colors.icon} />
              </View>
              <View style={[styles.badge, { backgroundColor: colors.bg }]}>
                <GText variant="label" color={colors.text}>
                  {demandLabel(zone.level)}
                </GText>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: theme.spacing[3],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  scroll: {
    gap: theme.spacing[3],
    paddingRight: theme.spacing[1],
  },
  card: {
    width: 148,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing[3],
    gap: theme.spacing[3],
    // ...theme.shadows.sm,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: theme.spacing[2],
  },
  zoneName: {
    flex: 1,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.radius.full,
  },
});
