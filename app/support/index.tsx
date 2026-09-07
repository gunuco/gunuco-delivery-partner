import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  GEmptyState,
  GErrorState,
  GIcon,
  GSkeleton,
  GText,
  theme,
  type IconName,
} from '@/src/design-system';
import {
  ProfileHeroCard,
  ProfileScreenShell,
  PROFILE_BG,
} from '@/src/features/profile/ProfileScreenShell';
import { useSupport } from '@/src/hooks';
import { getErrorMessage } from '@/src/utils/errors';

function LinkRow({
  title,
  subtitle,
  icon,
  iconColor = theme.colors.primary,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: IconName;
  iconColor?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [styles.linkRow, pressed && styles.pressed]}
    >
      <View
        style={[
          styles.iconCircle,
          iconColor === theme.colors.danger ? styles.dangerIcon : null,
        ]}
      >
        <GIcon name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.linkCopy}>
        <GText variant="bodyBold">{title}</GText>
        <GText variant="caption" color={theme.colors.textSecondary}>
          {subtitle}
        </GText>
      </View>
      <GIcon name="chevronRight" size={18} color={theme.colors.textMuted} />
    </Pressable>
  );
}

export default function SupportIndexScreen() {
  const { helpTopics, tickets, isLoading, error, refetch, isFetching } =
    useSupport();

  if (isLoading && helpTopics.length === 0) {
    return (
      <ProfileScreenShell
        title="Help & support"
        subtitle="We’re here for every delivery"
        onBack={() => router.back()}
      >
        <GSkeleton height={96} borderRadius={theme.radius.xl} />
        <GSkeleton height={72} borderRadius={theme.radius.xl} />
        <GSkeleton height={72} borderRadius={theme.radius.xl} />
      </ProfileScreenShell>
    );
  }

  if (error && helpTopics.length === 0) {
    return (
      <View style={styles.fallback}>
        <ProfileScreenShell title="Help & support" onBack={() => router.back()}>
          <GErrorState
            title="Couldn’t load support"
            description={getErrorMessage(error)}
            onRetry={() => {
              void refetch();
            }}
          />
        </ProfileScreenShell>
      </View>
    );
  }

  const openTickets = tickets.filter(
    (t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS',
  );

  return (
    <ProfileScreenShell
      title="Help & support"
      subtitle="We’re here for every delivery"
      onBack={() => router.back()}
      refreshing={isFetching && !isLoading}
      onRefresh={() => {
        void refetch();
      }}
    >
      <ProfileHeroCard
        tone="primary"
        icon="support"
        eyebrow="GUNUCO Care"
        title="Need a hand?"
        body="FAQs, tickets, and emergency help for cake deliveries across Hyderabad."
      />

      <GText variant="bodyBold" style={styles.section}>
        Quick links
      </GText>

      <LinkRow
        title="FAQs"
        subtitle="Cake handling, OTP, payouts"
        icon="help"
        onPress={() => router.push('/support/faq')}
      />
      <LinkRow
        title="My tickets"
        subtitle={
          openTickets.length > 0
            ? `${openTickets.length} open`
            : 'View past conversations'
        }
        icon="chat"
        onPress={() => router.push('/support/tickets')}
      />
      <LinkRow
        title="New ticket"
        subtitle="Report an issue with an order or payout"
        icon="plus"
        onPress={() => router.push('/support/tickets/new')}
      />
      <LinkRow
        title="Emergency"
        subtitle="Safety first — call for help"
        icon="emergency"
        iconColor={theme.colors.danger}
        onPress={() => router.push('/emergency')}
      />

      <GText variant="bodyBold" style={styles.section}>
        Help topics
      </GText>

      {helpTopics.length === 0 ? (
        <GEmptyState
          title="No topics yet"
          description="Support topics will appear here when available."
        />
      ) : (
        helpTopics.map((topic) => (
          <LinkRow
            key={topic.id}
            title={topic.title}
            subtitle={topic.description}
            icon="book"
            onPress={() => router.push('/support/faq')}
          />
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
  section: {
    marginTop: theme.spacing[1],
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[3],
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
  dangerIcon: {
    backgroundColor: theme.colors.dangerSoft,
  },
  linkCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  pressed: {
    opacity: 0.9,
  },
});
