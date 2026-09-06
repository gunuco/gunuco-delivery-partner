/** GUNUCO partner earnings & payout domain types (amounts in paise) */

export type DeliveryEarningStatus = 'PENDING' | 'SETTLED';

export type PayoutStatus = 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED';

export interface EarningsSummary {
  todayPaise: number;
  weekPaise: number;
  monthPaise: number;
  totalPaise: number;
  todayOrders: number;
  todayDistanceKm: number;
}

export interface EarningsBreakdown {
  basePaise: number;
  distancePaise: number;
  surgePaise: number;
  incentivePaise: number;
  adjustmentsPaise: number;
  deductionsPaise: number;
  netPaise: number;
}

export interface DeliveryEarning {
  id: string;
  orderId: string;
  orderNumber: string;
  date: string;
  breakdown: EarningsBreakdown;
  status: DeliveryEarningStatus;
}

export interface Payout {
  id: string;
  amountPaise: number;
  status: PayoutStatus;
  scheduledAt: string;
  paidAt?: string;
  method?: string;
}
