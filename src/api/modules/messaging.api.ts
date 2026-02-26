import { apiClient, extractData } from '@/api/client';
import { MESSAGING_ENDPOINTS } from '@/api/endpoints';
import { isDemoMode, mockApi } from '@/api/mock';
import { parseMessagesResponse, parseMessageThreadsResponse } from '@/api/responseGuards';
import type {
  ApiEnvelope,
  MessagesResponse,
  MessageThreadsQuery,
  MessageThreadsResponse,
  SendMessagePayload,
} from '@/types/api';
import type { ChatMessage } from '@/types/domain';

async function listThreads(params: MessageThreadsQuery) {
  if (isDemoMode) {
    const data = await mockApi.listThreads(params);
    return parseMessageThreadsResponse(data);
  }

  const response = await apiClient.get<ApiEnvelope<MessageThreadsResponse> | MessageThreadsResponse>(
    MESSAGING_ENDPOINTS.threads,
    {
      params,
    }
  );

  return parseMessageThreadsResponse(extractData(response.data));
}

async function listMessages(threadId: string, page = 1, pageSize = 20) {
  if (isDemoMode) {
    const data = await mockApi.listMessages(threadId, page, pageSize);
    return parseMessagesResponse(data);
  }

  const response = await apiClient.get<ApiEnvelope<MessagesResponse> | MessagesResponse>(
    MESSAGING_ENDPOINTS.messages(threadId),
    {
      params: { page, pageSize },
    }
  );

  return parseMessagesResponse(extractData(response.data));
}

async function sendMessage(threadId: string, payload: SendMessagePayload) {
  if (isDemoMode) {
    return mockApi.sendMessage(threadId, payload);
  }

  const response = await apiClient.post<ApiEnvelope<ChatMessage> | ChatMessage>(
    MESSAGING_ENDPOINTS.messages(threadId),
    payload
  );

  return extractData(response.data);
}

export const messagingApi = {
  listThreads,
  listMessages,
  sendMessage,
};
