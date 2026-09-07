import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import {
  GBadge,
  GErrorState,
  GSkeleton,
  theme,
} from '@/src/design-system';
import {
  ProfileDetailRow,
  ProfileHeroCard,
  ProfileScreenShell,
  PROFILE_BG,
} from '@/src/features/profile/ProfileScreenShell';
import { useBenefits } from '@/src/hooks';
import { formatDate } from '@/src/utils/date';
import { getErrorMessage } from '@/src/utils/errors';

export default function InsuranceScreen() {
  const { insurance, isLoading, error, refetch, isFetching } = useBenefits();

  if (isLoading && !insurance) {
    return (
      <ProfileScreenShell
        title="Insurance"
        subtitle="On-trip partner cover"
        onBack={() => router.back()}
      >
        <GSkeleton height={140} borderRadius={theme.radius.xl} />
      </ProfileScreenShell>
    );
  }

  if (error && !insurance) {
    return (
      <View style={styles.fallback}>
        <ProfileScreenShell title="Insurance" onBack={() => router.back()}>
          <GErrorState
            title="Couldn’t load insurance"
            description={getErrorMessage(error)}
            onRetry={() => {
              void refetch();
            }}
          />
        </ProfileScreenShell>
      </View>
    );
  }

  if (!insurance) {
    return (
      <ProfileScreenShell
        title="Insurance"
        subtitle="On-trip partner cover"
        onBack={() => router.back()}
      >
        <ProfileHeroCard
          icon="shield"
          eyebrow="GUNUCO Protect"
          title="No insurance on file"
          body="Active partners receive on-trip accident cover from GUNUCO Protect."
        />
      </ProfileScreenShell>
    );
  }

  return (
    <ProfileScreenShell
      title="Insurance"
      subtitle="On-trip partner cover"
      onBack={() => router.back()}
      refreshing={isFetching && !isLoading}
      onRefresh={() => {
        void refetch();
      }}
    >
      <ProfileHeroCard
        icon="shield"
        eyebrow="Provider"
        title={insurance.provider}
        body={insurance.coverageSummary}
        right={
          <GBadge
            label={insurance.status}
            tone={insurance.status === 'ACTIVE' ? 'success' : 'warning'}
          />
        }
      />

      <ProfileDetailRow
        icon="document"
        label="Policy"
        value={insurance.policyNumberMasked ?? '—'}
      />
      <ProfileDetailRow
        icon="calendar"
        label="Valid until"
        value={insurance.validUntil ? formatDate(insurance.validUntil) : '—'}
      />
    </ProfileScreenShell>
  );
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    backgroundColor: PROFILE_BG,
  },
});
