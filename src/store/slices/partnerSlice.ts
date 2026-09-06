import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { PartnerAvailability } from '@/src/types';

export interface PartnerClientState {
  /** Optimistic / last-known availability for instant UI feedback */
  availability: PartnerAvailability | null;
  isTogglingAvailability: boolean;
}

const initialState: PartnerClientState = {
  availability: null,
  isTogglingAvailability: false,
};

const partnerSlice = createSlice({
  name: 'partner',
  initialState,
  reducers: {
    setAvailability(state, action: PayloadAction<PartnerAvailability | null>) {
      state.availability = action.payload;
    },
    setTogglingAvailability(state, action: PayloadAction<boolean>) {
      state.isTogglingAvailability = action.payload;
    },
    resetPartnerClientState() {
      return initialState;
    },
  },
});

export const {
  setAvailability,
  setTogglingAvailability,
  resetPartnerClientState,
} = partnerSlice.actions;

export default partnerSlice.reducer;
