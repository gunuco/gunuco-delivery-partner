import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import {
  GButton,
  GChip,
  GHeader,
  GInput,
  GSectionHeader,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import { useSupport } from '@/src/hooks';
import type { TicketCategory } from '@/src/types';
import { getErrorMessage } from '@/src/utils/errors';
import { TICKET_CATEGORY_LABELS } from '@/src/utils/labels';

const CATEGORIES = Object.keys(TICKET_CATEGORY_LABELS) as TicketCategory[];

export default function NewSupportTicketScreen() {
  const { createTicket, createState } = useSupport();
  const { showToast } = useToast();
  const [category, setCategory] = useState<TicketCategory>('OTHER');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [orderId, setOrderId] = useState('');

  const canSubmit = useMemo(
    () => subject.trim().length >= 4 && description.trim().length >= 10,
    [subject, description],
  );

  const onSubmit = async () => {
    if (!canSubmit) return;
    try {
      const ticket = await createTicket({
        category,
        subject: subject.trim(),
        description: description.trim(),
        orderId: orderId.trim() || undefined,
      });
      showToast({ type: 'success', message: 'Ticket created.' });
      router.replace(`/support/tickets/${ticket.id}`);
    } catch (err) {
      Alert.alert('Couldn’t create ticket', getErrorMessage(err));
    }
  };

  return (
    <View style={styles.screen}>
      <GHeader
        title="New ticket"
        subtitle="Tell us what happened"
        showBack
        onBack={() => router.back()}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <GSectionHeader title="Category" />
          <View style={styles.chips}>
            {CATEGORIES.map((item) => (
              <GChip
                key={item}
                label={TICKET_CATEGORY_LABELS[item]}
                selected={category === item}
                onPress={() => setCategory(item)}
              />
            ))}
          </View>

          <GInput
            label="Subject"
            value={subject}
            onChangeText={setSubject}
            placeholder="Short summary"
            maxLength={80}
          />
          <GInput
            label="Details"
            value={description}
            onChangeText={setDescription}
            placeholder="What went wrong? Include order number if you have it."
            multiline
            numberOfLines={5}
            style={styles.multiline}
          />
          <GInput
            label="Order ID (optional)"
            value={orderId}
            onChangeText={setOrderId}
            placeholder="e.g. order_gn10284"
            autoCapitalize="none"
          />

          <GText variant="caption" color={theme.colors.textMuted}>
            GUNUCO support typically replies within a few minutes during peak
            hours.
          </GText>

          <GButton
            title="Submit ticket"
            fullWidth
            size="lg"
            disabled={!canSubmit}
            loading={createState.isLoading}
            onPress={() => {
              void onSubmit();
            }}
          />
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
  content: {
    padding: theme.spacing[4],
    gap: theme.spacing[3],
    paddingBottom: theme.spacing[10],
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
  },
  multiline: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
});
