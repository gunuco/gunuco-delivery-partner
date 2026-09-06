/** GUNUCO demand / surge zone domain types */

import type { GeoPoint } from './order';

export type DemandLevel = 'HIGH' | 'NORMAL' | 'LOW';

export interface DemandZone {
  id: string;
  name: string;
  level: DemandLevel;
  center: GeoPoint;
  radiusKm?: number;
  surgeMultiplier?: number;
  activeOrdersEstimate?: number;
}
