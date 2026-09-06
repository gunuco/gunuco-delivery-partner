import type { Result, Shift } from '@/src/types';

export interface ShiftRepository {
  getShifts(date?: string): Promise<Result<Shift[]>>;
  getUpcoming(): Promise<Result<Shift[]>>;
  bookShift(shiftId: string): Promise<Result<Shift>>;
  cancelShift(shiftId: string): Promise<Result<Shift>>;
}
