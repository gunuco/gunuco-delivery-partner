import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { GText, theme } from '@/src/design-system';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found', headerShown: true }} />
      <View style={styles.container}>
        <GText variant="h3" center>
          This screen doesn’t exist.
        </GText>
        <Link href="/" style={styles.link}>
          <GText variant="bodyBold" color={theme.colors.primary}>
            Go home
          </GText>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing[5],
    backgroundColor: theme.colors.background,
    gap: theme.spacing[4],
  },
  link: {
    paddingVertical: theme.spacing[3],
    minHeight: theme.components.minTouchTarget,
  },
});
