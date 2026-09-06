import 'react-native-gesture-handler';

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { NetworkBanner } from '@/src/components/NetworkBanner';
import { GLoader, theme, ToastProvider } from '@/src/design-system';
import { useSessionHydration } from '@/src/hooks';
import { StoreProvider } from '@/src/store/Provider';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

function RootNavigator() {
  const { isHydrated } = useSessionHydration();

  useEffect(() => {
    if (isHydrated) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [isHydrated]);

  if (!isHydrated) {
    return (
      <View style={styles.boot}>
        <GLoader label="Starting GUNUCO…" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <NetworkBanner />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="orders" />
        <Stack.Screen name="delivery" />
        <Stack.Screen name="earnings" />
        <Stack.Screen name="incentives" />
        <Stack.Screen name="performance" />
        <Stack.Screen name="shifts" />
        <Stack.Screen name="demand" />
        <Stack.Screen name="support" options={{ presentation: 'modal' }} />
        <Stack.Screen name="emergency" options={{ presentation: 'modal' }} />
        <Stack.Screen name="notifications" options={{ presentation: 'modal' }} />
        <Stack.Screen name="profile" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <StoreProvider>
      <ToastProvider>
        <RootNavigator />
      </ToastProvider>
    </StoreProvider>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
});
