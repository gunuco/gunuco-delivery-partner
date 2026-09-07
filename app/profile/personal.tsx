import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import {
  GErrorState,
  GSkeleton,
  GText,
  theme,
} from '@/src/design-system';
import {
  ProfileDetailRow,
  ProfileHeroCard,
  ProfileScreenShell,
  PROFILE_BG,
} from '@/src/features/profile/ProfileScreenShell';
import { usePartner } from '@/src/hooks';
import { getErrorMessage } from '@/src/utils/errors';
import { maskPhone } from '@/src/utils/phone';

export default function PersonalProfileScreen() {
  const { partner, isLoading, error, refetch, isFetching } = usePartner();

  if (isLoading && !partner) {
    return (
      <ProfileScreenShell
        title="Personal details"
        subtitle="As registered with GUNUCO"
        onBack={() => router.back()}
      >
        <GSkeleton height={96} borderRadius={theme.radius.xl} />
        <GSkeleton height={72} borderRadius={theme.radius.xl} />
        <GSkeleton height={72} borderRadius={theme.radius.xl} />
      </ProfileScreenShell>
    );
  }

  if (error && !partner) {
    return (
      <View style={styles.fallback}>
        <ProfileScreenShell
          title="Personal details"
          onBack={() => router.back()}
        >
          <GErrorState
            title="Couldn’t load details"
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
      title="Personal details"
      subtitle="As registered with GUNUCO"
      onBack={() => router.back()}
      refreshing={isFetching && !isLoading}
      onRefresh={() => {
        void refetch();
      }}
    >
      <ProfileHeroCard
        icon="profile"
        eyebrow="Partner"
        title={partner?.name ?? 'Partner'}
        body={`${partner?.partnerCode ?? '—'} · ${partner?.hubName ?? 'Hub pending'}`}
      />

      <ProfileDetailRow
        icon="profile"
        label="Full name"
        value={partner?.name ?? '—'}
      />
      <ProfileDetailRow
        icon="idCard"
        label="Partner ID"
        value={partner?.partnerCode ?? '—'}
      />
      <ProfileDetailRow
        icon="phone"
        label="Phone"
        value={partner?.phone ? maskPhone(partner.phone) : '—'}
      />
      <ProfileDetailRow
        icon="chat"
        label="Email"
        value={partner?.email ?? 'Not added'}
      />
      <ProfileDetailRow
        icon="building"
        label="Hub"
        value={partner?.hubName ?? '—'}
      />
      <ProfileDetailRow
        icon="checkCircle"
        label="Account status"
        value={partner?.status?.replace(/_/g, ' ') ?? '—'}
      />

      <View style={styles.note}>
        <GText variant="caption" color={theme.colors.textMuted}>
          To update address or date of birth, contact GUNUCO support with your
          partner ID.
        </GText>
      </View>
    </ProfileScreenShell>
  );
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    backgroundColor: PROFILE_BG,
  },
  note: {
    paddingHorizontal: theme.spacing[1],
    paddingTop: theme.spacing[1],
  },
});
