import { Stack } from 'expo-router';

const PROFILE_BG = '#FFF8FA';

export default function ProfileStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: PROFILE_BG },
      }}
    />
  );
}
