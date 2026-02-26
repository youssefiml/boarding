import { apiClient, extractData } from '@/api/client';
import { MATCHING_ENDPOINTS } from '@/api/endpoints';
import { isDemoMode, mockApi } from '@/api/mock';
import { parseMatchesResponse } from '@/api/responseGuards';
import type { ApiEnvelope, MatchesQuery, MatchesResponse } from '@/types/api';

async function listMatches(params: MatchesQuery) {
  if (isDemoMode) {
    const data = await mockApi.listMatches(params);
    return parseMatchesResponse(data);
  }

  const response = await apiClient.get<ApiEnvelope<MatchesResponse> | MatchesResponse>(MATCHING_ENDPOINTS.list, {
    params,
  });

  return parseMatchesResponse(extractData(response.data));
}

export const matchingApi = {
  listMatches,
};
