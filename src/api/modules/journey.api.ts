import { apiClient, extractData } from '@/api/client';
import { JOURNEY_ENDPOINTS } from '@/api/endpoints';
import { isDemoMode, mockApi } from '@/api/mock';
import type { ApiEnvelope, JourneyResponse } from '@/types/api';

async function listMilestones() {
  if (isDemoMode) {
    return mockApi.listJourney();
  }

  const response = await apiClient.get<ApiEnvelope<JourneyResponse> | JourneyResponse>(JOURNEY_ENDPOINTS.list);

  return extractData(response.data);
}

export const journeyApi = {
  listMilestones,
};
