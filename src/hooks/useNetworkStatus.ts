import * as Network from 'expo-network';
import { useCallback, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import {
  setNetworkStatus,
  type NetworkStatus,
} from '@/src/store/slices/uiSlice';

function toNetworkStatus(state: Network.NetworkState): NetworkStatus {
  if (state.isConnected === false) {
    return 'offline';
  }
  if (state.isInternetReachable === false) {
    return 'offline';
  }
  if (state.isConnected === true) {
    return 'online';
  }
  return 'unknown';
}

/**
 * Monitors device connectivity via expo-network and syncs `ui.networkStatus`.
 */
export function useNetworkStatus() {
  const dispatch = useAppDispatch();
  const networkStatus = useAppSelector((state) => state.ui.networkStatus);

  const refreshNetwork = useCallback(async () => {
    try {
      const state = await Network.getNetworkStateAsync();
      dispatch(setNetworkStatus(toNetworkStatus(state)));
    } catch {
      dispatch(setNetworkStatus('unknown'));
    }
  }, [dispatch]);

  useEffect(() => {
    let subscription: { remove: () => void } | undefined;

    void refreshNetwork();

    try {
      subscription = Network.addNetworkStateListener((state) => {
        dispatch(setNetworkStatus(toNetworkStatus(state)));
      });
    } catch {
      dispatch(setNetworkStatus('unknown'));
    }

    return () => {
      subscription?.remove();
    };
  }, [dispatch, refreshNetwork]);

  const isOffline = networkStatus === 'offline';
  const isOnline = networkStatus === 'online';

  return {
    networkStatus,
    isOffline,
    isOnline,
    refreshNetwork,
  };
}
