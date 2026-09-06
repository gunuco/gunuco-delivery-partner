import Constants from 'expo-constants';

export type DataMode = 'mock' | 'api';

export type AppEnv = 'development' | 'preview' | 'production';

export interface AppConfig {
  dataMode: DataMode;
  uiTestMode: boolean;
  uiTestScenario: string;
  apiBaseUrl: string;
  appEnv: AppEnv;
  isProduction: boolean;
}

type ExtraConfig = {
  EXPO_PUBLIC_DATA_MODE?: string;
  EXPO_PUBLIC_UI_TEST_MODE?: string | boolean;
  EXPO_PUBLIC_UI_TEST_SCENARIO?: string;
  EXPO_PUBLIC_API_BASE_URL?: string;
  EXPO_PUBLIC_APP_ENV?: string;
};

function readExtra(): ExtraConfig {
  const fromExpo = (Constants.expoConfig?.extra ?? {}) as ExtraConfig;
  return fromExpo;
}

function readEnvValue(
  processValue: string | undefined,
  extraValue: string | boolean | undefined,
): string | boolean | undefined {
  if (processValue !== undefined && processValue !== '') {
    return processValue;
  }
  return extraValue;
}

function parseDataMode(value: string | boolean | undefined): DataMode {
  return value === 'api' ? 'api' : 'mock';
}

function parseBoolean(value: string | boolean | undefined): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1';
  }
  return false;
}

function parseAppEnv(value: string | boolean | undefined): AppEnv {
  if (value === 'preview' || value === 'production' || value === 'development') {
    return value;
  }
  return 'development';
}

function buildAppConfig(): AppConfig {
  const extra = readExtra();

  // Explicit static access required by expo/no-dynamic-env-var
  const appEnv = parseAppEnv(
    readEnvValue(process.env.EXPO_PUBLIC_APP_ENV, extra.EXPO_PUBLIC_APP_ENV),
  );
  const isProduction = appEnv === 'production';

  // Production MUST force API mode and disable UI test overrides
  if (isProduction) {
    return {
      dataMode: 'api',
      uiTestMode: false,
      uiTestScenario: '',
      apiBaseUrl: String(
        readEnvValue(process.env.EXPO_PUBLIC_API_BASE_URL, extra.EXPO_PUBLIC_API_BASE_URL) ?? '',
      ),
      appEnv,
      isProduction: true,
    };
  }

  return {
    dataMode: parseDataMode(
      readEnvValue(process.env.EXPO_PUBLIC_DATA_MODE, extra.EXPO_PUBLIC_DATA_MODE),
    ),
    uiTestMode: parseBoolean(
      readEnvValue(process.env.EXPO_PUBLIC_UI_TEST_MODE, extra.EXPO_PUBLIC_UI_TEST_MODE),
    ),
    uiTestScenario: String(
      readEnvValue(
        process.env.EXPO_PUBLIC_UI_TEST_SCENARIO,
        extra.EXPO_PUBLIC_UI_TEST_SCENARIO,
      ) ?? 'default',
    ),
    apiBaseUrl: String(
      readEnvValue(process.env.EXPO_PUBLIC_API_BASE_URL, extra.EXPO_PUBLIC_API_BASE_URL) ?? '',
    ),
    appEnv,
    isProduction: false,
  };
}

export const appConfig: AppConfig = buildAppConfig();
