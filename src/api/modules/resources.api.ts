import { apiClient, extractData } from '@/api/client';
import { RESOURCE_ENDPOINTS } from '@/api/endpoints';
import { isDemoMode, mockApi } from '@/api/mock';
import { parseResourcesResponse } from '@/api/responseGuards';
import type { ApiEnvelope, ResourcesQuery, ResourcesResponse } from '@/types/api';

async function listResources(params: ResourcesQuery) {
  if (isDemoMode) {
    const data = await mockApi.listResources(params);
    return parseResourcesResponse(data);
  }

  const response = await apiClient.get<ApiEnvelope<ResourcesResponse> | ResourcesResponse>(RESOURCE_ENDPOINTS.list, {
    params,
  });

  return parseResourcesResponse(extractData(response.data));
}

export const resourcesApi = {
  listResources,
};
