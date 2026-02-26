import { apiClient, extractData } from '@/api/client';
import { JOURNEY_ENDPOINTS } from '@/api/endpoints';
import { isDemoMode, mockApi } from '@/api/mock';
import { parseJourneyResponse } from '@/api/responseGuards';
import type { ApiEnvelope, JourneyResponse } from '@/types/api';

async function listMilestones() {
  if (isDemoMode) {
    const data = await mockApi.listJourney();
    return parseJourneyResponse(data);
  }

  const response = await apiClient.get<ApiEnvelope<JourneyResponse> | JourneyResponse>(JOURNEY_ENDPOINTS.list);

  return parseJourneyResponse(extractData(response.data));
}

export const journeyApi = {
  listMilestones,
};
