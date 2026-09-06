# GUNUCO Delivery Partner

Expo (SDK 57) React Native app for GUNUCO cake delivery partners — onboarding, availability, order workflow, earnings, and support.

## Prerequisites

- Node.js 20+
- npm (or yarn / pnpm)
- Expo Go **or** a custom dev client (`expo-dev-client`) for native modules
- Optional: [EAS CLI](https://docs.expo.dev/build/setup/) for cloud builds

## Quick start

```bash
npm install
npm start
```

Then press `a` / `i` / `w` for Android, iOS, or web. Dev client:

```bash
npm run start:dev-client
```

## Mock mode (default)

Local and internal builds default to **mock** data so UI work does not need a live backend.

| Env | Typical value |
| --- | --- |
| `EXPO_PUBLIC_DATA_MODE` | `mock` (default) or `api` |
| `EXPO_PUBLIC_UI_TEST_MODE` | `true` to seed UI scenarios |
| `EXPO_PUBLIC_UI_TEST_SCENARIO` | e.g. `default`, `new-order`, `active-delivery` |
| `EXPO_PUBLIC_APP_ENV` | `development` \| `preview` \| `production` |
| `EXPO_PUBLIC_API_BASE_URL` | Required when `dataMode=api` |

**Mock OTP:** `482916` (any phone number in mock auth).

**Production guard:** when `EXPO_PUBLIC_APP_ENV=production`, the app **forces** `dataMode=api` and `uiTestMode=false` regardless of other env vars. See [docs/environment.md](docs/environment.md).

Scenario list and workflow notes: [docs/mock-mode.md](docs/mock-mode.md).

## Scripts

| Script | Purpose |
| --- | --- |
| `npm start` | Expo Metro |
| `npm run start:dev-client` | Expo with custom dev client |
| `npm run android` / `ios` / `web` | Open platform |
| `npm run lint` | ESLint |
| `npm run lint:fix` | ESLint auto-fix |
| `npm run format` | Prettier write |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test:types` | Alias for typecheck |

## EAS profiles

See `eas.json`: `development`, `preview`, `native-test`, `production`. Details in [docs/environment.md](docs/environment.md).

## Architecture

UI screens → feature hooks → RTK Query / repositories → mock or API implementations.

Full diagram and data-mode switch: **[docs/architecture.md](docs/architecture.md)**.

## Documentation index

| Doc | Contents |
| --- | --- |
| [docs/architecture.md](docs/architecture.md) | Layers, repos, data mode |
| [docs/design-system.md](docs/design-system.md) | Tokens & `G*` components |
| [docs/mock-mode.md](docs/mock-mode.md) | Scenarios, OTP, seeding |
| [docs/api-contracts.md](docs/api-contracts.md) | Proposed endpoints (backend TBD) |
| [docs/delivery-workflow.md](docs/delivery-workflow.md) | Status machine & cake handling |
| [docs/testing.md](docs/testing.md) | Manual QA & typecheck |
| [docs/environment.md](docs/environment.md) | Env vars & EAS |
| [docs/security.md](docs/security.md) | SecureStore, redaction, guards |

## Expo docs

This project targets **Expo SDK 57**. Prefer [docs.expo.dev/versions/v57.0.0](https://docs.expo.dev/versions/v57.0.0/) when changing native modules or config.
