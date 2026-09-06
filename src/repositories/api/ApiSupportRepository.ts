import type {
  CreateTicketInput,
  SupportRepository,
} from '@/src/repositories/interfaces/SupportRepository';
import type {
  FaqItem,
  HelpTopic,
  Result,
  SupportMessage,
  SupportTicket,
} from '@/src/types';

import { apiClient } from './ApiClient';

function notConnected<T>(): Result<T> {
  return { ok: false, error: apiClient.notConnectedError() };
}

export class ApiSupportRepository implements SupportRepository {
  async getTickets(): Promise<Result<SupportTicket[]>> {
    return notConnected();
  }

  async getTicket(_ticketId: string): Promise<Result<SupportTicket>> {
    return notConnected();
  }

  async createTicket(_input: CreateTicketInput): Promise<Result<SupportTicket>> {
    return notConnected();
  }

  async sendMessage(
    _ticketId: string,
    _body: string,
  ): Promise<Result<SupportMessage>> {
    return notConnected();
  }

  async getFaqs(): Promise<Result<FaqItem[]>> {
    return notConnected();
  }

  async getHelpTopics(): Promise<Result<HelpTopic[]>> {
    return notConnected();
  }
}
