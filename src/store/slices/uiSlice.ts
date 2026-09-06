import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type NetworkStatus = 'online' | 'offline' | 'unknown';

export type ActiveTabHint = 'home' | 'orders' | 'earnings' | 'profile' | null;

export interface UiState {
  networkStatus: NetworkStatus;
  activeTab: ActiveTabHint;
  showOrderAssignmentModal: boolean;
  pendingAssignedOrderId: string | null;
}

const initialState: UiState = {
  networkStatus: 'unknown',
  activeTab: null,
  showOrderAssignmentModal: false,
  pendingAssignedOrderId: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setNetworkStatus(state, action: PayloadAction<NetworkStatus>) {
      state.networkStatus = action.payload;
    },
    setActiveTab(state, action: PayloadAction<ActiveTabHint>) {
      state.activeTab = action.payload;
    },
    openOrderAssignmentModal(state, action: PayloadAction<string>) {
      state.showOrderAssignmentModal = true;
      state.pendingAssignedOrderId = action.payload;
    },
    closeOrderAssignmentModal(state) {
      state.showOrderAssignmentModal = false;
      state.pendingAssignedOrderId = null;
    },
    setPendingAssignedOrderId(state, action: PayloadAction<string | null>) {
      state.pendingAssignedOrderId = action.payload;
    },
  },
});

export const {
  setNetworkStatus,
  setActiveTab,
  openOrderAssignmentModal,
  closeOrderAssignmentModal,
  setPendingAssignedOrderId,
} = uiSlice.actions;

export default uiSlice.reducer;
