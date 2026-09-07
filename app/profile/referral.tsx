import { router } from 'expo-router';
import { Alert, Share, StyleSheet, View } from 'react-native';

import {
  GBadge,
  GButton,
  GEmptyState,
  GErrorState,
  GIcon,
  GSkeleton,
  GStatCard,
  GText,
  theme,
} from '@/src/design-system';
import {
  ProfileHeroCard,
  ProfileScreenShell,
  PROFILE_BG,
} from '@/src/features/profile/ProfileScreenShell';
import { useReferral } from '@/src/hooks';
import { formatRelativeTime } from '@/src/utils/date';
import { getErrorMessage } from '@/src/utils/errors';
import { formatPaise } from '@/src/utils/money';

export default function ReferralScreen() {
  const { referral, history, isLoading, error, refetch, isFetching } =
    useReferral();

  if (isLoading && !referral) {
    return (
      <ProfileScreenShell
        title="Refer & earn"
        subtitle="Invite partners to GUNUCO"
        onBack={() => router.back()}
      >
        <GSkeleton height={140} borderRadius={theme.radius.xl} />
        <GSkeleton height={88} borderRadius={theme.radius.xl} />
      </ProfileScreenShell>
    );
  }

  if (error && !referral) {
    return (
      <View style={styles.fallback}>
        <ProfileScreenShell title="Refer & earn" onBack={() => router.back()}>
          <GErrorState
            title="Couldn’t load referral"
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
      title="Refer & earn"
      subtitle="Invite partners to GUNUCO"
      onBack={() => router.back()}
      refreshing={isFetching && !isLoading}
      onRefresh={() => {
        void refetch();
      }}
    >
      <ProfileHeroCard
        tone="primary"
        icon="genderOther"
        eyebrow="Your code"
        title={referral?.code ?? '—'}
        body="Friends join with this code. You earn when they complete onboarding deliveries."
      >
        <GButton
          title="Share code"
          fullWidth
          variant="secondary"
          onPress={() => {
            void (async () => {
              try {
                await Share.share({
                  message: `Join GUNUCO Delivery Partner with my code ${referral?.code ?? ''}. Deliver celebration cakes across Hyderabad!`,
                });
              } catch (err) {
                Alert.alert('Share failed', getErrorMessage(err));
              }
            })();
          }}
        />
      </ProfileHeroCard>

      <View style={styles.stats}>
        <GStatCard
          label="Invited"
          value={String(referral?.invitedCount ?? 0)}
          icon={
            <View style={styles.statIcon}>
              <GIcon name="genderOther" size={16} color={theme.colors.primary} />
            </View>
          }
        />
        <GStatCard
          label="Rewarded"
          value={String(referral?.rewardedCount ?? 0)}
          icon={
            <View style={styles.statIcon}>
              <GIcon name="gift" size={16} color={theme.colors.primary} />
            </View>
          }
        />
      </View>
      <GStatCard
        label="Total earned"
        value={formatPaise(referral?.totalRewardPaise ?? 0)}
        icon={
          <View style={styles.statIcon}>
            <GIcon name="money" size={16} color={theme.colors.primary} />
          </View>
        }
      />

      <GText variant="bodyBold" style={styles.section}>
        History
      </GText>

      {history.length === 0 ? (
        <GEmptyState
          title="No referrals yet"
          description="Share your code with riders who want to deliver with GUNUCO."
        />
      ) : (
        history.map((entry) => (
          <View key={entry.id} style={styles.historyRow}>
            <View style={styles.statIcon}>
              <GIcon name="profile" size={18} color={theme.colors.primary} />
            </View>
            <View style={styles.historyCopy}>
              <GText variant="bodyBold">{entry.inviteeName}</GText>
              <GText variant="caption" color={theme.colors.textSecondary}>
                {formatRelativeTime(entry.createdAt)}
              </GText>
            </View>
            <View style={styles.historyRight}>
              <GBadge
                label={entry.status}
                tone={
                  entry.status === 'REWARDED'
                    ? 'success'
                    : entry.status === 'JOINED'
                      ? 'info'
                      : 'warning'
                }
              />
              {typeof entry.rewardPaise === 'number' ? (
                <GText variant="caption" color={theme.colors.success}>
                  {formatPaise(entry.rewardPaise)}
                </GText>
              ) : null}
            </View>
          </View>
        ))
      )}
    </ProfileScreenShell>
  );
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    backgroundColor: PROFILE_BG,
  },
  stats: {
    flexDirection: 'row',
    gap: theme.spacing[3],
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginTop: theme.spacing[1],
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing[3],
    ...theme.shadows.sm,
  },
  historyCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  historyRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
});
