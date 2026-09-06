# Security

## Session storage

Auth tokens and partner id are persisted with **expo-secure-store** (`src/services/session.ts`). Do not store access/refresh tokens in AsyncStorage, Redux persist, or logs.

## Logging

`src/services/logger.ts`:

- Redacts keys matching otp / token / password / account / ifsc / phone / bank / document patterns
- Redacts OTP-like and token-like strings in free text
- **Warns** if meta objects contain keys matching `otp|token|password|ifsc|account`

Never `console.log` raw OTP responses or Authorization headers.

## Production guards

`src/config/env.ts` forces:

- `dataMode = 'api'`
- `uiTestMode = false`

when `EXPO_PUBLIC_APP_ENV=production`. Mock OTP and scenario seeding must not ship in production.

## Location privacy

Location is used for assignment and navigation while the partner is online / on delivery. Permission copy in `app.json` explains purpose. Do not log precise coordinates in analytics or logger meta without a clear product need and redaction policy.

## Idempotency

Critical order mutations should send `Idempotency-Key` when the backend supports it (`generateIdempotencyKey`). Prevents duplicate accept/complete on flaky networks.

## Offline queue

`usePendingActions` is in-memory only. Deduplicate with stable `dedupeKey`. Do not enqueue secrets (OTP, tokens, bank fields) in pending payloads.

## Checklist for PRs

- [ ] No secrets in source or docs examples
- [ ] No OTP/token logging
- [ ] SecureStore for session only
- [ ] Production profile uses API mode
- [ ] New mutations consider idempotency + offline dedupe
