/** GUNUCO partner performance metrics domain types */

export type PerformancePeriod = 'TODAY' | 'WEEK' | 'MONTH' | 'ALL';

export interface PerformanceMetrics {
  acceptanceRate: number;
  completionRate: number;
  onTimeRate: number;
  customerRating: number;
  partnerScore: number;
  ordersCompleted: number;
  distanceTravelledKm: number;
  period: PerformancePeriod;
}

export interface PerformanceTrendPoint {
  date: string;
  score: number;
  ordersCompleted: number;
}
