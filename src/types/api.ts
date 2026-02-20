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