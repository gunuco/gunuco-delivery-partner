import { theme } from '@/src/design-system';

/** Minimum interactive touch target (iOS HIG / Material guidance). */
export const MIN_TOUCH_TARGET = theme.components.minTouchTarget;

export type A11yLabelProps = {
  accessible: true;
  accessibilityLabel: string;
  accessibilityHint?: string;
};

/** Spreads a clear accessibility label (and optional hint) onto a host view. */
export function a11yLabel(label: string, hint?: string): A11yLabelProps {
  if (hint) {
    return {
      accessible: true,
      accessibilityLabel: label,
      accessibilityHint: hint,
    };
  }
  return {
    accessible: true,
    accessibilityLabel: label,
  };
}

/** Label for icon-only controls that would otherwise lack text. */
export function a11yIconLabel(action: string, context?: string): A11yLabelProps {
  const label = context ? `${action}, ${context}` : action;
  return a11yLabel(label);
}

/** Marks decorative / non-interactive chrome so it is skipped by screen readers. */
export function a11yHide(): { accessible: false; importantForAccessibility: 'no' } {
  return {
    accessible: false,
    importantForAccessibility: 'no',
  };
}
