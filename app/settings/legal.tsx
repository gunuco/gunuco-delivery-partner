import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

import { GHeader, GIcon, GListRow, theme } from '@/src/design-system';
import { LEGAL_PRIVACY_URL, LEGAL_TERMS_URL } from '@/src/constants/support';
import { getErrorMessage } from '@/src/utils/errors';

async function openUrl(url: string) {
  try {
    await WebBrowser.openBrowserAsync(url);
  } catch (err) {
    Alert.alert('Couldn’t open link', getErrorMessage(err));
  }
}

export default function SettingsLegalScreen() {
  return (
    <View style={styles.screen}>
      <GHeader
        title="Legal"
        subtitle="Partner terms & privacy"
        showBack
        onBack={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <GListRow
          title="Partner terms of use"
          subtitle="Rules for delivering with GUNUCO"
          left={<GIcon name="document" size={22} color={theme.colors.primary} />}
          showChevron
          onPress={() => {
            void openUrl(LEGAL_TERMS_URL);
          }}
        />
        <GListRow
          title="Privacy policy"
          subtitle="How we handle partner data"
          left={<GIcon name="shield" size={22} color={theme.colors.primary} />}
          showChevron
          onPress={() => {
            void openUrl(LEGAL_PRIVACY_URL);
          }}
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
});
