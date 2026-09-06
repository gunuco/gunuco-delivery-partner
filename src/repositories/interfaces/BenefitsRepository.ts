import type { Benefit, InsuranceInfo, Result } from '@/src/types';

export interface BenefitsRepository {
  getBenefits(): Promise<Result<Benefit[]>>;
  getInsurance(): Promise<Result<InsuranceInfo | null>>;
}
