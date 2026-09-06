import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * Dynamic Expo config — merges static `app.json` with process.env passthrough
 * into `extra` so EAS profile env vars reach `src/config/env.ts` at runtime.
 *
 * EXPO_PUBLIC_* vars are also inlined by Metro; `extra` covers native builds
 * where Constants.expoConfig.extra is the reliable source.
 */
export default ({ config }: ConfigContext): ExpoConfig => {
  const extra = (config.extra ?? {}) as Record<string, unknown>;

  return {
    ...config,
    name: config.name ?? 'GUNUCO Delivery Partner',
    slug: config.slug ?? 'gunuco-delivery-partner',
    extra: {
      ...extra,
      EXPO_PUBLIC_DATA_MODE:
        process.env.EXPO_PUBLIC_DATA_MODE ?? extra.EXPO_PUBLIC_DATA_MODE ?? 'mock',
      EXPO_PUBLIC_UI_TEST_MODE:
        process.env.EXPO_PUBLIC_UI_TEST_MODE ?? extra.EXPO_PUBLIC_UI_TEST_MODE ?? 'true',
      EXPO_PUBLIC_UI_TEST_SCENARIO:
        process.env.EXPO_PUBLIC_UI_TEST_SCENARIO ??
        extra.EXPO_PUBLIC_UI_TEST_SCENARIO ??
        'default',
      EXPO_PUBLIC_APP_ENV:
        process.env.EXPO_PUBLIC_APP_ENV ?? extra.EXPO_PUBLIC_APP_ENV ?? 'development',
      EXPO_PUBLIC_API_BASE_URL:
        process.env.EXPO_PUBLIC_API_BASE_URL ?? extra.EXPO_PUBLIC_API_BASE_URL ?? '',
    },
  };
};
