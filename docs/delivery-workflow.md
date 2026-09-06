# Delivery workflow

Canonical transition helpers live in `src/utils/orderWorkflow.ts` (re-exported from `src/features/orders/orderWorkflow.ts`). Screens should use those helpers — do not duplicate status graphs in UI.

## Status machine

Happy path:

```text
ASSIGNED
  → ACCEPTED
  → GOING_TO_PICKUP
  → ARRIVED_AT_PICKUP
  → PICKED_UP
  → GOING_TO_CUSTOMER
  → ARRIVED_AT_CUSTOMER
  → DELIVERY_VERIFICATION
  → DELIVERED
```

Terminal / branch:

- `CANCELLED` — from early states (assigned → arrived at pickup)
- `FAILED` — from most in-progress states via fail flow

`canTransition(from, to)` enforces allowed edges. `getNextPrimaryAction(order)` drives the primary CTA.

## Primary actions by status

| Status | Primary action |
| --- | --- |
| ASSIGNED | ACCEPT |
| ACCEPTED | GO_TO_PICKUP |
| GOING_TO_PICKUP | ARRIVED_PICKUP |
| ARRIVED_AT_PICKUP | CONFIRM_PICKUP |
| PICKED_UP | START_DELIVERY |
| GOING_TO_CUSTOMER | ARRIVED_CUSTOMER |
| ARRIVED_AT_CUSTOMER | VERIFY_DELIVERY |
| DELIVERY_VERIFICATION | COMPLETE |

Reject / fail are secondary where `ORDER_STATUS_META` allows them.

## Cake handling (configurable instructions)

Cake / fragile handling is **instructional checklist content**, not hard-coded business rules in the status machine.

Default pickup packaging checks (`src/constants/packagingChecklist.ts`):

- Box sealed and intact
- Order label matches order number
- Cold pack included when required
- Cake / fragile items packed upright
- No visible damage or leaks

Treat this list as configurable product copy — backend or remote config may eventually override labels. Confirm pickup still advances status via repository mutation; checklist completion is a client UX gate.

## Fail reasons

Options in `src/constants/failReasons.ts` (customer unavailable, incorrect address, refused, unable to contact, access, safety, product damaged, other). Map to API enum when backend confirms.

## Route map

Delivery screens under `app/delivery/[id]/` (pickup, navigate, verify, complete, fail). Assignment UI: `app/orders/assignment.tsx`. Routing helpers: `src/features/orders/deliveryRouting.ts`.
