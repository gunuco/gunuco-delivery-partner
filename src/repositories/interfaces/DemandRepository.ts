import type { DemandZone, GeoPoint, Result } from '@/src/types';

export interface DemandRepository {
  getZones(): Promise<Result<DemandZone[]>>;
  getNearby(center?: GeoPoint): Promise<Result<DemandZone[]>>;
}
