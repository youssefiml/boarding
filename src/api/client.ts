import axios, { AxiosError, AxiosHeaders } from 'axios';
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

import { AUTH_ENDPOINTS } from '@/api/endpoints';
import { useAuthStore } from '@/stores/auth.store';
import { useUiStore } from '@/stores/ui.store';
import type { ApiEnvelope, ApiErrorPayload, AuthTokens } from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api';

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

type RetryRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];

function extractData<T>(payload: ApiEnvelope<T> | T): T {
  if (typeof payload === 'object' && payload !== null && 'data' in payload) {
    return (payload as ApiEnvelope<T>).data;
  }

  return payload as T;
}

function setAuthHeader(config: AxiosRequestConfig, token: string) {
  if (!config.headers) {
    config.headers = new AxiosHeaders();
  }

  if (config.headers instanceof AxiosHeaders) {
    config.headers.set('Authorization', `Bearer ${token}`);
    return;
  }

  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${token}`,
  };
}

function normalizeApiError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;
    const status = error.response?.status;
    const payload = parseErrorPayload(responseData);
    const code = normalizeErrorCode(payload?.code);

    if (!error.response || error.code === 'ERR_NETWORK') {
      return 'Network connection issue. Check your internet and try again.';
    }

    if (status === 401 || code === 'INVALID_CREDENTIALS' || code === 'AUTH_INVALID_CREDENTIALS') {
      return 'Invalid email or password.';
    }

    if (status === 409 || code === 'EMAIL_EXISTS' || code === 'AUTH_EMAIL_EXISTS') {
      return 'This email is already registered. Sign in instead.';
    }

    if (status === 400 || code === 'VALIDATION_ERROR') {
      const fieldMessage = firstFieldError(payload?.fieldErrors);

      if (fieldMessage) {
        return fieldMessage;
      }
    }

    if (typeof payload?.message === 'string' && payload.message.trim().length > 0) {
      return payload.message;
    }

    if (status && status >= 500) {
      return 'Server is temporarily unavailable. Please try again shortly.';
    }

    if (typeof responseData === 'string' && responseData.trim().length > 0) {
      return responseData;
    }

    if (typeof responseData === 'object' && responseData !== null) {
      const message = (responseData as { message?: string }).message;

      if (typeof message === 'string' && message.trim().length > 0) {
        return message;
      }
    }

    if (error.message) {
      return error.message;
    }
  }

  return 'Something unexpected happened. Please try again.';
}

function parseErrorPayload(value: unknown): ApiErrorPayload | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const payload = value as ApiErrorPayload & { error?: ApiErrorPayload };

  if (payload.error && typeof payload.error === 'object') {
    return {
      ...payload,
      ...payload.error,
      fieldErrors: payload.error.fieldErrors ?? payload.fieldErrors,
    };
  }

  return payload;
}

function normalizeErrorCode(value?: string) {
  if (!value) {
    return '';
  }

  return value.trim().toUpperCase();
}

function firstFieldError(fieldErrors?: Record<string, string[]>) {
  if (!fieldErrors || typeof fieldErrors !== 'object') {
    return '';
  }

  for (const errors of Object.values(fieldErrors)) {
    if (Array.isArray(errors)) {
      const first = errors.find((item) => typeof item === 'string' && item.trim().length > 0);

      if (first) {
        return first;
      }
    }
  }

  return '';
}

function notifyRefreshSubscribers(token: string | null) {
  refreshSubscribers.forEach((subscriber) => subscriber(token));
  refreshSubscribers = [];
}

function subscribeToRefresh(callback: (token: string | null) => void) {
  refreshSubscribers.push(callback);
}

apiClient.interceptors.request.use(
  (config) => {
    if (!config.skipGlobalLoading) {
      useUiStore.getState().startRequest();
    }

    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken) {
      setAuthHeader(config, accessToken);
    }

    return config;
  },
  (error: AxiosError) => {
    useUiStore.getState().endRequest();
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    if (!response.config.skipGlobalLoading) {
      useUiStore.getState().endRequest();
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;

    if (originalRequest && !originalRequest.skipGlobalLoading) {
      useUiStore.getState().endRequest();
    }

    const status = error.response?.status;
    const shouldAttemptRefresh =
      status === 401 && originalRequest && !originalRequest._retry && !originalRequest.skipAuthRefresh;

    if (shouldAttemptRefresh) {
      const { refreshToken, clearSession } = useAuthStore.getState();

      if (!refreshToken) {
        clearSession();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeToRefresh((token) => {
            if (!token || !originalRequest) {
              reject(error);
              return;
            }

            setAuthHeader(originalRequest, token);
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await refreshClient.post<ApiEnvelope<AuthTokens> | AuthTokens>(
          AUTH_ENDPOINTS.refresh,
          { refreshToken },
          {
            skipGlobalError: true,
            skipGlobalLoading: true,
            skipAuthRefresh: true,
          }
        );

        const refreshedTokens = extractData(response.data);

        useAuthStore.setState((state) => ({
          ...state,
          accessToken: refreshedTokens.accessToken,
          refreshToken: refreshedTokens.refreshToken ?? state.refreshToken,
        }));

        notifyRefreshSubscribers(refreshedTokens.accessToken);

        setAuthHeader(originalRequest, refreshedTokens.accessToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        notifyRefreshSubscribers(null);
        clearSession();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (!originalRequest?.skipGlobalError) {
      useUiStore.getState().setError(normalizeApiError(error));
    }

    return Promise.reject(error);
  }
);

export { extractData, normalizeApiError };
