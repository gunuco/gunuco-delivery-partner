import { router } from 'expo-router';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import {
  GBadge,
  GButton,
  GCard,
  GErrorState,
  GHeader,
  GListRow,
  GSkeleton,
  GText,
  theme,
} from '@/src/design-system';
import { useEarnings, usePartner } from '@/src/hooks';
import { formatDateTime } from '@/src/utils/date';
import { getErrorMessage } from '@/src/utils/errors';
import { payoutStatusTone } from '@/src/utils/labels';
import { formatPaise } from '@/src/utils/money';

export default function BankProfileScreen() {
  const { partner, isLoading: partnerLoading, error: partnerError, refetch: refetchPartner } =
    usePartner();
  const { payouts, isLoading, error, refetch, isFetching } = useEarnings();

  const latest = payouts[0];
  const loading = partnerLoading || isLoading;

  if (loading && !partner && payouts.length === 0) {
    return (
      <View style={styles.screen}>
        <GHeader title="Bank account" showBack onBack={() => router.back()} />
        <View style={styles.pad}>
          <GSkeleton height={120} borderRadius={theme.radius.lg} />
          <GSkeleton height={56} borderRadius={theme.radius.md} />
        </View>
      </View>
    );
  }

  if ((partnerError || error) && !partner) {
    return (
      <View style={styles.screen}>
        <GHeader title="Bank account" showBack onBack={() => router.back()} />
        <GErrorState
          title="Couldn’t load bank details"
          description={getErrorMessage(partnerError ?? error)}
          onRetry={() => {
            void Promise.all([refetchPartner(), refetch()]);
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <GHeader
        title="Bank account"
        subtitle="Payout destination"
        showBack
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={() => {
              void Promise.all([refetchPartner(), refetch()]);
            }}
            tintColor={theme.colors.primary}
          />
        }
      >
        <GCard padding="lg" style={styles.hero}>
          <GText variant="label" color={theme.colors.textSecondary}>
            Account holder
          </GText>
          <GText variant="h2">{partner?.name ?? '—'}</GText>
          <GBadge
            label={
              partner?.status === 'APPROVED' ? 'Verified for payouts' : 'Under review'
            }
            tone={partner?.status === 'APPROVED' ? 'success' : 'warning'}
          />
          <GText variant="caption" color={theme.colors.textMuted}>
            Full account numbers are masked for security. Contact support to
            change your payout bank.
          </GText>
        </GCard>

        <GListRow
          title="Partner ID"
          subtitle={partner?.partnerCode ?? '—'}
        />
        <GListRow
          title="Latest payout method"
          subtitle={latest?.method ?? 'Bank transfer'}
        />
        {latest ? (
          <GListRow
            title="Latest payout"
            subtitle={`${formatPaise(latest.amountPaise)} · ${formatDateTime(latest.scheduledAt)}`}
            right={
              <GBadge
                label={latest.status}
                tone={payoutStatusTone(latest.status)}
              />
            }
          />
        ) : null}

        <View style={styles.actions}>
          <GButton
            title="View payout history"
            fullWidth
            variant="outline"
            onPress={() => router.push('/earnings/payouts')}
          />
          <GButton
            title="Contact support to update"
            fullWidth
            onPress={() => router.push('/support/tickets/new')}
          />
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
  },
  hero: {
    margin: theme.spacing[4],
    gap: theme.spacing[2],
  },
  actions: {
    padding: theme.spacing[4],
    gap: theme.spacing[3],
  },
});
