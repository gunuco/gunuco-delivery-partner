/** Default packaging checks before confirming pickup. */
export const PACKAGING_CHECKLIST: readonly { id: string; label: string }[] = [
  { id: 'sealed', label: 'Box sealed and intact' },
  { id: 'label', label: 'Order label matches order number' },
  { id: 'cold', label: 'Cold pack included when required' },
  { id: 'upright', label: 'Cake / fragile items packed upright' },
  { id: 'no_damage', label: 'No visible damage or leaks' },
];
