import { apiClient, extractData } from '@/api/client';
import { APPOINTMENT_ENDPOINTS } from '@/api/endpoints';
import { isDemoMode, mockApi } from '@/api/mock';
import type {
  ApiEnvelope,
  AppointmentsQuery,
  AppointmentsResponse,
  CreateAppointmentPayload,
} from '@/types/api';
import type { Appointment } from '@/types/domain';

async function listAppointments(params: AppointmentsQuery) {
  if (isDemoMode) {
    return mockApi.listAppointments(params);
  }

  const response = await apiClient.get<ApiEnvelope<AppointmentsResponse> | AppointmentsResponse>(
    APPOINTMENT_ENDPOINTS.list,
    {
      params,
    }
  );

  return extractData(response.data);
}

async function createAppointment(payload: CreateAppointmentPayload) {
  if (isDemoMode) {
    return mockApi.createAppointment(payload);
  }

  const response = await apiClient.post<ApiEnvelope<Appointment> | Appointment>(APPOINTMENT_ENDPOINTS.list, payload);

  return extractData(response.data);
}

export const appointmentsApi = {
  listAppointments,
  createAppointment,
};
