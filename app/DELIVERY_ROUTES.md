# Delivery & order Stack routes (Phase 2)

Registered in root `app/_layout.tsx` (alongside auth/onboarding):

- `orders` → `app/orders/_layout.tsx`
  - `orders/[id]` — order details
  - `orders/assignment` — new assignment modal + countdown
- `delivery` → `app/delivery/_layout.tsx`
  - `delivery/[id]` hub + pickup / navigate / verify / complete / fail

Quick actions use existing folder routes:

- `/support`, `/emergency`, `/notifications`

Tabs: Home (`home`), Orders, Earnings, Profile — cocoa primary tint.
