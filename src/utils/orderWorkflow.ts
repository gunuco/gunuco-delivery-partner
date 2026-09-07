import { ORDER_STATUS_META, type OrderAction } from '../constants/orderStatus';
import type { Order, OrderStatus } from '../types/order';

/** Happy-path progression used by progress steppers */
const PROGRESS_STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'ASSIGNED', label: 'Assigned' },
  { key: 'ACCEPTED', label: 'Accepted' },
  { key: 'GOING_TO_PICKUP', label: 'To pickup' },
  { key: 'ARRIVED_AT_PICKUP', label: 'At pickup' },
  { key: 'PICKED_UP', label: 'Picked up' },
  { key: 'GOING_TO_CUSTOMER', label: 'To customer' },
  { key: 'ARRIVED_AT_CUSTOMER', label: 'At customer' },
  { key: 'DELIVERY_VERIFICATION', label: 'Verified' },
  { key: 'DELIVERED', label: 'Delivered' },
];

const PRIMARY_ACTION_BY_STATUS: Partial<Record<OrderStatus, OrderAction>> = {
  ASSIGNED: 'ACCEPT',
  ACCEPTED: 'GO_TO_PICKUP',
  GOING_TO_PICKUP: 'ARRIVED_PICKUP',
  ARRIVED_AT_PICKUP: 'CONFIRM_PICKUP',
  PICKED_UP: 'START_DELIVERY',
  GOING_TO_CUSTOMER: 'ARRIVED_CUSTOMER',
  ARRIVED_AT_CUSTOMER: 'VERIFY_DELIVERY',
  DELIVERY_VERIFICATION: 'COMPLETE',
};

/**
 * Valid status transitions for the GUNUCO delivery status machine.
 * FAIL / CANCELLED are allowed from most in-progress states.
 */
const ALLOWED_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  ASSIGNED: ['ACCEPTED', 'CANCELLED', 'FAILED'],
  ACCEPTED: ['GOING_TO_PICKUP', 'CANCELLED', 'FAILED'],
  GOING_TO_PICKUP: ['ARRIVED_AT_PICKUP', 'CANCELLED', 'FAILED'],
  ARRIVED_AT_PICKUP: ['PICKED_UP', 'CANCELLED', 'FAILED'],
  PICKED_UP: ['GOING_TO_CUSTOMER', 'FAILED'],
  GOING_TO_CUSTOMER: ['ARRIVED_AT_CUSTOMER', 'FAILED'],
  ARRIVED_AT_CUSTOMER: ['DELIVERY_VERIFICATION', 'FAILED'],
  DELIVERY_VERIFICATION: ['DELIVERED', 'FAILED'],
  DELIVERED: [],
  FAILED: [],
  CANCELLED: [],
};

export interface OrderProgressStep {
  key: OrderStatus;
  label: string;
  completed: boolean;
  current: boolean;
}

export function getAvailableOrderActions(order: Order): OrderAction[] {
  return [...(ORDER_STATUS_META[order.status]?.allowedActions ?? [])];
}

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  if (from === to) {
    return false;
  }
  return (ALLOWED_TRANSITIONS[from] ?? []).includes(to);
}

export function getNextPrimaryAction(order: Order): OrderAction | null {
  const primary = PRIMARY_ACTION_BY_STATUS[order.status];
  if (!primary) {
    return null;
  }
  const available = getAvailableOrderActions(order);
  return available.includes(primary) ? primary : null;
}

export function getOrderProgressSteps(status: OrderStatus): OrderProgressStep[] {
  if (status === 'FAILED' || status === 'CANCELLED') {
    return PROGRESS_STEPS.map((step, index) => ({
      key: step.key,
      label: step.label,
      completed: false,
      current: index === 0,
    }));
  }

  const currentIndex = PROGRESS_STEPS.findIndex((step) => step.key === status);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;

  return PROGRESS_STEPS.map((step, index) => ({
    key: step.key,
    label: step.label,
    completed: index < safeIndex,
    current: index === safeIndex,
  }));
}
