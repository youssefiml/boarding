import { apiClient, extractData } from '@/api/client';
import { MATCHING_ENDPOINTS } from '@/api/endpoints';
import { isDemoMode, mockApi } from '@/api/mock';
import type { ApiEnvelope, MatchesQuery, MatchesResponse } from '@/types/api';

async function listMatches(params: MatchesQuery) {
  if (isDemoMode) {
    return mockApi.listMatches(params);
  }

  const response = await apiClient.get<ApiEnvelope<MatchesResponse> | MatchesResponse>(MATCHING_ENDPOINTS.list, {
    params,
  });

  return extractData(response.data);
}

export const matchingApi = {
  listMatches,
};
