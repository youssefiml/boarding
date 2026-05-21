import { apiClient, extractData } from '@/api/client';
import type {
  AdminCompaniesResponse,
  AdminCompany,
  AdminCompanyPayload,
  AdminInternshipOffer,
  AdminInternshipsResponse,
  AdminStudentsResponse,
  AdminStudentProfile,
  ApiEnvelope,
  PaginatedResponse,
} from '@/types/api';

interface AdminListQuery {
  search?: string;
}

function normalizeList<T>(payload: T[] | PaginatedResponse<T>) {
  return Array.isArray(payload) ? payload : payload.items;
}

async function listStudents(query?: AdminListQuery) {
  const response = await apiClient.get<ApiEnvelope<AdminStudentsResponse> | AdminStudentsResponse>('/admin/students', {
    params: query,
  });

  return normalizeList<AdminStudentProfile>(extractData(response.data));
}

async function deleteStudentProfile(studentId: string) {
  await apiClient.delete(`/admin/students/${studentId}`);
}

async function listCompanies(query?: AdminListQuery) {
  const response = await apiClient.get<ApiEnvelope<AdminCompaniesResponse> | AdminCompaniesResponse>('/admin/companies', {
    params: query,
  });

  return normalizeList<AdminCompany>(extractData(response.data));
}

async function getCompany(companyId: string) {
  const response = await apiClient.get<ApiEnvelope<AdminCompany> | AdminCompany>(`/admin/companies/${companyId}`);

  return extractData(response.data);
}

async function createCompany(payload: AdminCompanyPayload) {
  const response = await apiClient.post<ApiEnvelope<AdminCompany> | AdminCompany>('/admin/companies', payload);

  return extractData(response.data);
}

async function updateCompany(companyId: string, payload: AdminCompanyPayload) {
  const response = await apiClient.put<ApiEnvelope<AdminCompany> | AdminCompany>(`/admin/companies/${companyId}`, payload);

  return extractData(response.data);
}

async function deleteCompany(companyId: string) {
  await apiClient.delete(`/admin/companies/${companyId}`);
}

async function listInternships(query?: AdminListQuery) {
  const response = await apiClient.get<ApiEnvelope<AdminInternshipsResponse> | AdminInternshipsResponse>('/admin/internships', {
    params: query,
  });

  return normalizeList<AdminInternshipOffer>(extractData(response.data));
}

async function deleteInternship(internshipId: string) {
  await apiClient.delete(`/admin/internships/${internshipId}`);
}

export const adminApi = {
  listStudents,
  deleteStudentProfile,
  listCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  listInternships,
  deleteInternship,
};
