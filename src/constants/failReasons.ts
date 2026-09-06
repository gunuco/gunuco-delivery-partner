import type { FailReason } from '@/src/types';

export const FAIL_REASON_OPTIONS: readonly {
  value: FailReason;
  label: string;
  description: string;
}[] = [
  {
    value: 'CUSTOMER_UNAVAILABLE',
    label: 'Customer unavailable',
    description: 'No one available to receive the order',
  },
  {
    value: 'INCORRECT_ADDRESS',
    label: 'Incorrect address',
    description: 'Delivery address looks wrong or incomplete',
  },
  {
    value: 'CUSTOMER_REFUSED',
    label: 'Customer refused',
    description: 'Customer declined to accept the order',
  },
  {
    value: 'UNABLE_TO_CONTACT',
    label: 'Unable to contact',
    description: 'Could not reach the customer by phone',
  },
  {
    value: 'ACCESS_ISSUE',
    label: 'Access issue',
    description: 'Gate, building, or entry access blocked',
  },
  {
    value: 'SAFETY_ISSUE',
    label: 'Safety issue',
    description: 'Unsafe to complete delivery',
  },
  {
    value: 'PRODUCT_DAMAGED',
    label: 'Product damaged',
    description: 'Items damaged before handoff',
  },
  {
    value: 'OTHER',
    label: 'Other',
    description: 'Another reason — add notes',
  },
];

export function getFailReasonLabel(reason: FailReason): string {
  return FAIL_REASON_OPTIONS.find((option) => option.value === reason)?.label ?? reason;
}
