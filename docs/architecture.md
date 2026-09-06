# Architecture

## Layer diagram

```text
┌─────────────────────────────────────────────────────────────┐
│  app/**  (Expo Router screens)                              │
│  design-system G* components                                │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  src/hooks/*  (useAuth, useOrders, useOrderActions, …)      │
│  src/features/*  (routing helpers, formatters)              │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  src/api  (RTK Query baseApi + injected endpoints)          │
│  src/store  (auth / partner / ui slices)                    │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  src/repositories/factory.ts                                │
│       ├─ mock/*   (in-memory MockStore + scenario seeder)   │
│       └─ api/*    (ApiClient stubs until backend ready)     │
└─────────────────────────────────────────────────────────────┘
```

## Data mode switch

`src/config/env.ts` builds `appConfig` from `process.env` and `expo.extra` (see `app.config.ts`).

`src/repositories/factory.ts` returns either mock or API repository implementations based on `appConfig.dataMode`.

```text
EXPO_PUBLIC_APP_ENV=production
        │
        ▼
  force dataMode=api, uiTestMode=false
        │
        ▼
  Api*Repository  →  ApiClient (needs EXPO_PUBLIC_API_BASE_URL)

EXPO_PUBLIC_APP_ENV=development|preview
        │
        ▼
  EXPO_PUBLIC_DATA_MODE=mock|api
        │
   mock → Mock*Repository + optional UI scenario seed
   api  → Api*Repository
```

Screens and hooks must **not** branch on `UI_TEST_MODE`. Seed via repositories / scenario seeder only.

## Key folders

| Path | Role |
| --- | --- |
| `app/` | Routes only — thin screens |
| `src/design-system/` | Theme tokens + reusable UI |
| `src/hooks/` | Feature data/actions for screens |
| `src/repositories/interfaces/` | Contracts shared by mock & API |
| `src/services/` | Session, logger, linking, idempotency |
| `src/config/` | Env, UI test scenarios |
| `src/utils/` | Pure helpers (workflow, money, a11y) |

## Offline / network

- `useNetworkStatus` → `ui.networkStatus` via expo-network
- `NetworkBanner` mounted in `app/_layout.tsx`
- `usePendingActions` — optional in-memory queue for critical offline retries (dedupe required)

## Idempotency

`generateIdempotencyKey()` in `src/services/idempotency.ts`. Pass to critical mutations when the backend accepts `Idempotency-Key`. Repository interfaces do not yet require the key.
