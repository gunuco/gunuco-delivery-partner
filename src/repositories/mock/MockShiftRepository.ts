import type { ShiftRepository } from '@/src/repositories/interfaces/ShiftRepository';
import type { Result, Shift } from '@/src/types';

import { mockStore } from './MockStore';
import { appError, err, NOT_FOUND, ok, UNAUTHORIZED } from './result';
import { withMockLatency } from './withMockLatency';

export class MockShiftRepository implements ShiftRepository {
  async getShifts(date?: string): Promise<Result<Shift[]>> {
    return withMockLatency(() => {
      if (!mockStore.getState().session) {
        return err(UNAUTHORIZED);
      }
      let items = [...mockStore.getState().shifts];
      if (date) {
        items = items.filter((s) => s.date === date);
      }
      return ok(items);
    });
  }

  async getUpcoming(): Promise<Result<Shift[]>> {
    return withMockLatency(() => {
      if (!mockStore.getState().session) {
        return err(UNAUTHORIZED);
      }
      return ok(
        mockStore
          .getState()
          .shifts.filter((s) => s.status === 'AVAILABLE' || s.status === 'BOOKED'),
      );
    });
  }

  async bookShift(shiftId: string): Promise<Result<Shift>> {
    return withMockLatency(() => {
      if (!mockStore.getState().session) {
        return err(UNAUTHORIZED);
      }
      const shifts = mockStore.getState().shifts;
      const idx = shifts.findIndex((s) => s.id === shiftId);
      if (idx < 0) {
        return err(NOT_FOUND('Shift', shiftId));
      }
      const shift = shifts[idx];
      if (shift.status !== 'AVAILABLE') {
        return err(
          appError(
            'SHIFT_UNAVAILABLE',
            `Shift ${shiftId} is ${shift.status}`,
            'This shift is no longer available to book.',
            false,
          ),
        );
      }
      const updated: Shift = {
        ...shift,
        status: 'BOOKED',
        bookedCount: (shift.bookedCount ?? 0) + 1,
      };
      const next = [...shifts];
      next[idx] = updated;
      mockStore.replaceState({ shifts: next });
      return ok(updated);
    });
  }

  async cancelShift(shiftId: string): Promise<Result<Shift>> {
    return withMockLatency(() => {
      if (!mockStore.getState().session) {
        return err(UNAUTHORIZED);
      }
      const shifts = mockStore.getState().shifts;
      const idx = shifts.findIndex((s) => s.id === shiftId);
      if (idx < 0) {
        return err(NOT_FOUND('Shift', shiftId));
      }
      const shift = shifts[idx];
      if (shift.status !== 'BOOKED') {
        return err(
          appError(
            'SHIFT_NOT_BOOKED',
            `Shift ${shiftId} is ${shift.status}`,
            'Only booked shifts can be cancelled.',
            false,
          ),
        );
      }
      const updated: Shift = {
        ...shift,
        status: 'CANCELLED',
        bookedCount: Math.max((shift.bookedCount ?? 1) - 1, 0),
      };
      const next = [...shifts];
      next[idx] = updated;
      mockStore.replaceState({ shifts: next });
      return ok(updated);
    });
  }
}
