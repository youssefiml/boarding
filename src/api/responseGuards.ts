import { z } from 'zod';

import type {
  AppointmentsResponse,
  DashboardResponse,
  JourneyResponse,
  MatchesResponse,
  MessagesResponse,
  MessageThreadsResponse,
  ResourcesResponse,
} from '@/types/api';

const warnedSources = new Set<string>();

function warnInvalidPayload(source: string, details: unknown) {
  if (process.env.NODE_ENV !== 'development' || warnedSources.has(source)) {
    return;
  }

  warnedSources.add(source);
  console.warn(`[api] Invalid payload for ${source}. Falling back to safe defaults.`, details);
}

function parseWithFallback<T>(source: string, schema: z.ZodType<T>, payload: unknown, fallback: T): T {
  const parsed = schema.safeParse(payload);

  if (parsed.success) {
    return parsed.data;
  }

  warnInvalidPayload(source, parsed.error.flatten());
  return fallback;
}

const companyMatchSchema = z.object({
  id: z.string().min(1),
  companyName: z.string(),
  industry: z.string(),
  location: z.string(),
  score: z.coerce.number(),
  status: z.enum(['new', 'reviewed', 'accepted', 'rejected']),
  description: z.string(),
});

const appointmentSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  date: z.string(),
  status: z.enum(['scheduled', 'completed', 'cancelled']),
  type: z.enum(['interview', 'coaching', 'orientation']),
  notes: z.string().optional(),
});

const messageThreadSchema = z.object({
  id: z.string().min(1),
  companyName: z.string(),
  lastMessage: z.string(),
  unreadCount: z.coerce.number(),
  updatedAt: z.string(),
});

const chatMessageSchema = z.object({
  id: z.string().min(1),
  threadId: z.string().min(1),
  sender: z.enum(['student', 'agency', 'company']),
  content: z.string(),
  createdAt: z.string(),
});

const resourceSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  category: z.enum(['housing', 'language', 'local-life', 'legal', 'health']),
  excerpt: z.string(),
  url: z.string(),
});

const journeyMilestoneSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  date: z.string(),
  status: z.enum(['done', 'current', 'upcoming']),
  description: z.string(),
});

const paginatedMetaSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  pageSize: z.coerce.number().int().positive().catch(10),
  total: z.coerce.number().int().nonnegative().catch(0),
  totalPages: z.coerce.number().int().positive().catch(1),
});

function paginatedSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return paginatedMetaSchema.extend({
    items: z.array(itemSchema),
  });
}

const matchesResponseSchema = paginatedSchema(companyMatchSchema);
const appointmentsResponseSchema = paginatedSchema(appointmentSchema);
const messageThreadsResponseSchema = paginatedSchema(messageThreadSchema);
const messagesResponseSchema = paginatedSchema(chatMessageSchema);
const resourcesResponseSchema = paginatedSchema(resourceSchema);

const journeyResponseSchema = z.object({
  milestones: z.array(journeyMilestoneSchema),
});

const dashboardSummarySchema = z.object({
  profileCompletion: z.coerce.number(),
  matchCount: z.coerce.number(),
  nextStep: z.string(),
  nextAppointment: appointmentSchema.nullable(),
  upcomingActions: z.array(z.string()),
});

export function parseMatchesResponse(payload: unknown): MatchesResponse {
  return parseWithFallback('matching.listMatches', matchesResponseSchema, payload, {
    items: [],
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
}

export function parseAppointmentsResponse(payload: unknown): AppointmentsResponse {
  return parseWithFallback('appointments.listAppointments', appointmentsResponseSchema, payload, {
    items: [],
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
}

export function parseMessageThreadsResponse(payload: unknown): MessageThreadsResponse {
  return parseWithFallback('messaging.listThreads', messageThreadsResponseSchema, payload, {
    items: [],
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 1,
  });
}

export function parseMessagesResponse(payload: unknown): MessagesResponse {
  return parseWithFallback('messaging.listMessages', messagesResponseSchema, payload, {
    items: [],
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 1,
  });
}

export function parseResourcesResponse(payload: unknown): ResourcesResponse {
  return parseWithFallback('resources.listResources', resourcesResponseSchema, payload, {
    items: [],
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  });
}

export function parseJourneyResponse(payload: unknown): JourneyResponse {
  return parseWithFallback('journey.listMilestones', journeyResponseSchema, payload, {
    milestones: [],
  });
}

export function parseDashboardResponse(payload: unknown): DashboardResponse {
  return parseWithFallback('dashboard.getSummary', dashboardSummarySchema, payload, {
    profileCompletion: 0,
    matchCount: 0,
    nextStep: 'Review your profile to continue.',
    nextAppointment: null,
    upcomingActions: [],
  });
}
