import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  GEmptyState,
  GErrorState,
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
import { getErrorMessage } from '@/src/utils/errors';

export default function SupportFaqScreen() {
  const { faqs, isLoading, error, refetch, isFetching } = useSupport();
  const [category, setCategory] = useState<string>('ALL');

  const categories = useMemo(() => {
    const set = new Set(faqs.map((f) => f.category));
    return Array.from(set);
  }, [faqs]);

  const filtered = useMemo(() => {
    if (category === 'ALL') return faqs;
    return faqs.filter((f) => f.category === category);
  }, [faqs, category]);

  if (isLoading && faqs.length === 0) {
    return (
      <ProfileScreenShell
        title="Frequently asked"
        subtitle="Quick answers for partners"
        onBack={() => router.back()}
      >
        <GSkeleton height={100} borderRadius={theme.radius.xl} />
        <GSkeleton height={100} borderRadius={theme.radius.xl} />
      </ProfileScreenShell>
    );
  }

  if (error && faqs.length === 0) {
    return (
      <View style={styles.fallback}>
        <ProfileScreenShell title="FAQs" onBack={() => router.back()}>
          <GErrorState
            title="Couldn’t load FAQs"
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
      title="Frequently asked"
      subtitle="Quick answers for partners"
      onBack={() => router.back()}
      refreshing={isFetching && !isLoading}
      onRefresh={() => {
        void refetch();
      }}
    >
      <ProfileHeroCard
        icon="help"
        eyebrow="Help centre"
        title="Partner FAQs"
        body="Cake handling, OTP, payouts, and on-road safety answers."
      />

      <View style={styles.chips}>
        {(['ALL', ...categories] as string[]).map((item) => {
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
                color={selected ? theme.colors.textInverse : theme.colors.text}
                style={styles.chipLabel}
              >
                {item === 'ALL' ? 'All' : item}
              </GText>
            </Pressable>
          );
        })}
      </View>

      {filtered.length === 0 ? (
        <GEmptyState
          title="No FAQs"
          description="Check back soon or raise a support ticket."
          actionLabel="New ticket"
          onAction={() => router.push('/support/tickets/new')}
        />
      ) : (
        filtered.map((faq) => (
          <View key={faq.id} style={styles.card}>
            <GText variant="label" color={theme.colors.textMuted}>
              {faq.category}
            </GText>
            <GText variant="bodyBold">{faq.question}</GText>
            <GText variant="body" color={theme.colors.textSecondary}>
              {faq.answer}
            </GText>
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
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing[3],
    gap: theme.spacing[2],
    ...theme.shadows.sm,
  },
});
