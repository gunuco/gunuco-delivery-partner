import type { Address, Order, OrderItem } from '@/src/types';
import { formatPaise } from '@/src/utils/money';

export function formatAddress(address: Address): string {
  return [address.line1, address.line2, address.area, address.city, address.pincode]
    .filter(Boolean)
    .join(', ');
}

export function formatDistanceKm(km: number): string {
  if (!Number.isFinite(km)) return '—';
  return `${km.toFixed(1)} km`;
}

export function formatEtaMinutes(minutes: number): string {
  if (!Number.isFinite(minutes)) return '—';
  return `${Math.max(0, Math.round(minutes))} min`;
}

export function formatOrderEarnings(order: Order): string {
  return formatPaise(order.estimatedEarningsPaise);
}

export function getItemsCount(order: Order): number {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}

export function collectHandlingInstructions(items: OrderItem[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of items) {
    for (const instruction of item.handlingInstructions ?? []) {
      const normalized = instruction.trim();
      if (!normalized || seen.has(normalized)) continue;
      seen.add(normalized);
      result.push(normalized);
    }
  }
  return result;
}

export function hasCakeOrFragileItems(items: OrderItem[]): boolean {
  return items.some(
    (item) =>
      item.isFragile ||
      item.isMultiTier === true ||
      item.requiresRefrigeration === true ||
      /cake/i.test(item.name),
  );
}

export const ACTIVE_ORDER_STATUSES = [
  'ASSIGNED',
  'ACCEPTED',
  'GOING_TO_PICKUP',
  'ARRIVED_AT_PICKUP',
  'PICKED_UP',
  'GOING_TO_CUSTOMER',
  'ARRIVED_AT_CUSTOMER',
  'DELIVERY_VERIFICATION',
] as const;

export type OrdersSegment = 'active' | 'completed' | 'failed';

export function filterOrdersBySegment(orders: Order[], segment: OrdersSegment): Order[] {
  switch (segment) {
    case 'active':
      return orders.filter((order) =>
        (ACTIVE_ORDER_STATUSES as readonly string[]).includes(order.status),
      );
    case 'completed':
      return orders.filter((order) => order.status === 'DELIVERED');
    case 'failed':
      return orders.filter(
        (order) => order.status === 'FAILED' || order.status === 'CANCELLED',
      );
    default:
      return orders;
  }
}
