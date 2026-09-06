import { router } from 'expo-router';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import {
  GBadge,
  GCard,
  GEmptyState,
  GErrorState,
  GHeader,
  GSkeleton,
  GText,
  theme,
} from '@/src/design-system';
import { useBenefits } from '@/src/hooks';
import { formatDate } from '@/src/utils/date';
import { getErrorMessage } from '@/src/utils/errors';

export default function BenefitsScreen() {
  const { benefits, isLoading, error, refetch, isFetching } = useBenefits();

  if (isLoading && benefits.length === 0) {
    return (
      <View style={styles.screen}>
        <GHeader title="Benefits" showBack onBack={() => router.back()} />
        <View style={styles.pad}>
          <GSkeleton height={100} borderRadius={theme.radius.lg} />
          <GSkeleton height={100} borderRadius={theme.radius.lg} />
        </View>
      </View>
    );
  }

  if (error && benefits.length === 0) {
    return (
      <View style={styles.screen}>
        <GHeader title="Benefits" showBack onBack={() => router.back()} />
        <GErrorState
          title="Couldn’t load benefits"
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
        title="Partner benefits"
        subtitle="Perks for active riders"
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
        {benefits.length === 0 ? (
          <GEmptyState
            title="No benefits yet"
            description="Stay online and complete deliveries to unlock partner perks."
          />
        ) : (
          benefits.map((benefit) => (
            <GCard key={benefit.id} padding="md" style={styles.card}>
              <View style={styles.row}>
                <GText variant="bodyBold" style={styles.flex}>
                  {benefit.title}
                </GText>
                <GBadge
                  label={benefit.status}
                  tone={benefit.status === 'ACTIVE' ? 'success' : 'neutral'}
                />
              </View>
              <GText variant="body" color={theme.colors.textSecondary}>
                {benefit.description}
              </GText>
              <GText variant="caption" color={theme.colors.textMuted}>
                {benefit.provider ? `${benefit.provider} · ` : ''}
                {benefit.validUntil
                  ? `Valid till ${formatDate(benefit.validUntil)}`
                  : 'Validity not specified'}
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
    flexGrow: 1,
  },
  card: {
    gap: theme.spacing[2],
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing[3],
    alignItems: 'flex-start',
  },
  flex: {
    flex: 1,
  },
});
