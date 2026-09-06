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

import { mockStore } from './MockStore';
import { err, NOT_FOUND, ok, UNAUTHORIZED } from './result';
import { withMockLatency } from './withMockLatency';

export class MockSupportRepository implements SupportRepository {
  async getTickets(): Promise<Result<SupportTicket[]>> {
    return withMockLatency(() => {
      if (!mockStore.getState().session) {
        return err(UNAUTHORIZED);
      }
      return ok([...mockStore.getState().tickets]);
    });
  }

  async getTicket(ticketId: string): Promise<Result<SupportTicket>> {
    return withMockLatency(() => {
      if (!mockStore.getState().session) {
        return err(UNAUTHORIZED);
      }
      const ticket = mockStore.getState().tickets.find((t) => t.id === ticketId);
      if (!ticket) {
        return err(NOT_FOUND('Ticket', ticketId));
      }
      return ok(ticket);
    });
  }

  async createTicket(input: CreateTicketInput): Promise<Result<SupportTicket>> {
    return withMockLatency(() => {
      if (!mockStore.getState().session) {
        return err(UNAUTHORIZED);
      }
      const now = new Date().toISOString();
      const ticket: SupportTicket = {
        id: `ticket_${Date.now()}`,
        category: input.category,
        subject: input.subject,
        description: input.description,
        status: 'OPEN',
        orderId: input.orderId,
        createdAt: now,
        updatedAt: now,
        messages: [
          {
            id: `msg_${Date.now()}`,
            sender: 'PARTNER',
            body: input.description,
            createdAt: now,
          },
        ],
      };
      mockStore.replaceState({
        tickets: [ticket, ...mockStore.getState().tickets],
      });
      return ok(ticket);
    });
  }

  async sendMessage(
    ticketId: string,
    body: string,
  ): Promise<Result<SupportMessage>> {
    return withMockLatency(() => {
      if (!mockStore.getState().session) {
        return err(UNAUTHORIZED);
      }
      const tickets = mockStore.getState().tickets;
      const idx = tickets.findIndex((t) => t.id === ticketId);
      if (idx < 0) {
        return err(NOT_FOUND('Ticket', ticketId));
      }
      const now = new Date().toISOString();
      const message: SupportMessage = {
        id: `msg_${Date.now()}`,
        sender: 'PARTNER',
        body,
        createdAt: now,
      };
      const ticket = tickets[idx];
      const updated: SupportTicket = {
        ...ticket,
        updatedAt: now,
        status: ticket.status === 'RESOLVED' ? 'OPEN' : ticket.status,
        messages: [...(ticket.messages ?? []), message],
      };
      const next = [...tickets];
      next[idx] = updated;
      mockStore.replaceState({ tickets: next });
      return ok(message);
    });
  }

  async getFaqs(): Promise<Result<FaqItem[]>> {
    return withMockLatency(() => {
      if (!mockStore.getState().session) {
        return err(UNAUTHORIZED);
      }
      return ok([...mockStore.getState().faqs]);
    });
  }

  async getHelpTopics(): Promise<Result<HelpTopic[]>> {
    return withMockLatency(() => {
      if (!mockStore.getState().session) {
        return err(UNAUTHORIZED);
      }
      return ok([...mockStore.getState().helpTopics]);
    });
  }
}
