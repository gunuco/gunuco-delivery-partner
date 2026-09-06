import type { Result, Vehicle } from '@/src/types';

export interface VehicleUpdate {
  make?: string;
  model?: string;
  number?: string;
  color?: string;
  type?: Vehicle['type'];
  ownership?: Vehicle['ownership'];
  year?: number;
}

export interface VehicleRepository {
  getVehicle(): Promise<Result<Vehicle | null>>;
  updateVehicle(update: VehicleUpdate): Promise<Result<Vehicle>>;
}
