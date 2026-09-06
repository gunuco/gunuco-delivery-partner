import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  GConfirmationDialog,
  GHeader,
  GIcon,
  GListRow,
  theme,
} from '@/src/design-system';
import { appConfig } from '@/src/config/env';
import { useAuth } from '@/src/hooks';
import { useUiTestScenarios } from '@/src/hooks/useUiTestScenarios';

export default function SettingsIndexScreen() {
  const { logout, logoutState } = useAuth();
  const { isAvailable, activeId } = useUiTestScenarios();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const showScenarios =
    isAvailable || (!appConfig.isProduction && appConfig.uiTestMode);

  return (
    <View style={styles.screen}>
      <GHeader
        title="Settings"
        subtitle="App preferences"
        showBack
        onBack={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <GListRow
          title="Notification preferences"
          subtitle="Orders, payouts, incentives"
          left={<GIcon name="notification" size={22} color={theme.colors.primary} />}
          showChevron
          onPress={() => router.push('/settings/notifications')}
        />
        <GListRow
          title="Language"
          subtitle="English (more soon)"
          left={<GIcon name="settings" size={22} color={theme.colors.primary} />}
        />
        <GListRow
          title="Permissions"
          subtitle="Location, camera, notifications"
          left={<GIcon name="shield" size={22} color={theme.colors.primary} />}
          showChevron
          onPress={() => router.push('/settings/permissions')}
        />
        <GListRow
          title="Legal"
          subtitle="Terms & privacy"
          left={<GIcon name="document" size={22} color={theme.colors.primary} />}
          showChevron
          onPress={() => router.push('/settings/legal')}
        />
        <GListRow
          title="About"
          subtitle="App version & info"
          left={<GIcon name="info" size={22} color={theme.colors.primary} />}
          showChevron
          onPress={() => router.push('/settings/about')}
        />
        {showScenarios ? (
          <GListRow
            title="UI Test Scenarios"
            subtitle={
              activeId
                ? `Mock QA · active: ${activeId}`
                : 'Browse and apply all mock scenarios'
            }
            left={<GIcon name="settings" size={22} color={theme.colors.accent} />}
            showChevron
            onPress={() => router.push('/settings/scenarios')}
          />
        ) : null}
        <GListRow
          title="Log out"
          subtitle="Sign out of this device"
          left={<GIcon name="logout" size={22} color={theme.colors.danger} />}
          onPress={() => setConfirmLogout(true)}
        />
      </ScrollView>

      <GConfirmationDialog
        visible={confirmLogout}
        title="Log out?"
        message="You’ll need to verify OTP again to go online."
        confirmLabel="Log out"
        cancelLabel="Cancel"
        destructive
        loading={logoutState.isLoading}
        onConfirm={() => {
          void (async () => {
            await logout();
            setConfirmLogout(false);
            router.replace('/(auth)/login');
          })();
        }}
        onCancel={() => setConfirmLogout(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingBottom: theme.spacing[8],
  },
});
