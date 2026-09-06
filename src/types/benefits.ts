/** GUNUCO partner benefits & insurance domain types */

export type BenefitStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

export interface Benefit {
  id: string;
  title: string;
  description: string;
  status: BenefitStatus;
  provider?: string;
  validUntil?: string;
}

export interface InsuranceInfo {
  provider: string;
  policyNumberMasked?: string;
  coverageSummary?: string;
  status: BenefitStatus;
  validUntil?: string;
}
