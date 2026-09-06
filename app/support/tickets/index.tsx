import { router } from 'expo-router';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import {
  GBadge,
  GButton,
  GEmptyState,
  GErrorState,
  GHeader,
  GListRow,
  GSkeleton,
  theme,
} from '@/src/design-system';
import { useSupport } from '@/src/hooks';
import { formatRelativeTime } from '@/src/utils/date';
import { getErrorMessage } from '@/src/utils/errors';
import { ticketStatusTone } from '@/src/utils/labels';

export default function SupportTicketsScreen() {
  const { tickets, isLoading, error, refetch, isFetching } = useSupport();

  if (isLoading && tickets.length === 0) {
    return (
      <View style={styles.screen}>
        <GHeader title="Tickets" showBack onBack={() => router.back()} />
        <View style={styles.pad}>
          <GSkeleton height={64} borderRadius={theme.radius.md} />
          <GSkeleton height={64} borderRadius={theme.radius.md} />
        </View>
      </View>
    );
  }

  if (error && tickets.length === 0) {
    return (
      <View style={styles.screen}>
        <GHeader title="Tickets" showBack onBack={() => router.back()} />
        <GErrorState
          title="Couldn’t load tickets"
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
        title="My tickets"
        subtitle="Track support conversations"
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
        <View style={styles.actions}>
          <GButton
            title="New ticket"
            fullWidth
            onPress={() => router.push('/support/tickets/new')}
          />
        </View>

        {tickets.length === 0 ? (
          <GEmptyState
            title="No tickets yet"
            description="If something goes wrong on a delivery, raise a ticket and we’ll help."
            actionLabel="Create ticket"
            onAction={() => router.push('/support/tickets/new')}
          />
        ) : (
          tickets.map((ticket) => (
            <GListRow
              key={ticket.id}
              title={ticket.subject}
              subtitle={`${formatRelativeTime(ticket.updatedAt)} · ${ticket.category.replace(/_/g, ' ')}`}
              right={
                <GBadge
                  label={ticket.status.replace(/_/g, ' ')}
                  tone={ticketStatusTone(ticket.status)}
                />
              }
              showChevron
              onPress={() => router.push(`/support/tickets/${ticket.id}`)}
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
    flexGrow: 1,
  },
  actions: {
    padding: theme.spacing[4],
  },
});
