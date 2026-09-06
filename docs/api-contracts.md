# API contracts

> **PROPOSED / BACKEND TO CONFIRM**  
> Paths and payloads below are client-side proposals derived from repository interfaces and RTK Query endpoints. Nothing here is a committed backend contract until confirmed.

Base URL: `EXPO_PUBLIC_API_BASE_URL`. Auth: Bearer access token from SecureStore (except auth bootstrap). Prefer `Idempotency-Key` on critical mutations when supported — see `src/services/idempotency.ts`.

## Auth

| Method | Path (proposed) | Notes |
| --- | --- | --- |
| POST | `/auth/otp/request` | `{ phone }` — never log OTP |
| POST | `/auth/otp/verify` | `{ phone, otp }` → session tokens |
| POST | `/auth/refresh` | refresh token rotation |
| POST | `/auth/logout` | invalidate session |

## Partner

| Method | Path (proposed) | Notes |
| --- | --- | --- |
| GET | `/partner/me` | Profile + status + availability |
| PATCH | `/partner/me` | Personal details update |
| POST | `/partner/availability` | `{ availability: ONLINE \| OFFLINE \| … }` |
| GET/PUT | `/partner/onboarding` | Step progress |
| GET/PUT | `/partner/vehicle` | Vehicle details |
| GET/PUT | `/partner/bank` | Bank details — sensitive |
| GET/POST | `/partner/documents` | List / upload metadata |
| GET | `/partner/benefits` | Benefits catalog |
| GET | `/partner/referral` | Referral code / stats |

## Orders / delivery

| Method | Path (proposed) | Notes |
| --- | --- | --- |
| GET | `/orders` | Filter by status / history |
| GET | `/orders/:id` | Detail |
| GET | `/orders/active` | Current active order or null |
| POST | `/orders/:id/accept` | **Idempotency-Key recommended** |
| POST | `/orders/:id/reject` | Optional reason |
| POST | `/orders/:id/go-to-pickup` | |
| POST | `/orders/:id/arrived-pickup` | |
| POST | `/orders/:id/confirm-pickup` | Packaging checklist client-side |
| POST | `/orders/:id/start-delivery` | |
| POST | `/orders/:id/arrived-customer` | |
| POST | `/orders/:id/verify` | OTP / photo / signature payload |
| POST | `/orders/:id/complete` | **Idempotency-Key recommended** |
| POST | `/orders/:id/fail` | Fail reason enum |

## Earnings & incentives

| Method | Path (proposed) | Notes |
| --- | --- | --- |
| GET | `/earnings/summary` | Period summary |
| GET | `/earnings/breakdown` | By day / delivery |
| GET | `/earnings/payouts` | Payout history |
| GET | `/incentives` | Active / available |
| GET | `/incentives/:id` | Detail |
| GET | `/performance` | Scores / metrics |

## Shifts & demand

| Method | Path (proposed) | Notes |
| --- | --- | --- |
| GET | `/shifts` | Upcoming / history |
| GET | `/shifts/:id` | Detail |
| GET | `/demand/zones` | Heat / demand levels |

## Support & notifications

| Method | Path (proposed) | Notes |
| --- | --- | --- |
| GET | `/notifications` | Inbox |
| POST | `/notifications/:id/read` | Mark read |
| GET | `/support/faq` | FAQ |
| GET/POST | `/support/tickets` | List / create |
| GET | `/support/tickets/:id` | Thread |

## Client status

- Mock repos implement behavior for local UI.
- `Api*Repository` / `ApiClient` throw `API not configured` until `EXPO_PUBLIC_API_BASE_URL` and real fetch wiring land.
- Confirm error shape (`code`, `message`, `userMessage`, `retryable`) against `AppError` in `src/types`.
