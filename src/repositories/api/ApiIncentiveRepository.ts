import type { IncentiveRepository } from '@/src/repositories/interfaces/IncentiveRepository';
import type { Incentive, Result } from '@/src/types';

import { apiClient } from './ApiClient';

function notConnected<T>(): Result<T> {
  return { ok: false, error: apiClient.notConnectedError() };
}

export class ApiIncentiveRepository implements IncentiveRepository {
  async getActive(): Promise<Result<Incentive[]>> {
    return notConnected();
  }

  async getAll(): Promise<Result<Incentive[]>> {
    return notConnected();
  }

  async getById(_id: string): Promise<Result<Incentive>> {
    return notConnected();
  }
}
