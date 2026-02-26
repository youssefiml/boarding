import { apiClient, extractData } from '@/api/client';
import { DASHBOARD_ENDPOINTS } from '@/api/endpoints';
import { isDemoMode, mockApi } from '@/api/mock';
import { parseDashboardResponse } from '@/api/responseGuards';
import type { ApiEnvelope, DashboardResponse } from '@/types/api';

async function getSummary() {
  if (isDemoMode) {
    const data = await mockApi.dashboardSummary();
    return parseDashboardResponse(data);
  }

  const response = await apiClient.get<ApiEnvelope<DashboardResponse> | DashboardResponse>(
    DASHBOARD_ENDPOINTS.summary
  );

  return parseDashboardResponse(extractData(response.data));
}

export const dashboardApi = {
  getSummary,
};
