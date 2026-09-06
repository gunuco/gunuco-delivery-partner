/** GUNUCO partner incentive / bonus domain types */

export type IncentiveStatus = 'ACTIVE' | 'COMPLETED' | 'EXPIRED' | 'LOCKED';

export type IncentiveTargetType = 'ORDERS' | 'EARNINGS' | 'PEAK_HOURS' | 'WEEKLY';

export interface Incentive {
  id: string;
  title: string;
  description: string;
  targetType: IncentiveTargetType;
  targetValue: number;
  currentValue: number;
  rewardPaise: number;
  status: IncentiveStatus;
  validFrom: string;
  validTo: string;
  /** e.g. "3 orders left" */
  remainingLabel?: string;
}
