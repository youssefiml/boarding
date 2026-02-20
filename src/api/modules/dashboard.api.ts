import { apiClient, extractData } from '@/api/client';
import { DASHBOARD_ENDPOINTS } from '@/api/endpoints';
import { isDemoMode, mockApi } from '@/api/mock';
import type { ApiEnvelope, DashboardResponse } from '@/types/api';

async function getSummary() {
  if (isDemoMode) {
    return mockApi.dashboardSummary();
  }

  const response = await apiClient.get<ApiEnvelope<DashboardResponse> | DashboardResponse>(
    DASHBOARD_ENDPOINTS.summary
  );

  return extractData(response.data);
}

export const dashboardApi = {
  getSummary,
};
