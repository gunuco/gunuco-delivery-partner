import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GText, theme } from '@/src/design-system';
import { useNetworkStatus } from '@/src/hooks/useNetworkStatus';
import { a11yLabel } from '@/src/utils/accessibility';

/**
 * Thin offline banner. Mount once near the root navigator.
 * Also starts network monitoring via `useNetworkStatus`.
 */
export function NetworkBanner() {
  const { isOffline } = useNetworkStatus();
  const insets = useSafeAreaInsets();

  if (!isOffline) {
    return null;
  }

  return (
    <View
      style={[styles.banner, { paddingTop: Math.max(insets.top, theme.spacing[2]) }]}
      accessibilityRole="alert"
      {...a11yLabel('You are offline. Some actions may be unavailable.')}
    >
      <GText variant="caption" color={theme.colors.textInverse} style={styles.text}>
        You are offline. Some actions may be unavailable.
      </GText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: theme.colors.primaryDark,
    paddingHorizontal: theme.spacing[4],
    paddingBottom: theme.spacing[2],
  },
  text: {
    textAlign: 'center',
  },
});
