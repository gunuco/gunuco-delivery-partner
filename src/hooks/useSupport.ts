import { useCallback } from 'react';

import {
  useCreateSupportTicketMutation,
  useGetFaqsQuery,
  useGetHelpTopicsQuery,
  useGetSupportTicketQuery,
  useGetSupportTicketsQuery,
  useSendSupportMessageMutation,
} from '@/src/api/endpoints/supportApi';
import type { CreateTicketInput } from '@/src/repositories/interfaces';
import { useAppSelector } from '@/src/store/hooks';

/**
 * Support tickets, FAQs, and help topics.
 */
export function useSupport() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const ticketsQuery = useGetSupportTicketsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const faqsQuery = useGetFaqsQuery(undefined, { skip: !isAuthenticated });
  const topicsQuery = useGetHelpTopicsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [createTicketMutation, createState] = useCreateSupportTicketMutation();
  const [sendMessageMutation, sendState] = useSendSupportMessageMutation();

  const createTicket = useCallback(
    async (input: CreateTicketInput) => createTicketMutation(input).unwrap(),
    [createTicketMutation],
  );

  const sendMessage = useCallback(
    async (ticketId: string, body: string) =>
      sendMessageMutation({ ticketId, body }).unwrap(),
    [sendMessageMutation],
  );

  return {
    tickets: ticketsQuery.data ?? [],
    faqs: faqsQuery.data ?? [],
    helpTopics: topicsQuery.data ?? [],
    isLoading:
      ticketsQuery.isLoading || faqsQuery.isLoading || topicsQuery.isLoading,
    isFetching:
      ticketsQuery.isFetching || faqsQuery.isFetching || topicsQuery.isFetching,
    error: ticketsQuery.error ?? faqsQuery.error ?? topicsQuery.error,
    createTicket,
    sendMessage,
    createState,
    sendState,
    refetch: async () => {
      await Promise.all([
        ticketsQuery.refetch(),
        faqsQuery.refetch(),
        topicsQuery.refetch(),
      ]);
    },
  };
}

export function useSupportTicket(ticketId: string | undefined) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const query = useGetSupportTicketQuery(ticketId as string, {
    skip: !isAuthenticated || !ticketId,
  });

  return {
    ticket: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
