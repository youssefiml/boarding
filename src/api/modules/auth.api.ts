import { apiClient, extractData } from '@/api/client';
import { AUTH_ENDPOINTS } from '@/api/endpoints';
import { isDemoMode, mockApi } from '@/api/mock';
import type {
  ApiEnvelope,
  AuthSession,
  AuthTokens,
  LoginPayload,
  RegisterPayload,
} from '@/types/api';
import type { StudentUser } from '@/types/domain';

async function login(payload: LoginPayload) {
  if (isDemoMode) {
    return mockApi.login(payload);
  }

  const response = await apiClient.post<ApiEnvelope<AuthSession> | AuthSession>(AUTH_ENDPOINTS.login, payload, {
    skipGlobalError: true,
  });

  return extractData(response.data);
}

async function register(payload: RegisterPayload) {
  if (isDemoMode) {
    return mockApi.register(payload);
  }

  const response = await apiClient.post<ApiEnvelope<AuthSession> | AuthSession>(AUTH_ENDPOINTS.register, payload, {
    skipGlobalError: true,
  });

  return extractData(response.data);
}

async function me() {
  if (isDemoMode) {
    return mockApi.me();
  }

  const response = await apiClient.get<ApiEnvelope<StudentUser> | StudentUser>(AUTH_ENDPOINTS.me, {
    skipGlobalError: true,
  });

  return extractData(response.data);
}

async function refresh(refreshToken: string) {
  if (isDemoMode) {
    return mockApi.refresh(refreshToken);
  }

  const response = await apiClient.post<ApiEnvelope<AuthTokens> | AuthTokens>(
    AUTH_ENDPOINTS.refresh,
    { refreshToken },
    {
      skipGlobalError: true,
      skipGlobalLoading: true,
      skipAuthRefresh: true,
    }
  );

  return extractData(response.data);
}

async function logout() {
  if (isDemoMode) {
    return mockApi.logout();
  }

  await apiClient.post(
    AUTH_ENDPOINTS.logout,
    {},
    {
      skipGlobalError: true,
    }
  );
}

export const authApi = {
  login,
  register,
  me,
  refresh,
  logout,
};
