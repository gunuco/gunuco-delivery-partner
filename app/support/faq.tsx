import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import {
  GCard,
  GChip,
  GEmptyState,
  GErrorState,
  GHeader,
  GSkeleton,
  GText,
  theme,
} from '@/src/design-system';
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
      <View style={styles.screen}>
        <GHeader title="FAQs" showBack onBack={() => router.back()} />
        <View style={styles.pad}>
          <GSkeleton height={100} borderRadius={theme.radius.lg} />
          <GSkeleton height={100} borderRadius={theme.radius.lg} />
        </View>
      </View>
    );
  }

  if (error && faqs.length === 0) {
    return (
      <View style={styles.screen}>
        <GHeader title="FAQs" showBack onBack={() => router.back()} />
        <GErrorState
          title="Couldn’t load FAQs"
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
        title="Frequently asked"
        subtitle="Quick answers for partners"
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
        <View style={styles.chips}>
          <GChip
            label="All"
            selected={category === 'ALL'}
            onPress={() => setCategory('ALL')}
          />
          {categories.map((item) => (
            <GChip
              key={item}
              label={item}
              selected={category === item}
              onPress={() => setCategory(item)}
            />
          ))}
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
            <GCard key={faq.id} padding="md" style={styles.card}>
              <GText variant="label" color={theme.colors.textMuted}>
                {faq.category}
              </GText>
              <GText variant="bodyBold">{faq.question}</GText>
              <GText variant="body" color={theme.colors.textSecondary}>
                {faq.answer}
              </GText>
            </GCard>
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
    padding: theme.spacing[4],
    gap: theme.spacing[3],
    paddingBottom: theme.spacing[8],
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
  },
  card: {
    gap: theme.spacing[2],
  },
});
