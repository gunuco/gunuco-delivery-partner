import * as SecureStore from 'expo-secure-store';

import type { AuthSession } from '@/src/types';

const KEYS = {
  accessToken: 'gunuco.session.accessToken',
  refreshToken: 'gunuco.session.refreshToken',
  expiresAt: 'gunuco.session.expiresAt',
  partnerId: 'gunuco.session.partnerId',
} as const;

/**
 * Loads the persisted auth session from SecureStore.
 * Never logs tokens or secrets.
 */
export async function getSession(): Promise<AuthSession | null> {
  const [accessToken, refreshToken, expiresAt, partnerId] = await Promise.all([
    SecureStore.getItemAsync(KEYS.accessToken),
    SecureStore.getItemAsync(KEYS.refreshToken),
    SecureStore.getItemAsync(KEYS.expiresAt),
    SecureStore.getItemAsync(KEYS.partnerId),
  ]);

  if (!accessToken || !refreshToken || !expiresAt || !partnerId) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
    expiresAt,
    partnerId,
  };
}

/**
 * Persists an auth session to SecureStore.
 * Never logs tokens or secrets.
 */
export async function setSession(session: AuthSession): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(KEYS.accessToken, session.accessToken),
    SecureStore.setItemAsync(KEYS.refreshToken, session.refreshToken),
    SecureStore.setItemAsync(KEYS.expiresAt, session.expiresAt),
    SecureStore.setItemAsync(KEYS.partnerId, session.partnerId),
  ]);
}

/** Alias for `setSession`. */
export const saveSession = setSession;

/**
 * Clears the persisted auth session from SecureStore.
 */
export async function clearSession(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(KEYS.accessToken),
    SecureStore.deleteItemAsync(KEYS.refreshToken),
    SecureStore.deleteItemAsync(KEYS.expiresAt),
    SecureStore.deleteItemAsync(KEYS.partnerId),
  ]);
}
