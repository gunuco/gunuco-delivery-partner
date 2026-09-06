import { router, useLocalSearchParams } from 'expo-router';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import {
  GBadge,
  GCard,
  GEmptyState,
  GErrorState,
  GHeader,
  GListRow,
  GProgress,
  GSkeleton,
  GText,
  theme,
} from '@/src/design-system';
import { useIncentive } from '@/src/hooks';
import { formatDate, formatDateTime } from '@/src/utils/date';
import { getErrorMessage } from '@/src/utils/errors';
import { formatEnumLabel, incentiveStatusTone } from '@/src/utils/labels';
import { formatPaise } from '@/src/utils/money';

export default function IncentiveDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const incentiveId = Array.isArray(id) ? id[0] : id;
  const { incentive, isLoading, error, refetch } = useIncentive(incentiveId);

  if (isLoading && !incentive) {
    return (
      <View style={styles.screen}>
        <GHeader title="Incentive" showBack onBack={() => router.back()} />
        <View style={styles.pad}>
          <GSkeleton height={160} borderRadius={theme.radius.lg} />
          <GSkeleton height={56} borderRadius={theme.radius.md} />
        </View>
      </View>
    );
  }

  if (error && !incentive) {
    return (
      <View style={styles.screen}>
        <GHeader title="Incentive" showBack onBack={() => router.back()} />
        <GErrorState
          title="Couldn’t load incentive"
          description={getErrorMessage(error)}
          onRetry={() => {
            void refetch();
          }}
        />
      </View>
    );
  }

  if (!incentive) {
    return (
      <View style={styles.screen}>
        <GHeader title="Incentive" showBack onBack={() => router.back()} />
        <GEmptyState
          title="Incentive not found"
          description="This campaign may have ended or been removed."
          actionLabel="Back to incentives"
          onAction={() => router.replace('/incentives')}
        />
      </View>
    );
  }

  const progress =
    incentive.targetValue > 0
      ? Math.min(1, incentive.currentValue / incentive.targetValue)
      : 0;

  return (
    <View style={styles.screen}>
      <GHeader
        title="Incentive details"
        showBack
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              void refetch();
            }}
            tintColor={theme.colors.primary}
          />
        }
      >
        <GCard padding="lg" style={styles.hero}>
          <View style={styles.heroTop}>
            <GText variant="h2" style={styles.flex}>
              {incentive.title}
            </GText>
            <GBadge
              label={incentive.status}
              tone={incentiveStatusTone(incentive.status)}
            />
          </View>
          <GText variant="body" color={theme.colors.textSecondary}>
            {incentive.description}
          </GText>
          <GProgress progress={progress} height={10} />
          <View style={styles.meta}>
            <GText variant="caption" color={theme.colors.textSecondary}>
              {incentive.remainingLabel ??
                `${incentive.currentValue} of ${incentive.targetValue}`}
            </GText>
            <GText variant="h3">{formatPaise(incentive.rewardPaise)}</GText>
          </View>
        </GCard>

        <GListRow
          title="Target type"
          right={
            <GText variant="bodyBold">
              {formatEnumLabel(incentive.targetType)}
            </GText>
          }
        />
        <GListRow
          title="Progress"
          right={
            <GText variant="bodyBold">
              {incentive.currentValue} / {incentive.targetValue}
            </GText>
          }
        />
        <GListRow
          title="Reward"
          right={
            <GText variant="bodyBold">
              {formatPaise(incentive.rewardPaise)}
            </GText>
          }
        />
        <GListRow
          title="Valid from"
          right={<GText variant="body">{formatDateTime(incentive.validFrom)}</GText>}
        />
        <GListRow
          title="Valid till"
          right={<GText variant="body">{formatDate(incentive.validTo)}</GText>}
        />
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
    paddingBottom: theme.spacing[8],
  },
  hero: {
    margin: theme.spacing[4],
    gap: theme.spacing[3],
  },
  heroTop: {
    flexDirection: 'row',
    gap: theme.spacing[3],
    alignItems: 'flex-start',
  },
  flex: {
    flex: 1,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
