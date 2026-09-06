import { Redirect, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  GButton,
  GCard,
  GHeader,
  GIcon,
  GLoader,
  GStatusBadge,
  GText,
  theme,
} from '@/src/design-system';
import type { IconName } from '@/src/design-system';
import { useAuth, usePartner } from '@/src/hooks';
import type { PartnerStatus } from '@/src/types';

type StatusCopy = {
  title: string;
  body: string;
  icon: IconName;
  cta?: string;
  ctaRoute?: string;
};

const COPY: Record<Exclude<PartnerStatus, 'APPROVED' | 'PENDING'>, StatusCopy> = {
  UNDER_REVIEW: {
    title: 'Application under review',
    body: 'Our team is verifying your documents and details. This usually takes a few hours. We will notify you when you are approved.',
    icon: 'clock',
  },
  REJECTED: {
    title: 'Application rejected',
    body: 'We could not approve your partner account with the details provided. Update your documents and resubmit.',
    icon: 'closeCircle',
    cta: 'Fix documents',
    ctaRoute: '/(onboarding)/documents',
  },
  ACTION_REQUIRED: {
    title: 'Action required',
    body: 'Some documents need attention before we can approve you. Please re-upload the requested files.',
    icon: 'alert',
    cta: 'Update application',
    ctaRoute: '/(onboarding)',
  },
  SUSPENDED: {
    title: 'Account suspended',
    body: 'Your partner account is temporarily suspended. Contact GUNUCO support for next steps.',
    icon: 'shield',
    cta: 'Back to login',
    ctaRoute: 'logout',
  },
};

export default function OnboardingStatusScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const { partner, isLoading, refetch } = usePartner();

  if (isLoading && !partner) {
    return (
      <View style={styles.center}>
        <GLoader label="Checking status…" />
      </View>
    );
  }

  if (!partner) {
    return <Redirect href="/(auth)/login" />;
  }

  if (partner.status === 'APPROVED') {
    return <Redirect href="/(tabs)/home" />;
  }

  if (partner.status === 'PENDING') {
    return <Redirect href="/(onboarding)" />;
  }

  const copy = COPY[partner.status];

  const onCta = async () => {
    if (!copy.ctaRoute) return;
    if (copy.ctaRoute === 'logout') {
      await logout();
      router.replace('/(auth)/login');
      return;
    }
    router.push(copy.ctaRoute as never);
  };

  return (
    <View style={styles.flex}>
      <GHeader title="Account status" />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + theme.spacing[8] },
        ]}
      >
        <GCard padding="lg">
          <View style={styles.iconWrap}>
            <GIcon name={copy.icon} size={36} color={theme.colors.primary} />
          </View>
          <GStatusBadge status={partner.status} kind="partner" />
          <GText variant="h2" style={styles.title}>
            {copy.title}
          </GText>
          <GText variant="body" color={theme.colors.textSecondary}>
            {copy.body}
          </GText>
          {partner.partnerCode ? (
            <GText variant="caption" color={theme.colors.textMuted} style={styles.code}>
              Partner code: {partner.partnerCode}
            </GText>
          ) : null}
        </GCard>

        <GButton
          title="Refresh status"
          size="lg"
          fullWidth
          variant="outline"
          onPress={() => {
            void refetch();
          }}
        />

        {copy.cta ? (
          <GButton
            title={copy.cta}
            size="lg"
            fullWidth
            onPress={() => {
              void onCta();
            }}
          />
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: theme.colors.background },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[4],
    gap: theme.spacing[3],
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[3],
  },
  title: { marginTop: theme.spacing[3], marginBottom: theme.spacing[2] },
  code: { marginTop: theme.spacing[4] },
});
