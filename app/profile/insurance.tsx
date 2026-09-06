import { router } from 'expo-router';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import {
  GBadge,
  GCard,
  GEmptyState,
  GErrorState,
  GHeader,
  GListRow,
  GSkeleton,
  GText,
  theme,
} from '@/src/design-system';
import { useBenefits } from '@/src/hooks';
import { formatDate } from '@/src/utils/date';
import { getErrorMessage } from '@/src/utils/errors';

export default function InsuranceScreen() {
  const { insurance, isLoading, error, refetch, isFetching } = useBenefits();

  if (isLoading && !insurance) {
    return (
      <View style={styles.screen}>
        <GHeader title="Insurance" showBack onBack={() => router.back()} />
        <View style={styles.pad}>
          <GSkeleton height={140} borderRadius={theme.radius.lg} />
        </View>
      </View>
    );
  }

  if (error && !insurance) {
    return (
      <View style={styles.screen}>
        <GHeader title="Insurance" showBack onBack={() => router.back()} />
        <GErrorState
          title="Couldn’t load insurance"
          description={getErrorMessage(error)}
          onRetry={() => {
            void refetch();
          }}
        />
      </View>
    );
  }

  if (!insurance) {
    return (
      <View style={styles.screen}>
        <GHeader title="Insurance" showBack onBack={() => router.back()} />
        <GEmptyState
          title="No insurance on file"
          description="Active partners receive on-trip accident cover from GUNUCO Protect."
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <GHeader
        title="Insurance"
        subtitle="On-trip partner cover"
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
        <GCard padding="lg" style={styles.hero}>
          <View style={styles.heroTop}>
            <GText variant="h2" style={styles.flex}>
              {insurance.provider}
            </GText>
            <GBadge
              label={insurance.status}
              tone={insurance.status === 'ACTIVE' ? 'success' : 'warning'}
            />
          </View>
          {insurance.coverageSummary ? (
            <GText variant="body" color={theme.colors.textSecondary}>
              {insurance.coverageSummary}
            </GText>
          ) : null}
        </GCard>

        <GListRow
          title="Policy"
          subtitle={insurance.policyNumberMasked ?? '—'}
        />
        <GListRow
          title="Valid until"
          subtitle={
            insurance.validUntil ? formatDate(insurance.validUntil) : '—'
          }
        />
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
  },
  content: {
    paddingBottom: theme.spacing[8],
  },
  hero: {
    margin: theme.spacing[4],
    gap: theme.spacing[2],
  },
  heroTop: {
    flexDirection: 'row',
    gap: theme.spacing[3],
    alignItems: 'flex-start',
  },
  flex: {
    flex: 1,
  },
});
