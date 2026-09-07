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
  GEmptyState,
  GErrorState,
  GInput,
  GSkeleton,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import {
  ProfileHeroCard,
  ProfileScreenShell,
  PROFILE_BG,
} from '@/src/features/profile/ProfileScreenShell';
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
      <ProfileScreenShell title="Ticket" onBack={() => router.back()}>
        <GSkeleton height={120} borderRadius={theme.radius.xl} />
        <GSkeleton height={80} borderRadius={theme.radius.xl} />
      </ProfileScreenShell>
    );
  }

  if (error && !ticket) {
    return (
      <View style={styles.fallback}>
        <ProfileScreenShell title="Ticket" onBack={() => router.back()}>
          <GErrorState
            title="Couldn’t load ticket"
            description={getErrorMessage(error)}
            onRetry={() => {
              void refetch();
            }}
          />
        </ProfileScreenShell>
      </View>
    );
  }

  if (!ticket) {
    return (
      <ProfileScreenShell title="Ticket" onBack={() => router.back()}>
        <GEmptyState
          title="Ticket not found"
          actionLabel="Back to tickets"
          onAction={() => router.replace('/support/tickets')}
        />
      </ProfileScreenShell>
    );
  }

  const messages = ticket.messages ?? [];

  return (
    <ProfileScreenShell
      title={ticket.subject}
      subtitle={TICKET_CATEGORY_LABELS[ticket.category]}
      onBack={() => router.back()}
      scroll={false}
      contentStyle={styles.bodyPad}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
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
          <ProfileHeroCard
            icon="chat"
            eyebrow="Ticket"
            title={ticket.subject}
            body={ticket.description}
            right={
              <GBadge
                label={ticket.status.replace(/_/g, ' ')}
                tone={ticketStatusTone(ticket.status)}
              />
            }
          >
            <GText variant="caption" color={theme.colors.textMuted}>
              Updated {formatDateTime(ticket.updatedAt)}
              {ticket.orderId ? ` · Order ${ticket.orderId}` : ''}
            </GText>
          </ProfileHeroCard>

          <GText variant="bodyBold">Conversation</GText>
          {messages.length === 0 ? (
            <View style={styles.emptyMsg}>
              <GText variant="body" color={theme.colors.textSecondary}>
                No messages yet. Add an update below.
              </GText>
            </View>
          ) : (
            messages.map((message) => {
              const mine = message.sender === 'PARTNER';
              return (
                <View
                  key={message.id}
                  style={[
                    styles.message,
                    mine ? styles.partnerMsg : styles.supportMsg,
                  ]}
                >
                  <GText variant="label" color={theme.colors.textMuted}>
                    {mine ? 'You' : 'GUNUCO Support'} ·{' '}
                    {formatDateTime(message.createdAt)}
                  </GText>
                  <GText variant="body">{message.body}</GText>
                </View>
              );
            })
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
    </ProfileScreenShell>
  );
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    backgroundColor: PROFILE_BG,
  },
  bodyPad: {
    paddingHorizontal: 0,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: theme.spacing[4],
    gap: theme.spacing[3],
    paddingBottom: theme.spacing[10],
  },
  emptyMsg: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing[3],
    ...theme.shadows.sm,
  },
  message: {
    borderRadius: theme.radius.xl,
    padding: theme.spacing[3],
    gap: theme.spacing[1],
    ...theme.shadows.sm,
  },
  partnerMsg: {
    backgroundColor: theme.colors.accentSoft,
  },
  supportMsg: {
    backgroundColor: theme.colors.surface,
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
