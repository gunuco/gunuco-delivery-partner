import { Linking, Platform } from 'react-native';

export type ExternalNavigationTarget = {
  lat: number;
  lng: number;
  label?: string;
};

/**
 * Opens Apple Maps (iOS) or Google Maps (Android / default) for turn-by-turn
 * navigation. No API keys required.
 */
export async function openExternalNavigation({
  lat,
  lng,
  label,
}: ExternalNavigationTarget): Promise<void> {
  const encodedLabel = encodeURIComponent(label ?? 'Destination');
  const url =
    Platform.OS === 'ios'
      ? `http://maps.apple.com/?daddr=${lat},${lng}&q=${encodedLabel}`
      : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=&travelmode=driving`;

  const canOpen = await Linking.canOpenURL(url);
  if (!canOpen) {
    const fallback = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    await Linking.openURL(fallback);
    return;
  }

  await Linking.openURL(url);
}
