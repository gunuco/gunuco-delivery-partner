import type { ReferralRepository } from '@/src/repositories/interfaces/ReferralRepository';
import type { Referral, ReferralEntry, Result } from '@/src/types';

import { apiClient } from './ApiClient';

function notConnected<T>(): Result<T> {
  return { ok: false, error: apiClient.notConnectedError() };
}

export class ApiReferralRepository implements ReferralRepository {
  async getReferral(): Promise<Result<Referral>> {
    return notConnected();
  }

  async getHistory(): Promise<Result<ReferralEntry[]>> {
    return notConnected();
  }
}
