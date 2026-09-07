import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import {
  GBadge,
  GEmptyState,
  GErrorState,
  GIcon,
  GSkeleton,
  GText,
  theme,
} from '@/src/design-system';
import {
  ProfileHeroCard,
  ProfileScreenShell,
  PROFILE_BG,
} from '@/src/features/profile/ProfileScreenShell';
import { useEarnings } from '@/src/hooks';
import { formatDateTime } from '@/src/utils/date';
import { getErrorMessage } from '@/src/utils/errors';
import { payoutStatusTone } from '@/src/utils/labels';
import { formatPaise } from '@/src/utils/money';

export default function EarningsPayoutsScreen() {
  const { payouts, isLoading, error, refetch, isFetching } = useEarnings();

  if (isLoading && payouts.length === 0) {
    return (
      <ProfileScreenShell
        title="Payout history"
        subtitle="Weekly bank credits"
        onBack={() => router.back()}
      >
        <GSkeleton height={96} borderRadius={theme.radius.xl} />
        <GSkeleton height={88} borderRadius={theme.radius.xl} />
        <GSkeleton height={88} borderRadius={theme.radius.xl} />
      </ProfileScreenShell>
    );
  }

  if (error && payouts.length === 0) {
    return (
      <View style={styles.fallback}>
        <ProfileScreenShell title="Payout history" onBack={() => router.back()}>
          <GErrorState
            title="Couldn’t load payouts"
            description={getErrorMessage(error)}
            onRetry={() => {
              void refetch();
            }}
          />
        </ProfileScreenShell>
      </View>
    );
  }

  return (
    <ProfileScreenShell
      title="Payout history"
      subtitle="Weekly bank credits"
      onBack={() => router.back()}
      refreshing={isFetching && !isLoading}
      onRefresh={() => {
        void refetch();
      }}
    >
      <ProfileHeroCard
        tone="primary"
        icon="bank"
        eyebrow="Settlements"
        title="Bank credits"
        body="Weekly payouts settle to your registered account after Monday initiation."
      />

      {payouts.length === 0 ? (
        <GEmptyState
          title="No payouts yet"
          description="When your weekly settlement runs, credits will appear here."
        />
      ) : (
        payouts.map((payout) => (
          <View key={payout.id} style={styles.card}>
            <View style={styles.iconCircle}>
              <GIcon name="money" size={18} color={theme.colors.primary} />
            </View>
            <View style={styles.copy}>
              <GText variant="bodyBold">{formatPaise(payout.amountPaise)}</GText>
              <GText variant="caption" color={theme.colors.textSecondary}>
                {payout.method ?? 'Bank transfer'} · Scheduled{' '}
                {formatDateTime(payout.scheduledAt)}
              </GText>
              {payout.paidAt ? (
                <GText variant="caption" color={theme.colors.textMuted}>
                  Paid {formatDateTime(payout.paidAt)}
                </GText>
              ) : null}
            </View>
            <GBadge
              label={payout.status.replace(/_/g, ' ')}
              tone={payoutStatusTone(payout.status)}
            />
          </View>
        ))
      )}

      <GText variant="caption" color={theme.colors.textMuted} center style={styles.footer}>
        Payouts usually settle within 24–48 hours after Monday initiation.
      </GText>
    </ProfileScreenShell>
  );
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    backgroundColor: PROFILE_BG,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing[3],
    ...theme.shadows.sm,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  footer: {
    paddingTop: theme.spacing[2],
    paddingHorizontal: theme.spacing[2],
  },
});
