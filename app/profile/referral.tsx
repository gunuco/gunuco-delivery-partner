import { router } from 'expo-router';
import { Alert, RefreshControl, ScrollView, Share, StyleSheet, View } from 'react-native';

import {
  GBadge,
  GButton,
  GCard,
  GEmptyState,
  GErrorState,
  GHeader,
  GListRow,
  GSkeleton,
  GStatCard,
  GText,
  theme,
} from '@/src/design-system';
import { useReferral } from '@/src/hooks';
import { formatRelativeTime } from '@/src/utils/date';
import { getErrorMessage } from '@/src/utils/errors';
import { formatPaise } from '@/src/utils/money';

export default function ReferralScreen() {
  const { referral, history, isLoading, error, refetch, isFetching } =
    useReferral();

  if (isLoading && !referral) {
    return (
      <View style={styles.screen}>
        <GHeader title="Refer & earn" showBack onBack={() => router.back()} />
        <View style={styles.pad}>
          <GSkeleton height={120} borderRadius={theme.radius.lg} />
          <GSkeleton height={88} borderRadius={theme.radius.lg} />
        </View>
      </View>
    );
  }

  if (error && !referral) {
    return (
      <View style={styles.screen}>
        <GHeader title="Refer & earn" showBack onBack={() => router.back()} />
        <GErrorState
          title="Couldn’t load referral"
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
        title="Refer & earn"
        subtitle="Invite partners to GUNUCO"
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
        <GCard padding="lg" style={styles.hero}>
          <GText variant="label" color={theme.colors.textSecondary}>
            Your code
          </GText>
          <GText variant="display">{referral?.code ?? '—'}</GText>
          <GText variant="caption" color={theme.colors.textMuted}>
            Friends join with this code. You earn when they complete onboarding
            deliveries.
          </GText>
          <GButton
            title="Share code"
            fullWidth
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
        </GCard>

        <View style={styles.row}>
          <GStatCard
            label="Invited"
            value={String(referral?.invitedCount ?? 0)}
          />
          <GStatCard
            label="Rewarded"
            value={String(referral?.rewardedCount ?? 0)}
          />
        </View>
        <GStatCard
          label="Total earned"
          value={formatPaise(referral?.totalRewardPaise ?? 0)}
        />

        <GText variant="title" style={styles.section}>
          History
        </GText>
        {history.length === 0 ? (
          <GEmptyState
            title="No referrals yet"
            description="Share your code with riders who want to deliver with GUNUCO."
          />
        ) : (
          history.map((entry) => (
            <GListRow
              key={entry.id}
              title={entry.inviteeName}
              subtitle={formatRelativeTime(entry.createdAt)}
              right={
                <View style={styles.right}>
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
                    <GText variant="caption">
                      {formatPaise(entry.rewardPaise)}
                    </GText>
                  ) : null}
                </View>
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
  hero: {
    gap: theme.spacing[2],
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing[3],
  },
  section: {
    marginTop: theme.spacing[2],
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
});
