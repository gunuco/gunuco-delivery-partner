/** GUNUCO partner shift booking domain types */

export type ShiftStatus =
  | 'AVAILABLE'
  | 'BOOKED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'MISSED'
  | 'CANCELLED';

export interface Shift {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  hubName: string;
  area: string;
  status: ShiftStatus;
  capacity?: number;
  bookedCount?: number;
  estimatedEarningsPaise?: number;
  incentiveNote?: string;
}
