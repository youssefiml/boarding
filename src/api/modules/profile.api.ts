import { apiClient, extractData } from '@/api/client';
import { PROFILE_ENDPOINTS } from '@/api/endpoints';
import { isDemoMode, mockApi } from '@/api/mock';
import type { ApiEnvelope, ProfilePayload, ProfileResponse } from '@/types/api';

async function getProfile() {
  if (isDemoMode) {
    return mockApi.getProfile();
  }

  const response = await apiClient.get<ApiEnvelope<ProfileResponse> | ProfileResponse>(PROFILE_ENDPOINTS.detail);

  return extractData(response.data);
}

async function updateProfile(payload: ProfilePayload) {
  if (isDemoMode) {
    return mockApi.updateProfile(payload);
  }

  const response = await apiClient.put<ApiEnvelope<ProfileResponse> | ProfileResponse>(
    PROFILE_ENDPOINTS.detail,
    payload
  );

  return extractData(response.data);
}

async function uploadResume(file: File) {
  if (isDemoMode) {
    return mockApi.uploadResume(file);
  }

  const formData = new FormData();
  formData.append('resume', file);

  const response = await apiClient.post<ApiEnvelope<ProfileResponse> | ProfileResponse>(
    PROFILE_ENDPOINTS.uploadResume,
    formData
  );

  return extractData(response.data);
}

async function uploadAvatar(file: File) {
  if (isDemoMode) {
    return mockApi.uploadAvatar(file);
  }

  const formData = new FormData();
  formData.append('avatar', file);

  const response = await apiClient.post<ApiEnvelope<ProfileResponse> | ProfileResponse>(
    PROFILE_ENDPOINTS.uploadAvatar,
    formData
  );

  return extractData(response.data);
}

export const profileApi = {
  getProfile,
  updateProfile,
  uploadResume,
  uploadAvatar,
};
