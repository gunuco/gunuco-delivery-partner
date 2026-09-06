import type { OrderStatus } from '../types/order';

export type OrderAction =
  | 'ACCEPT'
  | 'REJECT'
  | 'GO_TO_PICKUP'
  | 'ARRIVED_PICKUP'
  | 'CONFIRM_PICKUP'
  | 'START_DELIVERY'
  | 'ARRIVED_CUSTOMER'
  | 'VERIFY_DELIVERY'
  | 'COMPLETE'
  | 'FAIL'
  | 'CALL_CUSTOMER'
  | 'CALL_STORE'
  | 'NAVIGATE';

export interface OrderStatusMeta {
  title: string;
  description: string;
  /** Icon key for the design system icon map */
  icon: string;
  colorToken: string;
  allowedActions: OrderAction[];
}

export const ORDER_STATUS_META: Record<OrderStatus, OrderStatusMeta> = {
  ASSIGNED: {
    title: 'New order',
    description: 'A GUNUCO order has been assigned. Accept or decline.',
    icon: 'orderAssigned',
    colorToken: 'status.info',
    allowedActions: ['ACCEPT', 'REJECT', 'CALL_STORE'],
  },
  ACCEPTED: {
    title: 'Accepted',
    description: 'Order accepted. Head to the pickup hub when ready.',
    icon: 'orderAccepted',
    colorToken: 'status.success',
    allowedActions: ['GO_TO_PICKUP', 'CALL_STORE', 'NAVIGATE', 'FAIL'],
  },
  GOING_TO_PICKUP: {
    title: 'Going to pickup',
    description: 'En route to the GUNUCO pickup location.',
    icon: 'goingToPickup',
    colorToken: 'status.info',
    allowedActions: ['ARRIVED_PICKUP', 'NAVIGATE', 'CALL_STORE', 'FAIL'],
  },
  ARRIVED_AT_PICKUP: {
    title: 'Arrived at pickup',
    description: 'Confirm items and cake handling checklist before pickup.',
    icon: 'arrivedPickup',
    colorToken: 'status.warning',
    allowedActions: ['CONFIRM_PICKUP', 'CALL_STORE', 'FAIL'],
  },
  PICKED_UP: {
    title: 'Picked up',
    description: 'Order collected. Start delivery to the customer.',
    icon: 'pickedUp',
    colorToken: 'status.success',
    allowedActions: ['START_DELIVERY', 'CALL_CUSTOMER', 'FAIL'],
  },
  GOING_TO_CUSTOMER: {
    title: 'Going to customer',
    description: 'Delivering to the customer address.',
    icon: 'goingToCustomer',
    colorToken: 'status.info',
    allowedActions: ['ARRIVED_CUSTOMER', 'NAVIGATE', 'CALL_CUSTOMER', 'FAIL'],
  },
  ARRIVED_AT_CUSTOMER: {
    title: 'Arrived at customer',
    description: 'Begin delivery verification with the customer.',
    icon: 'arrivedCustomer',
    colorToken: 'status.warning',
    allowedActions: ['VERIFY_DELIVERY', 'CALL_CUSTOMER', 'FAIL'],
  },
  DELIVERY_VERIFICATION: {
    title: 'Verification',
    description: 'Complete OTP, QR, photo, or signature verification.',
    icon: 'verification',
    colorToken: 'status.warning',
    allowedActions: ['COMPLETE', 'FAIL', 'CALL_CUSTOMER'],
  },
  DELIVERED: {
    title: 'Delivered',
    description: 'Order successfully delivered.',
    icon: 'delivered',
    colorToken: 'status.success',
    allowedActions: [],
  },
  FAILED: {
    title: 'Failed',
    description: 'Delivery could not be completed.',
    icon: 'failed',
    colorToken: 'status.danger',
    allowedActions: ['CALL_CUSTOMER', 'CALL_STORE'],
  },
  CANCELLED: {
    title: 'Cancelled',
    description: 'This order was cancelled.',
    icon: 'cancelled',
    colorToken: 'status.neutral',
    allowedActions: [],
  },
};
