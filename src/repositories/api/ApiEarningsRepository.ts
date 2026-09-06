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

import { apiClient } from './ApiClient';

function notConnected<T>(): Result<T> {
  return { ok: false, error: apiClient.notConnectedError() };
}

export class ApiEarningsRepository implements EarningsRepository {
  async getSummary(): Promise<Result<EarningsSummary>> {
    return notConnected();
  }

  async getBreakdown(_orderId: string): Promise<Result<EarningsBreakdown>> {
    return notConnected();
  }

  async getDeliveryEarnings(
    _filter?: EarningsFilter,
  ): Promise<Result<DeliveryEarning[]>> {
    return notConnected();
  }

  async getPayouts(): Promise<Result<Payout[]>> {
    return notConnected();
  }
}
