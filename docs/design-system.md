# Design system

Source: `src/design-system/`.

Import from the barrel:

```ts
import { GButton, GText, theme } from '@/src/design-system';
```

## Tokens (`theme`)

| Token group | File | Notes |
| --- | --- | --- |
| `colors` | `theme/colors.ts` | Primary cocoa `#5C3A21`, accent rose-gold, status maps |
| `typography` | `theme/typography.ts` | Variants: `display`, `h1`–`h3`, `title`, `body`, `bodyBold`, `caption`, `label`, `button` |
| `spacing` | `theme/spacing.ts` | Numeric scale keys |
| `radius` | `theme/radius.ts` | Corner radii |
| `shadows` | `theme/shadows.ts` | Elevation presets |
| `components` | `theme/components.ts` | Button heights, `minTouchTarget: 44`, avatars |

Prefer `theme.*` over hard-coded values in feature screens.

## Accessibility helpers

`src/utils/accessibility.ts`:

- `MIN_TOUCH_TARGET` — re-exports `theme.components.minTouchTarget`
- `a11yLabel(label, hint?)` — props for interactive hosts
- `a11yIconLabel(action, context?)` — icon-only controls
- `a11yHide()` — decorative chrome

## Components (`G*`)

| Component | Use |
| --- | --- |
| `GText` / `GHeading` | Typography |
| `GButton` / `GIconButton` | Actions (min touch target) |
| `GInput` | Text fields |
| `GCheckbox` / `GSwitch` / `GChip` | Selection |
| `GCard` / `GListRow` / `GSectionHeader` | Structure |
| `GHeader` | Screen header |
| `GOrderCard` / `GEarningsCard` / `GDocumentCard` / `GMapCard` / `GStatCard` | Domain cards |
| `GStatusBadge` / `GBadge` | Status chips |
| `GStepIndicator` / `GProgress` | Progress |
| `GAvatar` / `GIcon` | Media / icons |
| `GLoader` / `GSkeleton` | Loading |
| `GEmptyState` / `GErrorState` | Empty / error |
| `GModal` / `GConfirmationDialog` | Overlays |
| `GToast` (+ `ToastProvider`) | Toasts |
| `GDivider` | Separators |

## Usage guidelines

1. Screens stay thin — compose `G*` + hooks; avoid one-off styled primitives when a `G*` exists.
2. Keep brand colors from tokens; do not introduce a second palette.
3. Interactive controls should meet `MIN_TOUCH_TARGET` (already enforced on several `G*` controls).
4. Icon-only buttons need `accessibilityLabel` / `a11yIconLabel`.
