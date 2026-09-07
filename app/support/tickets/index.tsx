import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  GBadge,
  GButton,
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
import { useSupport } from '@/src/hooks';
import { formatRelativeTime } from '@/src/utils/date';
import { getErrorMessage } from '@/src/utils/errors';
import { ticketStatusTone } from '@/src/utils/labels';

export default function SupportTicketsScreen() {
  const { tickets, isLoading, error, refetch, isFetching } = useSupport();

  if (isLoading && tickets.length === 0) {
    return (
      <ProfileScreenShell
        title="My tickets"
        subtitle="Track support conversations"
        onBack={() => router.back()}
      >
        <GSkeleton height={96} borderRadius={theme.radius.xl} />
        <GSkeleton height={72} borderRadius={theme.radius.xl} />
      </ProfileScreenShell>
    );
  }

  if (error && tickets.length === 0) {
    return (
      <View style={styles.fallback}>
        <ProfileScreenShell title="My tickets" onBack={() => router.back()}>
          <GErrorState
            title="Couldn’t load tickets"
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
      title="My tickets"
      subtitle="Track support conversations"
      onBack={() => router.back()}
      refreshing={isFetching && !isLoading}
      onRefresh={() => {
        void refetch();
      }}
    >
      <ProfileHeroCard
        icon="chat"
        eyebrow="Support inbox"
        title="Your conversations"
        body="Raise an issue anytime — we help with orders, payouts, and account questions."
      >
        <GButton
          title="New ticket"
          fullWidth
          onPress={() => router.push('/support/tickets/new')}
        />
      </ProfileHeroCard>

      {tickets.length === 0 ? (
        <GEmptyState
          title="No tickets yet"
          description="If something goes wrong on a delivery, raise a ticket and we’ll help."
          actionLabel="Create ticket"
          onAction={() => router.push('/support/tickets/new')}
        />
      ) : (
        tickets.map((ticket) => (
          <Pressable
            key={ticket.id}
            accessibilityRole="button"
            accessibilityLabel={ticket.subject}
            onPress={() => router.push(`/support/tickets/${ticket.id}`)}
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
          >
            <View style={styles.iconCircle}>
              <GIcon name="chat" size={18} color={theme.colors.primary} />
            </View>
            <View style={styles.copy}>
              <GText variant="bodyBold" numberOfLines={1}>
                {ticket.subject}
              </GText>
              <GText variant="caption" color={theme.colors.textSecondary}>
                {formatRelativeTime(ticket.updatedAt)} ·{' '}
                {ticket.category.replace(/_/g, ' ')}
              </GText>
            </View>
            <GBadge
              label={ticket.status.replace(/_/g, ' ')}
              tone={ticketStatusTone(ticket.status)}
            />
            <GIcon name="chevronRight" size={18} color={theme.colors.textMuted} />
          </Pressable>
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
  pressed: {
    opacity: 0.9,
  },
});
