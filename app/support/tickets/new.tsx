import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import {
  GButton,
  GInput,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import {
  ProfileHeroCard,
  ProfileScreenShell,
} from '@/src/features/profile/ProfileScreenShell';
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
    <ProfileScreenShell
      title="New ticket"
      subtitle="Tell us what happened"
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
        >
          <ProfileHeroCard
            icon="plus"
            eyebrow="Support"
            title="Raise a ticket"
            body="GUNUCO support typically replies within a few minutes during peak hours."
          />

          <GText variant="bodyBold">Category</GText>
          <View style={styles.chips}>
            {CATEGORIES.map((item) => {
              const selected = category === item;
              return (
                <Pressable
                  key={item}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setCategory(item)}
                  style={[
                    styles.chip,
                    selected ? styles.chipSelected : styles.chipIdle,
                  ]}
                >
                  <GText
                    variant="caption"
                    color={
                      selected ? theme.colors.textInverse : theme.colors.text
                    }
                    style={styles.chipLabel}
                  >
                    {TICKET_CATEGORY_LABELS[item]}
                  </GText>
                </Pressable>
              );
            })}
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
    </ProfileScreenShell>
  );
}

const styles = StyleSheet.create({
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
  },
  chip: {
    minHeight: 36,
    paddingHorizontal: theme.spacing[3],
    borderRadius: theme.radius.full,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipIdle: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.borderStrong,
  },
  chipLabel: {
    fontWeight: '600',
  },
  multiline: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
});
