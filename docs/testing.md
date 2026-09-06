# Testing

## Automated checks

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint .
npm run format      # prettier --write .  (optional before PR)
```

There is no Jest suite yet; rely on typecheck, lint, and manual / scenario QA.

## UI test scenarios

With mock mode + `EXPO_PUBLIC_UI_TEST_MODE=true`, set `EXPO_PUBLIC_UI_TEST_SCENARIO` (or use EAS `native-test` → `new-order`). Full list: [mock-mode.md](mock-mode.md).

Useful scenarios for regression:

1. `onboarding` — first-run steps
2. `new-order` — assignment accept/reject
3. `active-pickup` → `active-delivery` → `delivery-verification` — happy path
4. `failed-delivery` — fail flow
5. `empty` / `error` — empty & error states
6. `poor-network` — degraded mock latency

Mock login OTP: **`482916`**.

## Manual QA checklist

### Auth & session

- [ ] Request OTP / verify with mock OTP
- [ ] Kill app and relaunch — session restores from SecureStore
- [ ] Logout clears session and returns to auth

### Availability & home

- [ ] Toggle online / offline
- [ ] Home reflects scenario seed (earnings, demand, active order)

### Delivery happy path

- [ ] Accept assigned order
- [ ] Navigate pickup → arrive → packaging checklist → confirm pickup
- [ ] Start delivery → arrive customer → verify → complete
- [ ] Order history shows delivered

### Failure / edge

- [ ] Reject assignment
- [ ] Fail mid-delivery with a reason
- [ ] Airplane mode shows offline banner; critical actions behave safely

### Profile / support / settings

- [ ] Documents, vehicle, bank screens open without crash
- [ ] Support FAQ + ticket list
- [ ] Permissions / legal / about

### Production guard smoke

- [ ] With `EXPO_PUBLIC_APP_ENV=production`, confirm mock scenario flags are ignored (`appConfig.dataMode === 'api'`, `uiTestMode === false`)

## Native builds

```bash
eas build --profile development
eas build --profile preview
eas build --profile native-test
eas build --profile production
```

Verify env injection matches [environment.md](environment.md).
