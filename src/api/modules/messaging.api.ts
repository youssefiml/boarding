import { apiClient, extractData } from '@/api/client';
import { MESSAGING_ENDPOINTS } from '@/api/endpoints';
import { isDemoMode, mockApi } from '@/api/mock';
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
    return mockApi.listThreads(params);
  }

  const response = await apiClient.get<ApiEnvelope<MessageThreadsResponse> | MessageThreadsResponse>(
    MESSAGING_ENDPOINTS.threads,
    {
      params,
    }
  );

  return extractData(response.data);
}

async function listMessages(threadId: string, page = 1, pageSize = 20) {
  if (isDemoMode) {
    return mockApi.listMessages(threadId, page, pageSize);
  }

  const response = await apiClient.get<ApiEnvelope<MessagesResponse> | MessagesResponse>(
    MESSAGING_ENDPOINTS.messages(threadId),
    {
      params: { page, pageSize },
    }
  );

  return extractData(response.data);
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
