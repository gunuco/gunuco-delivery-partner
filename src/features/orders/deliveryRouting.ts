import type { Href } from 'expo-router';

import type { Order, OrderStatus } from '@/src/types';
import type { OrderAction } from '@/src/constants/orderStatus';

export function deliveryHubHref(orderId: string): Href {
  return `/delivery/${orderId}`;
}

export function deliveryPickupHref(orderId: string): Href {
  return `/delivery/${orderId}/pickup`;
}

export function deliveryNavigateHref(orderId: string): Href {
  return `/delivery/${orderId}/navigate`;
}

export function deliveryVerifyHref(orderId: string): Href {
  return `/delivery/${orderId}/verify`;
}

export function deliveryCompleteHref(orderId: string): Href {
  return `/delivery/${orderId}/complete`;
}

export function deliveryFailHref(orderId: string): Href {
  return `/delivery/${orderId}/fail`;
}

export function orderDetailsHref(orderId: string): Href {
  return `/orders/${orderId}`;
}

export function assignmentHref(orderId?: string): Href {
  return orderId
    ? ({ pathname: '/orders/assignment', params: { id: orderId } } as Href)
    : '/orders/assignment';
}

/** Best deep-link target for an in-progress order. */
export function getDeliveryDeepLink(order: Order): Href {
  switch (order.status) {
    case 'ASSIGNED':
      return assignmentHref(order.id);
    case 'ACCEPTED':
    case 'GOING_TO_PICKUP':
      return deliveryNavigateHref(order.id);
    case 'ARRIVED_AT_PICKUP':
      return deliveryPickupHref(order.id);
    case 'PICKED_UP':
    case 'GOING_TO_CUSTOMER':
      return deliveryNavigateHref(order.id);
    case 'ARRIVED_AT_CUSTOMER':
    case 'DELIVERY_VERIFICATION':
      return deliveryVerifyHref(order.id);
    case 'DELIVERED':
      return deliveryCompleteHref(order.id);
    case 'FAILED':
    case 'CANCELLED':
      return deliveryFailHref(order.id);
    default:
      return deliveryHubHref(order.id);
  }
}

export function getPrimaryActionLabel(action: OrderAction): string {
  switch (action) {
    case 'ACCEPT':
      return 'Accept order';
    case 'REJECT':
      return 'Decline';
    case 'GO_TO_PICKUP':
      return 'Go to pickup';
    case 'ARRIVED_PICKUP':
      return "I've arrived at pickup";
    case 'CONFIRM_PICKUP':
      return 'Confirm pickup';
    case 'START_DELIVERY':
      return 'Start delivery';
    case 'ARRIVED_CUSTOMER':
      return "I've arrived at customer";
    case 'VERIFY_DELIVERY':
      return 'Verify delivery';
    case 'COMPLETE':
      return 'Complete delivery';
    case 'FAIL':
      return 'Report issue';
    case 'CALL_CUSTOMER':
      return 'Call customer';
    case 'CALL_STORE':
      return 'Call store';
    case 'NAVIGATE':
      return 'Navigate';
    default:
      return action;
  }
}

export function isPickupPhase(status: OrderStatus): boolean {
  return (
    status === 'ACCEPTED' ||
    status === 'GOING_TO_PICKUP' ||
    status === 'ARRIVED_AT_PICKUP'
  );
}

export function isCustomerPhase(status: OrderStatus): boolean {
  return (
    status === 'PICKED_UP' ||
    status === 'GOING_TO_CUSTOMER' ||
    status === 'ARRIVED_AT_CUSTOMER' ||
    status === 'DELIVERY_VERIFICATION'
  );
}
