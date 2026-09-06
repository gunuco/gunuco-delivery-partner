# Mock mode

## Env flags

| Variable | Effect |
| --- | --- |
| `EXPO_PUBLIC_DATA_MODE=mock` | Repository factory returns `Mock*` implementations |
| `EXPO_PUBLIC_UI_TEST_MODE=true` | Scenario seeder runs at mock bootstrap |
| `EXPO_PUBLIC_UI_TEST_SCENARIO` | Which seed profile to apply (see list below) |
| `EXPO_PUBLIC_APP_ENV` | Must **not** be `production` if you need mock |

Production always disables mock — see [environment.md](environment.md).

Config entry point: `src/config/env.ts`. Scenario definitions: `src/config/scenarios.ts`. Seeder: `src/repositories/mock/scenarioSeeder.ts`.

## Mock OTP

**OTP code: `482916`**

Mock auth accepts this OTP for any phone number. Never log the OTP value (`logger` redacts sensitive keys).

Constant: `MOCK_OTP` in `src/repositories/mock/seedData.ts`.

## Stateful workflow

Mock order mutations update an in-memory `MockStore`. Accepting an order, confirming pickup, verifying delivery, etc. advance status according to `src/utils/orderWorkflow.ts`. Reseeding a scenario resets store state.

## UI test scenarios

Set `EXPO_PUBLIC_UI_TEST_SCENARIO` to one of:

| Scenario | Intent |
| --- | --- |
| `default` | Approved, online, typical dashboard |
| `onboarding` | Mid-onboarding partner |
| `pending-verification` | Under review |
| `approved` | Approved, offline, ready to go online |
| `offline` | Approved, offline |
| `online` | Approved, online |
| `new-order` | Assigned order waiting accept |
| `active-pickup` | Going to / at pickup |
| `active-delivery` | En route to customer |
| `delivery-verification` | Verify at door |
| `completed` | Delivered history |
| `failed-delivery` | Failed terminal state |
| `high-demand` | Elevated demand zones |
| `earnings` | Earnings-focused seed |
| `incentives` | Incentives-focused seed |
| `empty` / `no-orders` | Empty lists |
| `error` | Forced error responses |
| `support` | Support tickets present |
| `poor-network` | Degraded latency flag |

`native-test` EAS profile seeds `new-order` for assignment UI checks.

## In-app scenario picker

With `EXPO_PUBLIC_UI_TEST_MODE=true` and `DATA_MODE=mock` (non-production):

**Settings → UI Test Scenarios** lists every scenario above.

Tap a row to reseed the mock store, reset RTK Query cache, and navigate into that state (e.g. `new-order` → assignment screen). No need to restart Metro or change `.env` for each scenario.

## Do not

- Branch screens on `uiTestMode` or scenario name.
- Hard-code scenario data in UI components.
- Ship production with mock mode (guarded in `env.ts`).
