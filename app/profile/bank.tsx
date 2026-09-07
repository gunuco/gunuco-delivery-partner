import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import {
  GBadge,
  GButton,
  GErrorState,
  GSkeleton,
  theme,
} from '@/src/design-system';
import {
  ProfileDetailRow,
  ProfileHeroCard,
  ProfileScreenShell,
  PROFILE_BG,
} from '@/src/features/profile/ProfileScreenShell';
import { useEarnings, usePartner } from '@/src/hooks';
import { formatDateTime } from '@/src/utils/date';
import { getErrorMessage } from '@/src/utils/errors';
import { payoutStatusTone } from '@/src/utils/labels';
import { formatPaise } from '@/src/utils/money';

export default function BankProfileScreen() {
  const {
    partner,
    isLoading: partnerLoading,
    error: partnerError,
    refetch: refetchPartner,
  } = usePartner();
  const { payouts, isLoading, error, refetch, isFetching } = useEarnings();

  const latest = payouts[0];
  const loading = partnerLoading || isLoading;
  const verified = partner?.status === 'APPROVED';

  if (loading && !partner && payouts.length === 0) {
    return (
      <ProfileScreenShell
        title="Bank account"
        subtitle="Payout destination"
        onBack={() => router.back()}
      >
        <GSkeleton height={120} borderRadius={theme.radius.xl} />
        <GSkeleton height={72} borderRadius={theme.radius.xl} />
      </ProfileScreenShell>
    );
  }

  if ((partnerError || error) && !partner) {
    return (
      <View style={styles.fallback}>
        <ProfileScreenShell title="Bank account" onBack={() => router.back()}>
          <GErrorState
            title="Couldn’t load bank details"
            description={getErrorMessage(partnerError ?? error)}
            onRetry={() => {
              void Promise.all([refetchPartner(), refetch()]);
            }}
          />
        </ProfileScreenShell>
      </View>
    );
  }

  return (
    <ProfileScreenShell
      title="Bank account"
      subtitle="Payout destination"
      onBack={() => router.back()}
      refreshing={isFetching && !isLoading}
      onRefresh={() => {
        void Promise.all([refetchPartner(), refetch()]);
      }}
    >
      <ProfileHeroCard
        tone="primary"
        icon="money"
        eyebrow="Account holder"
        title={partner?.name ?? '—'}
        body="Full account numbers are masked for security. Contact support to change your payout bank."
        right={
          <GBadge
            label={verified ? 'Verified' : 'Under review'}
            tone={verified ? 'success' : 'warning'}
          />
        }
      />

      <ProfileDetailRow
        icon="idCard"
        label="Partner ID"
        value={partner?.partnerCode ?? '—'}
      />
      <ProfileDetailRow
        icon="bank"
        label="Latest payout method"
        value={latest?.method ?? 'Bank transfer'}
      />
      {latest ? (
        <ProfileDetailRow
          icon="calendar"
          label="Latest payout"
          value={`${formatPaise(latest.amountPaise)} · ${formatDateTime(latest.scheduledAt)}`}
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
    </ProfileScreenShell>
  );
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    backgroundColor: PROFILE_BG,
  },
  actions: {
    gap: theme.spacing[3],
    marginTop: theme.spacing[1],
  },
});
