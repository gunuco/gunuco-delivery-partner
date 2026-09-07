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
import { StepBanner } from '@/src/features/onboarding/StepBanner';
import { OnboardingHeader } from '@/src/features/onboarding/OnboardingHeader';
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

  const copy = COPY[partner.status as keyof typeof COPY];

  if (!copy) {
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
            <GStatusBadge status={partner.status} kind="partner" />
            <GText variant="h2" style={styles.title}>
              Status unavailable
            </GText>
            <GText variant="body" color={theme.colors.textSecondary}>
              We could not determine your account status. Pull to refresh or contact
              support.
            </GText>
          </GCard>
          <GButton
            title="Refresh"
            size="lg"
            fullWidth
            variant="outline"
            onPress={() => {
              void refetch();
            }}
          />
        </ScrollView>
      </View>
    );
  }

  const onCta = async () => {
    if (!copy.ctaRoute) return;
    try {
      if (copy.ctaRoute === 'logout') {
        await logout();
        router.replace('/(auth)/login');
        return;
      }
      router.push(copy.ctaRoute as never);
    } catch {
      // Keep screen stable if logout/navigation fails.
    }
  };

  return (
    <View style={styles.flex}>
      <OnboardingHeader
        title="Account status"
        showBack
        onBack={() => {
          if (router.canGoBack()) {
            router.back();
            return;
          }
          router.replace('/(onboarding)');
        }}
      />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, theme.spacing[4]) + theme.spacing[4] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <GCard padding="lg" elevated style={styles.statusCard}>
          <View style={styles.iconWrap}>
            <GIcon name={copy.icon} size={28} color={theme.colors.primary} />
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
          rightIcon={<GIcon name="refresh" size={18} color={theme.colors.primary} />}
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

        <StepBanner name="status" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: theme.colors.accentSoft },
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
  statusCard: {
    backgroundColor: theme.colors.surface,
    gap: theme.spacing[2],
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[1],
  },
  title: {
    marginTop: theme.spacing[1],
  },
  code: {
    marginTop: theme.spacing[2],
  },
});
