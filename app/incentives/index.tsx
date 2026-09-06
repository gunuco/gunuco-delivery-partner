import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import {
  GBadge,
  GCard,
  GChip,
  GEmptyState,
  GErrorState,
  GHeader,
  GProgress,
  GSectionHeader,
  GSkeleton,
  GText,
  theme,
} from '@/src/design-system';
import { useIncentives } from '@/src/hooks';
import type { Incentive } from '@/src/types';
import { formatDate } from '@/src/utils/date';
import { getErrorMessage } from '@/src/utils/errors';
import { incentiveStatusTone } from '@/src/utils/labels';
import { formatPaise } from '@/src/utils/money';

type Segment = 'active' | 'all';

function IncentiveCard({ incentive }: { incentive: Incentive }) {
  const progress =
    incentive.targetValue > 0
      ? Math.min(1, incentive.currentValue / incentive.targetValue)
      : 0;

  return (
    <GCard
      padding="md"
      onPress={() => router.push(`/incentives/${incentive.id}`)}
      style={styles.card}
    >
      <View style={styles.cardTop}>
        <View style={styles.cardText}>
          <GText variant="bodyBold" numberOfLines={2}>
            {incentive.title}
          </GText>
          <GText variant="caption" color={theme.colors.textSecondary} numberOfLines={2}>
            {incentive.description}
          </GText>
        </View>
        <GBadge
          label={incentive.status}
          tone={incentiveStatusTone(incentive.status)}
        />
      </View>
      <GProgress progress={progress} />
      <View style={styles.meta}>
        <GText variant="caption" color={theme.colors.textSecondary}>
          {incentive.remainingLabel ??
            `${incentive.currentValue}/${incentive.targetValue}`}
        </GText>
        <GText variant="bodyBold">{formatPaise(incentive.rewardPaise)}</GText>
      </View>
      <GText variant="caption" color={theme.colors.textMuted}>
        Valid till {formatDate(incentive.validTo)}
      </GText>
    </GCard>
  );
}

export default function IncentivesIndexScreen() {
  const { active, all, isLoading, error, refetch, isFetching } = useIncentives();
  const [segment, setSegment] = useState<Segment>('active');

  const list = useMemo(
    () => (segment === 'active' ? active : all),
    [active, all, segment],
  );

  if (isLoading && all.length === 0) {
    return (
      <View style={styles.screen}>
        <GHeader title="Incentives" showBack onBack={() => router.back()} />
        <View style={styles.pad}>
          <GSkeleton height={120} borderRadius={theme.radius.lg} />
          <GSkeleton height={120} borderRadius={theme.radius.lg} />
        </View>
      </View>
    );
  }

  if (error && all.length === 0) {
    return (
      <View style={styles.screen}>
        <GHeader title="Incentives" showBack onBack={() => router.back()} />
        <GErrorState
          title="Couldn’t load incentives"
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
        title="Incentives"
        subtitle="Hit targets, unlock bonuses"
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
          <GChip
            label={`Active (${active.length})`}
            selected={segment === 'active'}
            onPress={() => setSegment('active')}
          />
          <GChip
            label={`All (${all.length})`}
            selected={segment === 'all'}
            onPress={() => setSegment('all')}
          />
        </View>

        <GSectionHeader
          title={segment === 'active' ? 'Running now' : 'All incentives'}
          subtitle="Progress updates as you complete deliveries"
        />

        {list.length === 0 ? (
          <GEmptyState
            title={
              segment === 'active'
                ? 'No active incentives'
                : 'No incentives available'
            }
            description="Check back during peak hours and weekends for GUNUCO bonus campaigns."
          />
        ) : (
          list.map((incentive) => (
            <IncentiveCard key={incentive.id} incentive={incentive} />
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
  card: {
    gap: theme.spacing[2],
  },
  cardTop: {
    flexDirection: 'row',
    gap: theme.spacing[3],
    alignItems: 'flex-start',
  },
  cardText: {
    flex: 1,
    gap: 4,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
