import { router } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import {
  GChip,
  GEmptyState,
  GErrorState,
  GHeader,
  GListRow,
  GSectionHeader,
  GSkeleton,
  GStatCard,
  GText,
  theme,
} from '@/src/design-system';
import { usePerformance } from '@/src/hooks';
import type { PerformancePeriod } from '@/src/types';
import { formatDate } from '@/src/utils/date';
import { getErrorMessage } from '@/src/utils/errors';

const PERIODS: { key: PerformancePeriod; label: string }[] = [
  { key: 'TODAY', label: 'Today' },
  { key: 'WEEK', label: 'Week' },
  { key: 'MONTH', label: 'Month' },
  { key: 'ALL', label: 'All' },
];

function pct(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export default function PerformanceScreen() {
  const [period, setPeriod] = useState<PerformancePeriod>('WEEK');
  const { metrics, trend, isLoading, error, refetch, isFetching } =
    usePerformance(period);

  if (isLoading && !metrics) {
    return (
      <View style={styles.screen}>
        <GHeader title="Performance" showBack onBack={() => router.back()} />
        <View style={styles.pad}>
          <GSkeleton height={88} borderRadius={theme.radius.lg} />
          <View style={styles.row}>
            <GSkeleton height={88} style={styles.flex} borderRadius={theme.radius.lg} />
            <GSkeleton height={88} style={styles.flex} borderRadius={theme.radius.lg} />
          </View>
        </View>
      </View>
    );
  }

  if (error && !metrics) {
    return (
      <View style={styles.screen}>
        <GHeader title="Performance" showBack onBack={() => router.back()} />
        <GErrorState
          title="Couldn’t load performance"
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
        title="Performance"
        subtitle="Stay sharp for more orders"
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
        <View style={styles.chips}>
          {PERIODS.map((item) => (
            <GChip
              key={item.key}
              label={item.label}
              selected={period === item.key}
              onPress={() => setPeriod(item.key)}
            />
          ))}
        </View>

        <View style={styles.row}>
          <GStatCard
            label="Partner score"
            value={metrics ? metrics.partnerScore.toFixed(0) : '—'}
            subtitle="Out of 100"
          />
          <GStatCard
            label="Customer rating"
            value={metrics ? metrics.customerRating.toFixed(2) : '—'}
            subtitle="Average stars"
          />
        </View>
        <View style={styles.row}>
          <GStatCard
            label="Acceptance"
            value={metrics ? pct(metrics.acceptanceRate) : '—'}
          />
          <GStatCard
            label="Completion"
            value={metrics ? pct(metrics.completionRate) : '—'}
          />
        </View>
        <View style={styles.row}>
          <GStatCard
            label="On-time"
            value={metrics ? pct(metrics.onTimeRate) : '—'}
          />
          <GStatCard
            label="Completed"
            value={metrics ? String(metrics.ordersCompleted) : '—'}
            subtitle={
              metrics
                ? `${metrics.distanceTravelledKm.toFixed(1)} km`
                : undefined
            }
          />
        </View>

        <GSectionHeader
          title="Trend"
          subtitle="Daily score and deliveries"
        />
        {trend.length === 0 ? (
          <GEmptyState
            title="No trend data yet"
            description="Complete more deliveries to see your performance trend."
          />
        ) : (
          trend.map((point) => (
            <GListRow
              key={point.date}
              title={formatDate(point.date)}
              subtitle={`${point.ordersCompleted} deliveries`}
              right={
                <GText variant="bodyBold">Score {point.score.toFixed(0)}</GText>
              }
            />
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing[3],
  },
  flex: {
    flex: 1,
  },
});
