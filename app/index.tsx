import { Redirect } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { GLoader, theme } from '@/src/design-system';
import { getAuthenticatedHref } from '@/src/features/auth/routing';
import { useAuth, useOnboarding, usePartner } from '@/src/hooks';

/**
 * Auth gate — redirects based on session hydration + partner status.
 */
export default function Index() {
  const { isAuthenticated, isHydrated } = useAuth();
  const { partner, isLoading: partnerLoading } = usePartner();
  const { progress, isLoading: progressLoading } = useOnboarding();

  if (!isHydrated) {
    return (
      <View style={styles.center}>
        <GLoader label="Loading…" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  if (partnerLoading || (progressLoading && !progress)) {
    return (
      <View style={styles.center}>
        <GLoader label="Checking your account…" />
      </View>
    );
  }

  return <Redirect href={getAuthenticatedHref(partner?.status, progress)} />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
});
