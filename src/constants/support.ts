/**
 * Partner support & emergency contact constants.
 * Emergency defaults to India national emergency; override via EXPO_PUBLIC_EMERGENCY_NUMBER.
 */

export const EMERGENCY_NUMBER =
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_EMERGENCY_NUMBER) ||
  '112';

export const GUNUCO_SUPPORT_NUMBER =
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_SUPPORT_NUMBER) ||
  '18005728462';

export const LEGAL_TERMS_URL =
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_TERMS_URL) ||
  'https://gunuco.com/legal/partner-terms';

export const LEGAL_PRIVACY_URL =
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_PRIVACY_URL) ||
  'https://gunuco.com/legal/privacy';
