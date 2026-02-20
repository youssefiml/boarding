export type EntityId = string;

export type StudentStatus = 'pending' | 'active' | 'placed';

export interface StudentUser {
  id: EntityId;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  profileCompletion: number;
  status: StudentStatus;
}

export interface StudentProfile {
  id?: EntityId;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  phone: string;
  educationLevel: 'high_school' | 'bachelor' | 'master' | 'other';
  fieldOfStudy: string;
  graduationYear: string;
  preferredCountry: string;
  preferredIndustry: string;
  languages: string;
  housingSupportNeeded: boolean;
  bio: string;
  resumeFileName?: string;
  resumeUrl?: string;
  resumeUploadedAt?: string;
  completion: number;
}

export type MatchStatus = 'new' | 'reviewed' | 'accepted' | 'rejected';

export interface CompanyMatch {
  id: EntityId;
  companyName: string;
  industry: string;
  location: string;
  score: number;
  status: MatchStatus;
  description: string;
}

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';
export type AppointmentType = 'interview' | 'coaching' | 'orientation';

export interface Appointment {
  id: EntityId;
  title: string;
  date: string;
  status: AppointmentStatus;
  type: AppointmentType;
  notes?: string;
}

export interface MessageThread {
  id: EntityId;
  companyName: string;
  lastMessage: string;
  unreadCount: number;
  updatedAt: string;
}

export type MessageSender = 'student' | 'agency' | 'company';

export interface ChatMessage {
  id: EntityId;
  threadId: EntityId;
  sender: MessageSender;
  content: string;
  createdAt: string;
}

export type JourneyMilestoneStatus = 'done' | 'current' | 'upcoming';

export interface JourneyMilestone {
  id: EntityId;
  title: string;
  date: string;
  status: JourneyMilestoneStatus;
  description: string;
}

export type ResourceCategory = 'housing' | 'language' | 'local-life' | 'legal' | 'health';

export interface ResourceItem {
  id: EntityId;
  title: string;
  category: ResourceCategory;
  excerpt: string;
  url: string;
}

export interface DashboardSummary {
  profileCompletion: number;
  matchCount: number;
  nextStep: string;
  nextAppointment: Appointment | null;
  upcomingActions: string[];
}
