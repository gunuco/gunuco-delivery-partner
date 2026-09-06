import { useCallback } from 'react';

import {
  useAcceptOrderMutation,
  useCompleteDeliveryMutation,
  useConfirmPickupMutation,
  useFailDeliveryMutation,
  useGoToPickupMutation,
  useMarkArrivedAtCustomerMutation,
  useMarkArrivedAtPickupMutation,
  useRejectOrderMutation,
  useStartDeliveryMutation,
  useVerifyDeliveryMutation,
} from '@/src/api/endpoints/ordersApi';
import type { DeliveryVerification, FailReason, Order } from '@/src/types';

export type OrderActionResult = Order;

/**
 * Confirmation-ready order workflow actions.
 * Screens can wrap these with GConfirmationDialog before calling.
 */
export function useOrderActions() {
  const [acceptOrderMutation, acceptState] = useAcceptOrderMutation();
  const [rejectOrderMutation, rejectState] = useRejectOrderMutation();
  const [goToPickupMutation, goToPickupState] = useGoToPickupMutation();
  const [markArrivedAtPickupMutation, arrivedPickupState] =
    useMarkArrivedAtPickupMutation();
  const [confirmPickupMutation, confirmPickupState] = useConfirmPickupMutation();
  const [startDeliveryMutation, startDeliveryState] = useStartDeliveryMutation();
  const [markArrivedAtCustomerMutation, arrivedCustomerState] =
    useMarkArrivedAtCustomerMutation();
  const [verifyDeliveryMutation, verifyState] = useVerifyDeliveryMutation();
  const [completeDeliveryMutation, completeState] = useCompleteDeliveryMutation();
  const [failDeliveryMutation, failState] = useFailDeliveryMutation();

  const accept = useCallback(
    async (orderId: string): Promise<OrderActionResult> =>
      acceptOrderMutation(orderId).unwrap(),
    [acceptOrderMutation],
  );

  const reject = useCallback(
    async (orderId: string, reason?: string): Promise<OrderActionResult> =>
      rejectOrderMutation({ orderId, reason }).unwrap(),
    [rejectOrderMutation],
  );

  const goToPickup = useCallback(
    async (orderId: string): Promise<OrderActionResult> =>
      goToPickupMutation(orderId).unwrap(),
    [goToPickupMutation],
  );

  const markArrivedAtPickup = useCallback(
    async (orderId: string): Promise<OrderActionResult> =>
      markArrivedAtPickupMutation(orderId).unwrap(),
    [markArrivedAtPickupMutation],
  );

  const confirmPickup = useCallback(
    async (orderId: string): Promise<OrderActionResult> =>
      confirmPickupMutation(orderId).unwrap(),
    [confirmPickupMutation],
  );

  const startDelivery = useCallback(
    async (orderId: string): Promise<OrderActionResult> =>
      startDeliveryMutation(orderId).unwrap(),
    [startDeliveryMutation],
  );

  const markArrivedAtCustomer = useCallback(
    async (orderId: string): Promise<OrderActionResult> =>
      markArrivedAtCustomerMutation(orderId).unwrap(),
    [markArrivedAtCustomerMutation],
  );

  const verifyDelivery = useCallback(
    async (
      orderId: string,
      verification: DeliveryVerification,
    ): Promise<OrderActionResult> =>
      verifyDeliveryMutation({ orderId, verification }).unwrap(),
    [verifyDeliveryMutation],
  );

  const complete = useCallback(
    async (orderId: string): Promise<OrderActionResult> =>
      completeDeliveryMutation(orderId).unwrap(),
    [completeDeliveryMutation],
  );

  const fail = useCallback(
    async (orderId: string, reason: FailReason): Promise<OrderActionResult> =>
      failDeliveryMutation({ orderId, reason }).unwrap(),
    [failDeliveryMutation],
  );

  const isActing =
    acceptState.isLoading ||
    rejectState.isLoading ||
    goToPickupState.isLoading ||
    arrivedPickupState.isLoading ||
    confirmPickupState.isLoading ||
    startDeliveryState.isLoading ||
    arrivedCustomerState.isLoading ||
    verifyState.isLoading ||
    completeState.isLoading ||
    failState.isLoading;

  return {
    accept,
    reject,
    goToPickup,
    markArrivedAtPickup,
    confirmPickup,
    startDelivery,
    markArrivedAtCustomer,
    verifyDelivery,
    complete,
    fail,
    isActing,
    acceptState,
    rejectState,
    goToPickupState,
    arrivedPickupState,
    confirmPickupState,
    startDeliveryState,
    arrivedCustomerState,
    verifyState,
    completeState,
    failState,
  };
}
