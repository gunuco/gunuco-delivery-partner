import type { DemandRepository } from '@/src/repositories/interfaces/DemandRepository';
import type { DemandZone, GeoPoint, Result } from '@/src/types';

import { apiClient } from './ApiClient';

function notConnected<T>(): Result<T> {
  return { ok: false, error: apiClient.notConnectedError() };
}

export class ApiDemandRepository implements DemandRepository {
  async getZones(): Promise<Result<DemandZone[]>> {
    return notConnected();
  }

  async getNearby(_center?: GeoPoint): Promise<Result<DemandZone[]>> {
    return notConnected();
  }
}
