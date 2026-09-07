import { Stack } from 'expo-router';

const BG = '#FFF8FA';

export default function EarningsStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: BG },
      }}
    />
  );
}
