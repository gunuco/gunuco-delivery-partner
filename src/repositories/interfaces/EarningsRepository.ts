import type {
  DeliveryEarning,
  EarningsBreakdown,
  EarningsSummary,
  Payout,
  Result,
} from '@/src/types';

export interface EarningsFilter {
  fromDate?: string;
  toDate?: string;
  status?: DeliveryEarning['status'];
}

export interface EarningsRepository {
  getSummary(): Promise<Result<EarningsSummary>>;
  getBreakdown(orderId: string): Promise<Result<EarningsBreakdown>>;
  getDeliveryEarnings(filter?: EarningsFilter): Promise<Result<DeliveryEarning[]>>;
  getPayouts(): Promise<Result<Payout[]>>;
}
