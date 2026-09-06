import type { ShiftRepository } from '@/src/repositories/interfaces/ShiftRepository';
import type { Result, Shift } from '@/src/types';

import { apiClient } from './ApiClient';

function notConnected<T>(): Result<T> {
  return { ok: false, error: apiClient.notConnectedError() };
}

export class ApiShiftRepository implements ShiftRepository {
  async getShifts(_date?: string): Promise<Result<Shift[]>> {
    return notConnected();
  }

  async getUpcoming(): Promise<Result<Shift[]>> {
    return notConnected();
  }

  async bookShift(_shiftId: string): Promise<Result<Shift>> {
    return notConnected();
  }

  async cancelShift(_shiftId: string): Promise<Result<Shift>> {
    return notConnected();
  }
}
