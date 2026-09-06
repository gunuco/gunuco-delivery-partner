import type {
  VehicleRepository,
  VehicleUpdate,
} from '@/src/repositories/interfaces/VehicleRepository';
import type { Result, Vehicle } from '@/src/types';

import { mockStore } from './MockStore';
import { err, ok, UNAUTHORIZED } from './result';
import { withMockLatency } from './withMockLatency';

export class MockVehicleRepository implements VehicleRepository {
  async getVehicle(): Promise<Result<Vehicle | null>> {
    return withMockLatency(() => {
      if (!mockStore.getState().session) {
        return err(UNAUTHORIZED);
      }
      return ok({ ...mockStore.getState().vehicle });
    });
  }

  async updateVehicle(update: VehicleUpdate): Promise<Result<Vehicle>> {
    return withMockLatency(() => {
      if (!mockStore.getState().session) {
        return err(UNAUTHORIZED);
      }
      const vehicle: Vehicle = {
        ...mockStore.getState().vehicle,
        ...update,
      };
      mockStore.replaceState({ vehicle });
      return ok(vehicle);
    });
  }
}
