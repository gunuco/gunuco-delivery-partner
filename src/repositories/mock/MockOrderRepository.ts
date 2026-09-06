import type {
  OrderFilter,
  OrderRepository,
} from '@/src/repositories/interfaces/OrderRepository';
import type {
  DeliveryEarning,
  DeliveryVerification,
  FailReason,
  Order,
  OrderStatus,
  Result,
} from '@/src/types';
import { canTransition } from '@/src/utils/orderWorkflow';
import { logger } from '@/src/services/logger';

import { mockStore } from './MockStore';
import { err, INVALID_STATE, NOT_FOUND, ok, UNAUTHORIZED } from './result';
import { withMockLatency } from './withMockLatency';

const ACTIVE: ReadonlySet<OrderStatus> = new Set([
  'ASSIGNED',
  'ACCEPTED',
  'GOING_TO_PICKUP',
  'ARRIVED_AT_PICKUP',
  'PICKED_UP',
  'GOING_TO_CUSTOMER',
  'ARRIVED_AT_CUSTOMER',
  'DELIVERY_VERIFICATION',
]);

function requireAuth(): Result<true> {
  if (!mockStore.getState().session) {
    return err(UNAUTHORIZED);
  }
  return ok(true);
}

function transition(
  orderId: string,
  to: OrderStatus,
  patch: Partial<Order> = {},
): Result<Order> {
  const existing = mockStore.findOrder(orderId);
  if (!existing) {
    return err(NOT_FOUND('Order', orderId));
  }
  if (!canTransition(existing.status, to) && existing.status !== to) {
    return err(
      INVALID_STATE(
        `Cannot transition ${existing.status} → ${to}`,
        'This action is not available for the current order status.',
      ),
    );
  }
  const updated: Order = {
    ...existing,
    ...patch,
    status: to,
    updatedAt: new Date().toISOString(),
  };
  mockStore.upsertOrder(updated);
  return ok(updated);
}

function buildEarning(order: Order): DeliveryEarning {
  const basePaise = 4500;
  const distancePaise = Math.round(order.distanceKm * 300);
  const surgePaise = 0;
  const incentivePaise = Math.max(
    0,
    order.estimatedEarningsPaise - basePaise - distancePaise,
  );
  const netPaise = basePaise + distancePaise + surgePaise + incentivePaise;
  return {
    id: `earn_${order.id}`,
    orderId: order.id,
    orderNumber: order.orderNumber,
    date: new Date().toISOString(),
    breakdown: {
      basePaise,
      distancePaise,
      surgePaise,
      incentivePaise,
      adjustmentsPaise: 0,
      deductionsPaise: 0,
      netPaise,
    },
    status: 'PENDING',
  };
}

export class MockOrderRepository implements OrderRepository {
  async getOrders(filter?: OrderFilter): Promise<Result<Order[]>> {
    return withMockLatency(() => {
      const auth = requireAuth();
      if (!auth.ok) {
        return err(auth.error);
      }
      let items = [...mockStore.getState().orders];
      if (filter?.partnerId) {
        items = items.filter((o) => o.partnerId === filter.partnerId);
      }
      if (filter?.status) {
        const statuses = Array.isArray(filter.status) ? filter.status : [filter.status];
        items = items.filter((o) => statuses.includes(o.status));
      }
      if (filter?.includeHistory === false) {
        items = items.filter((o) => ACTIVE.has(o.status));
      }
      return ok(items);
    });
  }

  async getOrder(id: string): Promise<Result<Order>> {
    return withMockLatency(() => {
      const auth = requireAuth();
      if (!auth.ok) {
        return err(auth.error);
      }
      const order = mockStore.findOrder(id);
      if (!order) {
        return err(NOT_FOUND('Order', id));
      }
      return ok(order);
    });
  }

  async getActiveOrder(): Promise<Result<Order | null>> {
    return withMockLatency(() => {
      const auth = requireAuth();
      if (!auth.ok) {
        return err(auth.error);
      }
      const active =
        mockStore.getState().orders.find((o) => ACTIVE.has(o.status)) ?? null;
      return ok(active);
    });
  }

  async acceptOrder(orderId: string): Promise<Result<Order>> {
    return withMockLatency(() => {
      const auth = requireAuth();
      if (!auth.ok) {
        return err(auth.error);
      }
      const existing = mockStore.findOrder(orderId);
      if (!existing) {
        return err(NOT_FOUND('Order', orderId));
      }
      if (existing.status !== 'ASSIGNED') {
        return err(
          INVALID_STATE(
            `Order ${orderId} is not ASSIGNED`,
            'Only newly assigned orders can be accepted.',
          ),
        );
      }
      const otherActive = mockStore
        .getState()
        .orders.find((o) => o.id !== orderId && ACTIVE.has(o.status) && o.status !== 'ASSIGNED');
      if (otherActive) {
        return err(
          INVALID_STATE(
            'Another order is already active',
            'Finish your current delivery before accepting a new order.',
          ),
        );
      }

      const now = new Date().toISOString();
      const accepted: Order = {
        ...existing,
        status: 'ACCEPTED',
        acceptedAt: now,
        updatedAt: now,
        partnerId: mockStore.getState().partner.id,
      };
      mockStore.upsertOrder(accepted);
      // Advance to en-route pickup (typical partner UX after accept)
      const going = {
        ...accepted,
        status: 'GOING_TO_PICKUP' as const,
        updatedAt: new Date().toISOString(),
      };
      mockStore.upsertOrder(going);
      mockStore.patchPartner({ availability: 'BUSY' });
      logger.info('Order accepted (mock)', {
        orderId,
        orderNumber: going.orderNumber,
      });
      return ok(going);
    });
  }

  async rejectOrder(orderId: string, reason?: string): Promise<Result<Order>> {
    return withMockLatency(() => {
      const auth = requireAuth();
      if (!auth.ok) {
        return err(auth.error);
      }
      void reason;
      const existing = mockStore.findOrder(orderId);
      if (!existing) {
        return err(NOT_FOUND('Order', orderId));
      }
      if (existing.status !== 'ASSIGNED') {
        return err(
          INVALID_STATE(
            `Order ${orderId} cannot be rejected`,
            'Only newly assigned orders can be rejected.',
          ),
        );
      }
      const updated: Order = {
        ...existing,
        status: 'CANCELLED',
        updatedAt: new Date().toISOString(),
      };
      mockStore.upsertOrder(updated);
      logger.info('Order rejected (mock)', { orderId, orderNumber: updated.orderNumber });
      return ok(updated);
    });
  }

  async goToPickup(orderId: string): Promise<Result<Order>> {
    return withMockLatency(() => {
      const auth = requireAuth();
      if (!auth.ok) {
        return err(auth.error);
      }
      const result = transition(orderId, 'GOING_TO_PICKUP');
      if (result.ok) {
        mockStore.patchPartner({ availability: 'BUSY' });
      }
      return result;
    });
  }

  async markArrivedAtPickup(orderId: string): Promise<Result<Order>> {
    return withMockLatency(() => {
      const auth = requireAuth();
      if (!auth.ok) {
        return err(auth.error);
      }
      return transition(orderId, 'ARRIVED_AT_PICKUP');
    });
  }

  async confirmPickup(orderId: string): Promise<Result<Order>> {
    return withMockLatency(() => {
      const auth = requireAuth();
      if (!auth.ok) {
        return err(auth.error);
      }
      return transition(orderId, 'PICKED_UP', {
        pickedUpAt: new Date().toISOString(),
      });
    });
  }

  async startDelivery(orderId: string): Promise<Result<Order>> {
    return withMockLatency(() => {
      const auth = requireAuth();
      if (!auth.ok) {
        return err(auth.error);
      }
      return transition(orderId, 'GOING_TO_CUSTOMER');
    });
  }

  async markArrivedAtCustomer(orderId: string): Promise<Result<Order>> {
    return withMockLatency(() => {
      const auth = requireAuth();
      if (!auth.ok) {
        return err(auth.error);
      }
      return transition(orderId, 'ARRIVED_AT_CUSTOMER');
    });
  }

  async verifyDelivery(
    orderId: string,
    verification: DeliveryVerification,
  ): Promise<Result<Order>> {
    return withMockLatency(() => {
      const auth = requireAuth();
      if (!auth.ok) {
        return err(auth.error);
      }
      // OTP value must never be logged
      logger.info('Delivery verification started (mock)', {
        orderId,
        method: verification.method,
      });
      return transition(orderId, 'DELIVERY_VERIFICATION', {
        verificationMethod: verification.method,
      });
    });
  }

  async completeDelivery(orderId: string): Promise<Result<Order>> {
    return withMockLatency(() => {
      const auth = requireAuth();
      if (!auth.ok) {
        return err(auth.error);
      }
      const existing = mockStore.findOrder(orderId);
      if (!existing) {
        return err(NOT_FOUND('Order', orderId));
      }

      // Allow complete from ARRIVED_AT_CUSTOMER by auto-passing verification
      let current = existing;
      if (current.status === 'ARRIVED_AT_CUSTOMER') {
        const toVerify = transition(orderId, 'DELIVERY_VERIFICATION', {
          verificationMethod: current.verificationMethod ?? 'OTP',
        });
        if (!toVerify.ok) {
          return toVerify;
        }
        current = toVerify.data;
      }

      const result = transition(current.id, 'DELIVERED', {
        deliveredAt: new Date().toISOString(),
      });
      if (!result.ok) {
        return result;
      }

      const earning = buildEarning(result.data);
      mockStore.addEarning(earning);
      mockStore.updateIncentiveProgress(1, earning.breakdown.netPaise);
      mockStore.bumpPerformanceOnComplete(result.data.distanceKm);
      mockStore.patchPartner({ availability: 'ONLINE' });
      logger.info('Delivery completed (mock)', {
        orderId,
        orderNumber: result.data.orderNumber,
        netPaise: earning.breakdown.netPaise,
      });
      return result;
    });
  }

  async failDelivery(orderId: string, reason: FailReason): Promise<Result<Order>> {
    return withMockLatency(() => {
      const auth = requireAuth();
      if (!auth.ok) {
        return err(auth.error);
      }
      const existing = mockStore.findOrder(orderId);
      if (!existing) {
        return err(NOT_FOUND('Order', orderId));
      }
      if (!canTransition(existing.status, 'FAILED')) {
        return err(
          INVALID_STATE(
            `Cannot fail order from ${existing.status}`,
            'This order can no longer be marked as failed.',
          ),
        );
      }
      const updated: Order = {
        ...existing,
        status: 'FAILED',
        failReason: reason,
        failedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockStore.upsertOrder(updated);
      mockStore.patchPartner({ availability: 'ONLINE' });
      logger.info('Delivery failed (mock)', {
        orderId,
        orderNumber: updated.orderNumber,
        reason,
      });
      return ok(updated);
    });
  }
}
