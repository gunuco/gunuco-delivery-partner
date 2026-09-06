import type { BenefitsRepository } from '@/src/repositories/interfaces/BenefitsRepository';
import type { Benefit, InsuranceInfo, Result } from '@/src/types';

import { apiClient } from './ApiClient';

function notConnected<T>(): Result<T> {
  return { ok: false, error: apiClient.notConnectedError() };
}

export class ApiBenefitsRepository implements BenefitsRepository {
  async getBenefits(): Promise<Result<Benefit[]>> {
    return notConnected();
  }

  async getInsurance(): Promise<Result<InsuranceInfo | null>> {
    return notConnected();
  }
}
