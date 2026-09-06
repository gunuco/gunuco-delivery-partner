/**
 * Money helpers — GUNUCO stores amounts as integer paise.
 * 100 paise = ₹1. Do not invent pricing; only format display values.
 */

const INR = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Formats paise as a display string, e.g. 14250 → "₹142.50" */
export function paiseToRupeesDisplay(paise: number): string {
  const safe = Number.isFinite(paise) ? Math.trunc(paise) : 0;
  return INR.format(safe / 100);
}

/** Alias-style formatter for lists and cards */
export function formatPaise(paise: number): string {
  return paiseToRupeesDisplay(paise);
}

/** Converts rupees (may include decimals) to integer paise */
export function rupeesToPaise(rupees: number): number {
  if (!Number.isFinite(rupees)) {
    return 0;
  }
  return Math.round(rupees * 100);
}
