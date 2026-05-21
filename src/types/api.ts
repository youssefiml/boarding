import type {
  Appointment,
  ChatMessage,
  CompanyMatch,
  DashboardSummary,
  JourneyMilestone,
  MessageThread,
  ResourceCategory,
  ResourceItem,
  StudentProfile,
  StudentUser,
} from '@/types/domain';

export interface ApiEnvelope<T> {
  data: T;
  message?: string;
}

export interface ApiErrorPayload {
  code?: string;
  message?: string;
  fieldErrors?: Record<string, string[]>;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends PaginationMeta {
  items: T[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthSession extends AuthTokens {
  user: StudentUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export type ProfilePayload = Omit<StudentProfile, 'completion'>;

export interface MatchesQuery {
  page?: number;
  pageSize?: number;
  industry?: string;
  minScore?: number;
  search?: string;
}

export interface AppointmentsQuery {
  page?: number;
  pageSize?: number;
  status?: Appointment['status'];
}

export interface CreateAppointmentPayload {
  title: string;
  date: string;
  type: Appointment['type'];
  notes?: string;
}

export interface MessageThreadsQuery {
  page?: number;
  pageSize?: number;
}

export interface SendMessagePayload {
  content: string;
}

export interface JourneyResponse {
  milestones: JourneyMilestone[];
}

export interface ResourcesQuery {
  page?: number;
  pageSize?: number;
  category?: ResourceCategory | 'all';
}

export type DashboardResponse = DashboardSummary;

export type ProfileResponse = StudentProfile;

export type MatchesResponse = PaginatedResponse<CompanyMatch>;

export type AppointmentsResponse = PaginatedResponse<Appointment>;

export type MessageThreadsResponse = PaginatedResponse<MessageThread>;

export type MessagesResponse = PaginatedResponse<ChatMessage>;

export type ResourcesResponse = PaginatedResponse<ResourceItem>;

export interface AdminAppointmentSummary {
  id: string;
  title?: string;
  date?: string;
  status?: string;
}

export interface AdminPaymentSummary {
  status?: string;
  updatedAt?: string;
}

export interface AdminStudentProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  accountStatus?: string;
  latestPayment?: AdminPaymentSummary | null;
  questionnaireStatus?: string;
  contactStatus?: string;
  nextRelevantAppointment?: AdminAppointmentSummary | null;
  createdAt?: string;
}

export interface AdminCompany {
  id: string;
  name: string;
  sector?: string;
  city?: string;
  location?: string;
  description?: string;
  studentCapacity?: number;
  internshipCount?: number;
  idealDuration?: string;
  periods?: string[];
  skills?: string[];
  requirements?: string;
  cultureTags?: string[];
  internshipNeeds?: string;
  createdAt?: string;
}

export interface AdminCompanyPayload {
  name: string;
  sector?: string;
  city?: string;
  location?: string;
  description?: string;
  studentCapacity?: number;
  idealDuration?: string;
  periods?: string[];
  skills?: string[];
  requirements?: string;
  cultureTags?: string[];
  internshipNeeds?: string;
}

export interface AdminInternshipOffer {
  id: string;
  title: string;
  companyName?: string;
  company?: Pick<AdminCompany, 'id' | 'name' | 'sector' | 'city' | 'location'> | null;
  sector?: string;
  domain?: string;
  location?: string;
  missions?: string;
  criteria?: string;
  createdAt?: string;
}

export type AdminStudentsResponse = AdminStudentProfile[] | PaginatedResponse<AdminStudentProfile>;

export type AdminCompaniesResponse = AdminCompany[] | PaginatedResponse<AdminCompany>;

export type AdminInternshipsResponse = AdminInternshipOffer[] | PaginatedResponse<AdminInternshipOffer>;
