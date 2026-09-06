import { router } from 'expo-router';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import {
  GEmptyState,
  GErrorState,
  GHeader,
  GIcon,
  GListRow,
  GSectionHeader,
  GSkeleton,
  theme,
} from '@/src/design-system';
import { useSupport } from '@/src/hooks';
import { getErrorMessage } from '@/src/utils/errors';

export default function SupportIndexScreen() {
  const { helpTopics, tickets, isLoading, error, refetch, isFetching } =
    useSupport();

  if (isLoading && helpTopics.length === 0) {
    return (
      <View style={styles.screen}>
        <GHeader title="Support" showBack onBack={() => router.back()} />
        <View style={styles.pad}>
          <GSkeleton height={56} borderRadius={theme.radius.md} />
          <GSkeleton height={56} borderRadius={theme.radius.md} />
          <GSkeleton height={56} borderRadius={theme.radius.md} />
        </View>
      </View>
    );
  }

  if (error && helpTopics.length === 0) {
    return (
      <View style={styles.screen}>
        <GHeader title="Support" showBack onBack={() => router.back()} />
        <GErrorState
          title="Couldn’t load support"
          description={getErrorMessage(error)}
          onRetry={() => {
            void refetch();
          }}
        />
      </View>
    );
  }

  const openTickets = tickets.filter(
    (t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS',
  );

  return (
    <View style={styles.screen}>
      <GHeader
        title="Help & support"
        subtitle="We’re here for every delivery"
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
        <GSectionHeader title="Quick links" />
        <GListRow
          title="FAQs"
          subtitle="Cake handling, OTP, payouts"
          left={<GIcon name="help" size={22} color={theme.colors.primary} />}
          showChevron
          onPress={() => router.push('/support/faq')}
        />
        <GListRow
          title="My tickets"
          subtitle={
            openTickets.length > 0
              ? `${openTickets.length} open`
              : 'View past conversations'
          }
          left={<GIcon name="chat" size={22} color={theme.colors.primary} />}
          showChevron
          onPress={() => router.push('/support/tickets')}
        />
        <GListRow
          title="New ticket"
          subtitle="Report an issue with an order or payout"
          left={<GIcon name="plus" size={22} color={theme.colors.primary} />}
          showChevron
          onPress={() => router.push('/support/tickets/new')}
        />
        <GListRow
          title="Emergency"
          subtitle="Safety first — call for help"
          left={<GIcon name="emergency" size={22} color={theme.colors.danger} />}
          showChevron
          onPress={() => router.push('/emergency')}
        />

        <GSectionHeader title="Help topics" />
        {helpTopics.length === 0 ? (
          <GEmptyState
            title="No topics yet"
            description="Support topics will appear here when available."
          />
        ) : (
          helpTopics.map((topic) => (
            <GListRow
              key={topic.id}
              title={topic.title}
              subtitle={topic.description}
              showChevron
              onPress={() => router.push('/support/faq')}
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
    paddingBottom: theme.spacing[8],
  },
});
