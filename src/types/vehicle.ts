/** GUNUCO partner vehicle domain types */

export type VehicleType = 'TWO_WHEELER' | 'THREE_WHEELER' | 'EV_SCOOTER' | 'OTHER';

export type OwnershipStatus = 'OWNED' | 'RENTED' | 'COMPANY';

export interface Vehicle {
  id: string;
  type: VehicleType;
  make: string;
  model: string;
  /** Masked registration, e.g. TS09XX1028 */
  number: string;
  color?: string;
  ownership: OwnershipStatus;
  year?: number;
}
