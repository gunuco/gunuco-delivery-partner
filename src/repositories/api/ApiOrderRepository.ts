import type {
  OrderFilter,
  OrderRepository,
} from '@/src/repositories/interfaces/OrderRepository';
import type {
  DeliveryVerification,
  FailReason,
  Order,
  Result,
} from '@/src/types';

import { apiClient } from './ApiClient';

function notConnected<T>(): Result<T> {
  return { ok: false, error: apiClient.notConnectedError() };
}

export class ApiOrderRepository implements OrderRepository {
  async getOrders(_filter?: OrderFilter): Promise<Result<Order[]>> {
    return notConnected();
  }

  async getOrder(_id: string): Promise<Result<Order>> {
    return notConnected();
  }

  async getActiveOrder(): Promise<Result<Order | null>> {
    return notConnected();
  }

  async acceptOrder(_orderId: string): Promise<Result<Order>> {
    return notConnected();
  }

  async rejectOrder(_orderId: string, _reason?: string): Promise<Result<Order>> {
    return notConnected();
  }

  async goToPickup(_orderId: string): Promise<Result<Order>> {
    return notConnected();
  }

  async markArrivedAtPickup(_orderId: string): Promise<Result<Order>> {
    return notConnected();
  }

  async confirmPickup(_orderId: string): Promise<Result<Order>> {
    return notConnected();
  }

  async startDelivery(_orderId: string): Promise<Result<Order>> {
    return notConnected();
  }

  async markArrivedAtCustomer(_orderId: string): Promise<Result<Order>> {
    return notConnected();
  }

  async verifyDelivery(
    _orderId: string,
    _verification: DeliveryVerification,
  ): Promise<Result<Order>> {
    return notConnected();
  }

  async completeDelivery(_orderId: string): Promise<Result<Order>> {
    return notConnected();
  }

  async failDelivery(_orderId: string, _reason: FailReason): Promise<Result<Order>> {
    return notConnected();
  }
}
