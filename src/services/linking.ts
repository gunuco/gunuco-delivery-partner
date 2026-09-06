import { Linking } from 'react-native';

/**
 * Opens the dialer for a phone number.
 * Masked-aware: rejects values that still contain mask characters (X/x/*)
 * so we never dial incomplete display numbers.
 * Allows short emergency numbers (e.g. 100 / 108 / 112).
 */
export async function callPhone(phone: string): Promise<void> {
  const trimmed = phone.trim();
  if (!trimmed) {
    throw new Error('Phone number is empty');
  }

  if (/[Xx*]/.test(trimmed)) {
    throw new Error('Cannot call a masked phone number');
  }

  const digits = trimmed.replace(/\D/g, '');
  const isEmergencyShortCode = /^1\d{2}$/.test(digits);
  if (!isEmergencyShortCode && digits.length < 8) {
    throw new Error('Phone number is incomplete');
  }

  const telUrl = `tel:${digits}`;
  const canOpen = await Linking.canOpenURL(telUrl);
  if (!canOpen) {
    throw new Error('Unable to open the phone dialer');
  }

  await Linking.openURL(telUrl);
}
