/** GUNUCO partner support & help domain types */

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export type TicketCategory =
  | 'PICKUP_ISSUE'
  | 'CUSTOMER_ISSUE'
  | 'PAYMENT_EARNINGS'
  | 'APP_PROBLEM'
  | 'ACCOUNT_ISSUE'
  | 'VEHICLE_ISSUE'
  | 'DOCUMENT_ISSUE'
  | 'OTHER';

export type MessageSender = 'PARTNER' | 'SUPPORT';

export interface SupportMessage {
  id: string;
  sender: MessageSender;
  body: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  category: TicketCategory;
  subject: string;
  description: string;
  status: TicketStatus;
  orderId?: string;
  createdAt: string;
  updatedAt: string;
  messages?: SupportMessage[];
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface HelpTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
}
