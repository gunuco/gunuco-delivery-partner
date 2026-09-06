import Constants from 'expo-constants';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  GCard,
  GHeader,
  GListRow,
  GText,
  theme,
} from '@/src/design-system';
import { appConfig } from '@/src/config/env';

export default function SettingsAboutScreen() {
  const version =
    Constants.expoConfig?.version ??
    Constants.nativeAppVersion ??
    '1.0.0';
  const build =
    Constants.nativeBuildVersion ??
    Constants.expoConfig?.ios?.buildNumber ??
    Constants.expoConfig?.android?.versionCode?.toString() ??
    '—';

  return (
    <View style={styles.screen}>
      <GHeader
        title="About"
        subtitle="GUNUCO Delivery Partner"
        showBack
        onBack={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <GCard padding="lg" style={styles.hero}>
          <GText variant="h2">GUNUCO</GText>
          <GText variant="body" color={theme.colors.textSecondary}>
            Delivery Partner app for celebration cake logistics across
            Hyderabad.
          </GText>
        </GCard>
        <GListRow title="App version" subtitle={version} />
        <GListRow title="Build" subtitle={String(build)} />
        <GListRow title="Environment" subtitle={appConfig.appEnv} />
        <GListRow
          title="Data mode"
          subtitle={appConfig.dataMode === 'mock' ? 'Mock' : 'API'}
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
  content: {
    paddingBottom: theme.spacing[8],
  },
  hero: {
    margin: theme.spacing[4],
    gap: theme.spacing[2],
  },
});
