import type {
  VehicleRepository,
  VehicleUpdate,
} from '@/src/repositories/interfaces/VehicleRepository';
import type { Result, Vehicle } from '@/src/types';

import { apiClient } from './ApiClient';

function notConnected<T>(): Result<T> {
  return { ok: false, error: apiClient.notConnectedError() };
}

export class ApiVehicleRepository implements VehicleRepository {
  async getVehicle(): Promise<Result<Vehicle | null>> {
    return notConnected();
  }

  async updateVehicle(_update: VehicleUpdate): Promise<Result<Vehicle>> {
    return notConnected();
  }
}
