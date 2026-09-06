import { Stack } from 'expo-router';

import { theme } from '@/src/design-system';

export default function SupportStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    />
  );
}
