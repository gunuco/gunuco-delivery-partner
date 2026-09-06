import { router } from 'expo-router';
import { useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import {
  GBadge,
  GCard,
  GEmptyState,
  GErrorState,
  GHeader,
  GSectionHeader,
  GSkeleton,
  GText,
  theme,
} from '@/src/design-system';
import { useDemand } from '@/src/hooks';
import type { DemandLevel, DemandZone } from '@/src/types';
import { getErrorMessage } from '@/src/utils/errors';
import { demandLevelTone } from '@/src/utils/labels';

const LEVEL_ORDER: DemandLevel[] = ['HIGH', 'NORMAL', 'LOW'];

function ZoneCard({ zone }: { zone: DemandZone }) {
  const heat =
    zone.level === 'HIGH' ? 0.85 : zone.level === 'NORMAL' ? 0.45 : 0.18;

  return (
    <GCard padding="md" style={styles.zoneCard}>
      <View style={styles.zoneTop}>
        <View style={styles.flex}>
          <GText variant="bodyBold">{zone.name}</GText>
          <GText variant="caption" color={theme.colors.textSecondary}>
            {zone.radiusKm ? `${zone.radiusKm.toFixed(1)} km zone` : 'Hyderabad zone'}
            {typeof zone.activeOrdersEstimate === 'number'
              ? ` · ~${zone.activeOrdersEstimate} active orders`
              : ''}
          </GText>
        </View>
        <GBadge label={zone.level} tone={demandLevelTone(zone.level)} />
      </View>
      <View style={styles.heatTrack}>
        <View
          style={[
            styles.heatFill,
            {
              width: `${Math.round(heat * 100)}%`,
              backgroundColor:
                zone.level === 'HIGH'
                  ? theme.colors.danger
                  : zone.level === 'NORMAL'
                    ? theme.colors.warning
                    : theme.colors.success,
            },
          ]}
        />
      </View>
      {typeof zone.surgeMultiplier === 'number' ? (
        <GText variant="caption" color={theme.colors.textMuted}>
          Surge ×{zone.surgeMultiplier.toFixed(2)}
        </GText>
      ) : null}
    </GCard>
  );
}

export default function DemandIndexScreen() {
  const { zones, nearby, isLoading, error, refetch, isFetching } = useDemand();

  const grouped = useMemo(() => {
    const source = zones.length > 0 ? zones : nearby;
    return LEVEL_ORDER.map((level) => ({
      level,
      zones: source.filter((z) => z.level === level),
    })).filter((g) => g.zones.length > 0);
  }, [zones, nearby]);

  if (isLoading && zones.length === 0 && nearby.length === 0) {
    return (
      <View style={styles.screen}>
        <GHeader title="Demand" showBack onBack={() => router.back()} />
        <View style={styles.pad}>
          <GSkeleton height={96} borderRadius={theme.radius.lg} />
          <GSkeleton height={96} borderRadius={theme.radius.lg} />
          <GSkeleton height={96} borderRadius={theme.radius.lg} />
        </View>
      </View>
    );
  }

  if (error && zones.length === 0 && nearby.length === 0) {
    return (
      <View style={styles.screen}>
        <GHeader title="Demand" showBack onBack={() => router.back()} />
        <GErrorState
          title="Couldn’t load demand"
          description={getErrorMessage(error)}
          onRetry={() => {
            void refetch();
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <GHeader
        title="Demand map"
        subtitle="Hyderabad zones · heatmap ready"
        showBack
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={() => {
              void refetch();
            }}
            tintColor={theme.colors.primary}
          />
        }
      >
        <GCard padding="md" style={styles.legend}>
          <GText variant="bodyBold">Where to go next</GText>
          <GText variant="caption" color={theme.colors.textSecondary}>
            HIGH zones usually mean more cake orders and better surge. Stay
            upright-ready and ride toward heat, not away from it.
          </GText>
          <View style={styles.legendRow}>
            <GBadge label="HIGH" tone="danger" />
            <GBadge label="NORMAL" tone="warning" />
            <GBadge label="LOW" tone="success" />
          </View>
        </GCard>

        {grouped.length === 0 ? (
          <GEmptyState
            title="No demand zones"
            description="Demand updates when you are online near a GUNUCO hub."
          />
        ) : (
          grouped.map((group) => (
            <View key={group.level} style={styles.group}>
              <GSectionHeader
                title={`${group.level} demand`}
                subtitle={`${group.zones.length} zone${group.zones.length === 1 ? '' : 's'}`}
              />
              {group.zones.map((zone) => (
                <ZoneCard key={zone.id} zone={zone} />
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  pad: {
    padding: theme.spacing[4],
    gap: theme.spacing[3],
  },
  content: {
    padding: theme.spacing[4],
    gap: theme.spacing[3],
    paddingBottom: theme.spacing[8],
  },
  legend: {
    gap: theme.spacing[2],
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
    marginTop: theme.spacing[1],
  },
  group: {
    gap: theme.spacing[2],
  },
  zoneCard: {
    gap: theme.spacing[2],
  },
  zoneTop: {
    flexDirection: 'row',
    gap: theme.spacing[3],
    alignItems: 'flex-start',
  },
  flex: {
    flex: 1,
  },
  heatTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.surfaceMuted,
    overflow: 'hidden',
  },
  heatFill: {
    height: 8,
    borderRadius: 4,
  },
});
