import { apiClient, extractData } from '@/api/client';
import { RESOURCE_ENDPOINTS } from '@/api/endpoints';
import { isDemoMode, mockApi } from '@/api/mock';
import type { ApiEnvelope, ResourcesQuery, ResourcesResponse } from '@/types/api';

async function listResources(params: ResourcesQuery) {
  if (isDemoMode) {
    return mockApi.listResources(params);
  }

  const response = await apiClient.get<ApiEnvelope<ResourcesResponse> | ResourcesResponse>(RESOURCE_ENDPOINTS.list, {
    params,
  });

  return extractData(response.data);
}

export const resourcesApi = {
  listResources,
};
