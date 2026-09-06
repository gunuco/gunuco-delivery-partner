import type { DemandRepository } from '@/src/repositories/interfaces/DemandRepository';
import type { DemandZone, GeoPoint, Result } from '@/src/types';

import { mockStore } from './MockStore';
import { err, ok, UNAUTHORIZED } from './result';
import { withMockLatency } from './withMockLatency';

function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export class MockDemandRepository implements DemandRepository {
  async getZones(): Promise<Result<DemandZone[]>> {
    return withMockLatency(() => {
      if (!mockStore.getState().session) {
        return err(UNAUTHORIZED);
      }
      return ok([...mockStore.getState().demandZones]);
    });
  }

  async getNearby(center?: GeoPoint): Promise<Result<DemandZone[]>> {
    return withMockLatency(() => {
      if (!mockStore.getState().session) {
        return err(UNAUTHORIZED);
      }
      const origin = center ?? { latitude: 17.4326, longitude: 78.4071 };
      const zones = [...mockStore.getState().demandZones].sort(
        (a, b) => haversineKm(origin, a.center) - haversineKm(origin, b.center),
      );
      return ok(zones);
    });
  }
}
