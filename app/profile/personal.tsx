import { router } from 'expo-router';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import {
  GErrorState,
  GHeader,
  GListRow,
  GSkeleton,
  GText,
  theme,
} from '@/src/design-system';
import { usePartner } from '@/src/hooks';
import { getErrorMessage } from '@/src/utils/errors';
import { maskPhone } from '@/src/utils/phone';

export default function PersonalProfileScreen() {
  const { partner, isLoading, error, refetch, isFetching } = usePartner();

  if (isLoading && !partner) {
    return (
      <View style={styles.screen}>
        <GHeader title="Personal details" showBack onBack={() => router.back()} />
        <View style={styles.pad}>
          <GSkeleton height={56} borderRadius={theme.radius.md} />
          <GSkeleton height={56} borderRadius={theme.radius.md} />
          <GSkeleton height={56} borderRadius={theme.radius.md} />
        </View>
      </View>
    );
  }

  if (error && !partner) {
    return (
      <View style={styles.screen}>
        <GHeader title="Personal details" showBack onBack={() => router.back()} />
        <GErrorState
          title="Couldn’t load details"
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
        title="Personal details"
        subtitle="As registered with GUNUCO"
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
        <GListRow title="Full name" subtitle={partner?.name ?? '—'} />
        <GListRow
          title="Partner ID"
          subtitle={partner?.partnerCode ?? '—'}
        />
        <GListRow
          title="Phone"
          subtitle={partner?.phone ? maskPhone(partner.phone) : '—'}
        />
        <GListRow title="Email" subtitle={partner?.email ?? 'Not added'} />
        <GListRow title="Hub" subtitle={partner?.hubName ?? '—'} />
        <GListRow
          title="Account status"
          subtitle={partner?.status?.replace(/_/g, ' ') ?? '—'}
        />
        <GText variant="caption" color={theme.colors.textMuted} style={styles.note}>
          To update address or date of birth, contact GUNUCO support with your
          partner ID.
        </GText>
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
    paddingBottom: theme.spacing[8],
  },
  note: {
    padding: theme.spacing[4],
  },
});
