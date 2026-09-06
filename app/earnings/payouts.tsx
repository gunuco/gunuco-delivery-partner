import { router } from 'expo-router';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import {
  GBadge,
  GEmptyState,
  GErrorState,
  GHeader,
  GListRow,
  GSkeleton,
  GText,
  theme,
} from '@/src/design-system';
import { useEarnings } from '@/src/hooks';
import { formatDateTime } from '@/src/utils/date';
import { getErrorMessage } from '@/src/utils/errors';
import { payoutStatusTone } from '@/src/utils/labels';
import { formatPaise } from '@/src/utils/money';

export default function EarningsPayoutsScreen() {
  const { payouts, isLoading, error, refetch, isFetching } = useEarnings();

  if (isLoading && payouts.length === 0) {
    return (
      <View style={styles.screen}>
        <GHeader title="Payouts" showBack onBack={() => router.back()} />
        <View style={styles.pad}>
          <GSkeleton height={64} borderRadius={theme.radius.md} />
          <GSkeleton height={64} borderRadius={theme.radius.md} />
          <GSkeleton height={64} borderRadius={theme.radius.md} />
        </View>
      </View>
    );
  }

  if (error && payouts.length === 0) {
    return (
      <View style={styles.screen}>
        <GHeader title="Payouts" showBack onBack={() => router.back()} />
        <GErrorState
          title="Couldn’t load payouts"
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
        title="Payout history"
        subtitle="Weekly bank credits"
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
        {payouts.length === 0 ? (
          <GEmptyState
            title="No payouts yet"
            description="When your weekly settlement runs, credits will appear here."
          />
        ) : (
          payouts.map((payout) => (
            <GListRow
              key={payout.id}
              title={formatPaise(payout.amountPaise)}
              subtitle={`${payout.method ?? 'Bank transfer'} · Scheduled ${formatDateTime(payout.scheduledAt)}${
                payout.paidAt ? ` · Paid ${formatDateTime(payout.paidAt)}` : ''
              }`}
              right={
                <GBadge
                  label={payout.status.replace(/_/g, ' ')}
                  tone={payoutStatusTone(payout.status)}
                />
              }
            />
          ))
        )}
        <View style={styles.footer}>
          <GText variant="caption" color={theme.colors.textMuted} center>
            Payouts usually settle within 24–48 hours after Monday initiation.
          </GText>
        </View>
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
    flexGrow: 1,
  },
  footer: {
    padding: theme.spacing[5],
  },
});
