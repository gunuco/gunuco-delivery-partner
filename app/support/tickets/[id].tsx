import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import {
  GBadge,
  GButton,
  GCard,
  GEmptyState,
  GErrorState,
  GHeader,
  GInput,
  GSkeleton,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import { useSupport, useSupportTicket } from '@/src/hooks';
import { formatDateTime } from '@/src/utils/date';
import { getErrorMessage } from '@/src/utils/errors';
import { TICKET_CATEGORY_LABELS, ticketStatusTone } from '@/src/utils/labels';

export default function SupportTicketDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const ticketId = Array.isArray(id) ? id[0] : id;
  const { ticket, isLoading, error, refetch } = useSupportTicket(ticketId);
  const { sendMessage, sendState } = useSupport();
  const { showToast } = useToast();
  const [body, setBody] = useState('');

  if (isLoading && !ticket) {
    return (
      <View style={styles.screen}>
        <GHeader title="Ticket" showBack onBack={() => router.back()} />
        <View style={styles.pad}>
          <GSkeleton height={120} borderRadius={theme.radius.lg} />
          <GSkeleton height={80} borderRadius={theme.radius.md} />
        </View>
      </View>
    );
  }

  if (error && !ticket) {
    return (
      <View style={styles.screen}>
        <GHeader title="Ticket" showBack onBack={() => router.back()} />
        <GErrorState
          title="Couldn’t load ticket"
          description={getErrorMessage(error)}
          onRetry={() => {
            void refetch();
          }}
        />
      </View>
    );
  }

  if (!ticket) {
    return (
      <View style={styles.screen}>
        <GHeader title="Ticket" showBack onBack={() => router.back()} />
        <GEmptyState
          title="Ticket not found"
          actionLabel="Back to tickets"
          onAction={() => router.replace('/support/tickets')}
        />
      </View>
    );
  }

  const messages = ticket.messages ?? [];

  return (
    <View style={styles.screen}>
      <GHeader
        title={ticket.subject}
        subtitle={TICKET_CATEGORY_LABELS[ticket.category]}
        showBack
        onBack={() => router.back()}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => {
                void refetch();
              }}
              tintColor={theme.colors.primary}
            />
          }
        >
          <View style={styles.statusRow}>
            <GBadge
              label={ticket.status.replace(/_/g, ' ')}
              tone={ticketStatusTone(ticket.status)}
            />
            <GText variant="caption" color={theme.colors.textMuted}>
              Updated {formatDateTime(ticket.updatedAt)}
            </GText>
          </View>

          <GCard padding="md" style={styles.card}>
            <GText variant="label" color={theme.colors.textMuted}>
              Description
            </GText>
            <GText variant="body">{ticket.description}</GText>
            {ticket.orderId ? (
              <GText variant="caption" color={theme.colors.textSecondary}>
                Order: {ticket.orderId}
              </GText>
            ) : null}
          </GCard>

          <GText variant="title">Conversation</GText>
          {messages.length === 0 ? (
            <GText variant="body" color={theme.colors.textSecondary}>
              No messages yet. Add an update below.
            </GText>
          ) : (
            messages.map((message) => (
              <GCard
                key={message.id}
                padding="md"
                style={[
                  styles.message,
                  message.sender === 'PARTNER'
                    ? styles.partnerMsg
                    : styles.supportMsg,
                ]}
              >
                <GText variant="label" color={theme.colors.textMuted}>
                  {message.sender === 'PARTNER' ? 'You' : 'GUNUCO Support'} ·{' '}
                  {formatDateTime(message.createdAt)}
                </GText>
                <GText variant="body">{message.body}</GText>
              </GCard>
            ))
          )}

          {ticket.status !== 'CLOSED' && ticket.status !== 'RESOLVED' ? (
            <View style={styles.composer}>
              <GInput
                label="Reply"
                value={body}
                onChangeText={setBody}
                placeholder="Share an update for support"
                multiline
                numberOfLines={3}
                style={styles.multiline}
              />
              <GButton
                title="Send message"
                fullWidth
                loading={sendState.isLoading}
                disabled={body.trim().length < 2}
                onPress={() => {
                  void (async () => {
                    try {
                      await sendMessage(ticket.id, body.trim());
                      setBody('');
                      showToast({ type: 'success', message: 'Message sent.' });
                      void refetch();
                    } catch (err) {
                      Alert.alert('Couldn’t send', getErrorMessage(err));
                    }
                  })();
                }}
              />
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  flex: {
    flex: 1,
  },
  pad: {
    padding: theme.spacing[4],
    gap: theme.spacing[3],
  },
  content: {
    padding: theme.spacing[4],
    gap: theme.spacing[3],
    paddingBottom: theme.spacing[10],
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing[3],
  },
  card: {
    gap: theme.spacing[2],
  },
  message: {
    gap: theme.spacing[1],
  },
  partnerMsg: {
    borderColor: theme.colors.primaryLight,
  },
  supportMsg: {
    backgroundColor: theme.colors.surfaceMuted,
  },
  composer: {
    gap: theme.spacing[3],
    marginTop: theme.spacing[2],
  },
  multiline: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
});
