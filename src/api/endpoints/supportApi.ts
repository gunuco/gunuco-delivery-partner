import { baseApi } from '@/src/api/baseApi';
import { mapResult } from '@/src/api/mapResult';
import { repositories } from '@/src/repositories/factory';
import type { CreateTicketInput } from '@/src/repositories/interfaces';

type SendSupportMessageArg = {
  ticketId: string;
  body: string;
};

export const supportApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSupportTickets: build.query({
      async queryFn() {
        const result = await repositories.support.getTickets();
        return mapResult(result);
      },
      providesTags: ['Support'],
    }),
    getSupportTicket: build.query({
      async queryFn(ticketId: string) {
        const result = await repositories.support.getTicket(ticketId);
        return mapResult(result);
      },
      providesTags: (_result, _error, ticketId) => [
        { type: 'Support', id: ticketId },
      ],
    }),
    createSupportTicket: build.mutation({
      async queryFn(input: CreateTicketInput) {
        const result = await repositories.support.createTicket(input);
        return mapResult(result);
      },
      invalidatesTags: ['Support'],
    }),
    sendSupportMessage: build.mutation({
      async queryFn({ ticketId, body }: SendSupportMessageArg) {
        const result = await repositories.support.sendMessage(ticketId, body);
        return mapResult(result);
      },
      invalidatesTags: ['Support'],
    }),
    getFaqs: build.query({
      async queryFn() {
        const result = await repositories.support.getFaqs();
        return mapResult(result);
      },
      providesTags: ['Support'],
    }),
    getHelpTopics: build.query({
      async queryFn() {
        const result = await repositories.support.getHelpTopics();
        return mapResult(result);
      },
      providesTags: ['Support'],
    }),
  }),
});

export const {
  useGetSupportTicketsQuery,
  useGetSupportTicketQuery,
  useCreateSupportTicketMutation,
  useSendSupportMessageMutation,
  useGetFaqsQuery,
  useGetHelpTopicsQuery,
} = supportApi;
