import type {
  EarningsFilter,
  EarningsRepository,
} from '@/src/repositories/interfaces/EarningsRepository';
import type {
  DeliveryEarning,
  EarningsBreakdown,
  EarningsSummary,
  Payout,
  Result,
} from '@/src/types';

import { mockStore } from './MockStore';
import { err, NOT_FOUND, ok, UNAUTHORIZED } from './result';
import { withMockLatency } from './withMockLatency';

function requireAuth(): Result<true> {
  if (!mockStore.getState().session) {
    return err(UNAUTHORIZED);
  }
  return ok(true);
}

function isSameDay(iso: string, ref: Date): boolean {
  const d = new Date(iso);
  return (
    d.getFullYear() === ref.getFullYear() &&
    d.getMonth() === ref.getMonth() &&
    d.getDate() === ref.getDate()
  );
}

function startOfWeek(ref: Date): Date {
  const d = new Date(ref);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - diff);
  return d;
}

export class MockEarningsRepository implements EarningsRepository {
  async getSummary(): Promise<Result<EarningsSummary>> {
    return withMockLatency(() => {
      const auth = requireAuth();
      if (!auth.ok) {
        return err(auth.error);
      }
      const now = new Date();
      const weekStart = startOfWeek(now);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const earnings = mockStore.getState().earnings;
      const orders = mockStore.getState().orders;

      let todayPaise = 0;
      let weekPaise = 0;
      let monthPaise = 0;
      let totalPaise = 0;
      let todayOrders = 0;
      let todayDistanceKm = 0;

      for (const e of earnings) {
        const net = e.breakdown.netPaise;
        totalPaise += net;
        const date = new Date(e.date);
        if (isSameDay(e.date, now)) {
          todayPaise += net;
          todayOrders += 1;
        }
        if (date >= weekStart) {
          weekPaise += net;
        }
        if (date >= monthStart) {
          monthPaise += net;
        }
      }

      for (const o of orders) {
        if (o.deliveredAt && isSameDay(o.deliveredAt, now)) {
          todayDistanceKm += o.distanceKm;
        }
      }

      return ok<EarningsSummary>({
        todayPaise,
        weekPaise,
        monthPaise,
        totalPaise,
        todayOrders,
        todayDistanceKm: Math.round(todayDistanceKm * 10) / 10,
      });
    });
  }

  async getBreakdown(orderId: string): Promise<Result<EarningsBreakdown>> {
    return withMockLatency(() => {
      const auth = requireAuth();
      if (!auth.ok) {
        return err(auth.error);
      }
      const earning = mockStore
        .getState()
        .earnings.find((e) => e.orderId === orderId);
      if (!earning) {
        return err(NOT_FOUND('Earning', orderId));
      }
      return ok({ ...earning.breakdown });
    });
  }

  async getDeliveryEarnings(
    filter?: EarningsFilter,
  ): Promise<Result<DeliveryEarning[]>> {
    return withMockLatency(() => {
      const auth = requireAuth();
      if (!auth.ok) {
        return err(auth.error);
      }
      let items = [...mockStore.getState().earnings];
      if (filter?.status) {
        items = items.filter((e) => e.status === filter.status);
      }
      if (filter?.fromDate) {
        const from = new Date(filter.fromDate).getTime();
        items = items.filter((e) => new Date(e.date).getTime() >= from);
      }
      if (filter?.toDate) {
        const to = new Date(filter.toDate).getTime();
        items = items.filter((e) => new Date(e.date).getTime() <= to);
      }
      return ok(items);
    });
  }

  async getPayouts(): Promise<Result<Payout[]>> {
    return withMockLatency(() => {
      const auth = requireAuth();
      if (!auth.ok) {
        return err(auth.error);
      }
      return ok([...mockStore.getState().payouts]);
    });
  }
}
