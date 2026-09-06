import { Stack } from 'expo-router';

export default function DeliveryIdLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="pickup" />
      <Stack.Screen name="navigate" />
      <Stack.Screen name="verify" />
      <Stack.Screen name="complete" />
      <Stack.Screen name="fail" />
    </Stack>
  );
}
