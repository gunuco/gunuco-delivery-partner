import type {
  FaqItem,
  HelpTopic,
  Result,
  SupportMessage,
  SupportTicket,
  TicketCategory,
} from '@/src/types';

export interface CreateTicketInput {
  category: TicketCategory;
  subject: string;
  description: string;
  orderId?: string;
}

export interface SupportRepository {
  getTickets(): Promise<Result<SupportTicket[]>>;
  getTicket(ticketId: string): Promise<Result<SupportTicket>>;
  createTicket(input: CreateTicketInput): Promise<Result<SupportTicket>>;
  sendMessage(ticketId: string, body: string): Promise<Result<SupportMessage>>;
  getFaqs(): Promise<Result<FaqItem[]>>;
  getHelpTopics(): Promise<Result<HelpTopic[]>>;
}
