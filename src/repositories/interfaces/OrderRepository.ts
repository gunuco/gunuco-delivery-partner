import type {
  DeliveryVerification,
  FailReason,
  Order,
  OrderStatus,
  Result,
} from '@/src/types';

export interface OrderFilter {
  status?: OrderStatus | OrderStatus[];
  partnerId?: string;
  /** Include terminal states (delivered / failed / cancelled) */
  includeHistory?: boolean;
}

export interface OrderRepository {
  getOrders(filter?: OrderFilter): Promise<Result<Order[]>>;
  getOrder(id: string): Promise<Result<Order>>;
  getActiveOrder(): Promise<Result<Order | null>>;
  acceptOrder(orderId: string): Promise<Result<Order>>;
  rejectOrder(orderId: string, reason?: string): Promise<Result<Order>>;
  goToPickup(orderId: string): Promise<Result<Order>>;
  markArrivedAtPickup(orderId: string): Promise<Result<Order>>;
  confirmPickup(orderId: string): Promise<Result<Order>>;
  startDelivery(orderId: string): Promise<Result<Order>>;
  markArrivedAtCustomer(orderId: string): Promise<Result<Order>>;
  verifyDelivery(
    orderId: string,
    verification: DeliveryVerification,
  ): Promise<Result<Order>>;
  completeDelivery(orderId: string): Promise<Result<Order>>;
  failDelivery(orderId: string, reason: FailReason): Promise<Result<Order>>;
}
