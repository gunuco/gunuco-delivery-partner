# Environment

## Variables

| Variable | Values | Purpose |
| --- | --- | --- |
| `EXPO_PUBLIC_APP_ENV` | `development` \| `preview` \| `production` | Build environment; production triggers hard guards |
| `EXPO_PUBLIC_DATA_MODE` | `mock` \| `api` | Repository factory selection (**ignored in production → forced `api`**) |
| `EXPO_PUBLIC_UI_TEST_MODE` | `true` \| `false` | Seed UI scenarios (**forced `false` in production**) |
| `EXPO_PUBLIC_UI_TEST_SCENARIO` | see [mock-mode.md](mock-mode.md) | Which seed to apply |
| `EXPO_PUBLIC_API_BASE_URL` | URL string | Required for real API calls |

Resolution order in `src/config/env.ts`: `process.env` first, then `Constants.expoConfig.extra` from `app.config.ts` / `app.json`.

## Production never uses mock

When `appEnv === 'production'`:

```ts
dataMode: 'api'
uiTestMode: false
uiTestScenario: ''
```

Do not rely on EAS alone for this — the runtime guard in `env.ts` is authoritative.

## `app.config.ts`

Merges static `app.json` plugins/icons with env passthrough into `extra` so EAS profile env vars are available to `expo-constants` at runtime. Metro also inlines `EXPO_PUBLIC_*` for JS.

## EAS build profiles (`eas.json`)

| Profile | Distribution | DATA_MODE | UI_TEST | Notes |
| --- | --- | --- | --- | --- |
| `development` | internal APK + dev client | mock | true | Local-like native |
| `preview` | internal APK | mock | true | Stakeholder builds |
| `native-test` | internal APK | mock | true | Scenario `new-order` |
| `production` | store / release | api | false | `autoIncrement`; never mock |

Set `EXPO_PUBLIC_API_BASE_URL` in EAS secrets / production env for release builds.

## Local overrides

Create a local `.env` (if using Expo env loading) or pass vars when starting:

```bash
EXPO_PUBLIC_UI_TEST_SCENARIO=active-delivery npm start
```

Never commit secrets or production API keys into the repo.
