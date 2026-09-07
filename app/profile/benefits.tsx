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
import { useBenefits } from '@/src/hooks';
import { formatDate } from '@/src/utils/date';
import { getErrorMessage } from '@/src/utils/errors';

export default function BenefitsScreen() {
  const { benefits, isLoading, error, refetch, isFetching } = useBenefits();

  if (isLoading && benefits.length === 0) {
    return (
      <ProfileScreenShell
        title="Benefits"
        subtitle="Perks for active riders"
        onBack={() => router.back()}
      >
        <GSkeleton height={100} borderRadius={theme.radius.xl} />
        <GSkeleton height={100} borderRadius={theme.radius.xl} />
      </ProfileScreenShell>
    );
  }

  if (error && benefits.length === 0) {
    return (
      <View style={styles.fallback}>
        <ProfileScreenShell title="Benefits" onBack={() => router.back()}>
          <GErrorState
            title="Couldn’t load benefits"
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
      title="Partner benefits"
      subtitle="Perks for active riders"
      onBack={() => router.back()}
      refreshing={isFetching && !isLoading}
      onRefresh={() => {
        void refetch();
      }}
    >
      <ProfileHeroCard
        tone="primary"
        icon="gift"
        eyebrow="Rewards"
        title="More deliveries More rewards!"
        body="Stay online and complete cake deliveries to unlock partner perks."
      />

      {benefits.length === 0 ? (
        <GEmptyState
          title="No benefits yet"
          description="Stay online and complete deliveries to unlock partner perks."
        />
      ) : (
        benefits.map((benefit) => (
          <View key={benefit.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.iconCircle}>
                <GIcon name="star" size={18} color={theme.colors.primary} />
              </View>
              <View style={styles.cardCopy}>
                <GText variant="bodyBold">{benefit.title}</GText>
                <GText variant="body" color={theme.colors.textSecondary}>
                  {benefit.description}
                </GText>
                <GText variant="caption" color={theme.colors.textMuted}>
                  {benefit.provider ? `${benefit.provider} · ` : ''}
                  {benefit.validUntil
                    ? `Valid till ${formatDate(benefit.validUntil)}`
                    : 'Validity not specified'}
                </GText>
              </View>
              <GBadge
                label={benefit.status}
                tone={benefit.status === 'ACTIVE' ? 'success' : 'neutral'}
              />
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
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing[3],
    ...theme.shadows.sm,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing[3],
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardCopy: {
    flex: 1,
    gap: theme.spacing[1],
    minWidth: 0,
  },
});
