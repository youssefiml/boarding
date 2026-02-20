import type {
  ApiEnvelope,
  AppointmentsQuery,
  AppointmentsResponse,
  AuthSession,
  AuthTokens,
  CreateAppointmentPayload,
  DashboardResponse,
  JourneyResponse,
  LoginPayload,
  MatchesQuery,
  MatchesResponse,
  MessageThreadsQuery,
  MessageThreadsResponse,
  MessagesResponse,
  PaginatedResponse,
  ProfilePayload,
  ProfileResponse,
  RegisterPayload,
  ResourcesQuery,
  ResourcesResponse,
  SendMessagePayload,
} from '@/types/api';
import type {
  Appointment,
  ChatMessage,
  CompanyMatch,
  JourneyMilestone,
  MessageThread,
  ResourceItem,
  StudentProfile,
  StudentUser,
} from '@/types/domain';

export const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

function sleep(ms = 250) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(typeof reader.result === 'string' ? reader.result : '');
    };

    reader.onerror = () => {
      reject(new Error('Unable to read file.'));
    };

    reader.readAsDataURL(file);
  });
}

function randomId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function computeProfileCompletion(profile: StudentProfile | ProfilePayload): number {
  const checks: boolean[] = [
    profile.firstName.trim().length > 0,
    profile.lastName.trim().length > 0,
    profile.email.trim().length > 0,
    profile.phone.trim().length > 0,
    profile.fieldOfStudy.trim().length > 0,
    profile.graduationYear.trim().length > 0,
    profile.preferredCountry.trim().length > 0,
    profile.preferredIndustry.trim().length > 0,
    profile.languages.trim().length > 0,
    profile.bio.trim().length > 0,
    Boolean(profile.resumeFileName),
  ];

  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}

function paginate<T>(items: T[], page = 1, pageSize = 10): PaginatedResponse<T> {
  const safePageSize = Math.max(1, pageSize);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * safePageSize;
  const end = start + safePageSize;

  return {
    items: items.slice(start, end),
    page: safePage,
    pageSize: safePageSize,
    total,
    totalPages,
  };
}

function unwrap<T>(value: ApiEnvelope<T> | T): T {
  if (typeof value === 'object' && value !== null && 'data' in value) {
    return (value as ApiEnvelope<T>).data;
  }

  return value as T;
}

const now = new Date();
const inDays = (days: number) => {
  const date = new Date(now);
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

let studentUserStore: StudentUser = {
  id: 'student-001',
  firstName: 'Demo',
  lastName: 'Student',
  email: 'student@boarding.dev',
  profileCompletion: 72,
  status: 'active',
};

let profileStore: StudentProfile = {
  id: 'profile-001',
  firstName: 'Demo',
  lastName: 'Student',
  email: 'student@boarding.dev',
  phone: '+212 600-123-456',
  educationLevel: 'bachelor',
  fieldOfStudy: 'Business Administration',
  graduationYear: '2027',
  preferredCountry: 'Germany',
  preferredIndustry: 'Hospitality',
  languages: 'English, French',
  housingSupportNeeded: true,
  bio: 'Motivated student seeking international internship opportunities with strong communication skills.',
  resumeFileName: 'Demo_Student_Resume.pdf',
  resumeUrl: 'https://example.com/uploads/Demo_Student_Resume.pdf',
  resumeUploadedAt: inDays(-4),
  completion: 72,
};

const matchStore: CompanyMatch[] = [
  {
    id: 'match-1',
    companyName: 'Nord Stay Hotels',
    industry: 'hospitality',
    location: 'Berlin, Germany',
    score: 91,
    status: 'new',
    description: 'Guest operations internship with onboarding support for international students.',
  },
  {
    id: 'match-2',
    companyName: 'CareBridge Clinic',
    industry: 'healthcare',
    location: 'Lyon, France',
    score: 77,
    status: 'reviewed',
    description: 'Administrative support role focused on patient scheduling and communication.',
  },
  {
    id: 'match-3',
    companyName: 'Blue Forge Manufacturing',
    industry: 'manufacturing',
    location: 'Rotterdam, Netherlands',
    score: 68,
    status: 'new',
    description: 'Process coordination internship with mentorship and language support.',
  },
  {
    id: 'match-4',
    companyName: 'Orbit IT Systems',
    industry: 'it',
    location: 'Lisbon, Portugal',
    score: 84,
    status: 'accepted',
    description: 'Junior QA internship on customer-facing web products.',
  },
];

let appointmentStore: Appointment[] = [
  {
    id: 'appt-1',
    title: 'Placement coaching session',
    date: inDays(2),
    status: 'scheduled',
    type: 'coaching',
    notes: 'Bring your updated profile and language certificates.',
  },
  {
    id: 'appt-2',
    title: 'Interview with Nord Stay Hotels',
    date: inDays(5),
    status: 'scheduled',
    type: 'interview',
  },
];

let threadStore: MessageThread[] = [
  {
    id: 'thread-1',
    companyName: 'Nord Stay Hotels',
    lastMessage: 'Can you share your availability for next week?',
    unreadCount: 1,
    updatedAt: inDays(-1),
  },
  {
    id: 'thread-2',
    companyName: 'Boarding Agency Advisor',
    lastMessage: 'Your onboarding draft is looking good.',
    unreadCount: 0,
    updatedAt: inDays(-2),
  },
];

const messageStore: Record<string, ChatMessage[]> = {
  'thread-1': [
    {
      id: 'msg-1',
      threadId: 'thread-1',
      sender: 'company',
      content: 'Hello! We reviewed your profile and would like to schedule an interview.',
      createdAt: inDays(-2),
    },
    {
      id: 'msg-2',
      threadId: 'thread-1',
      sender: 'student',
      content: 'Great, thank you. I am available next Tuesday and Wednesday.',
      createdAt: inDays(-1),
    },
  ],
  'thread-2': [
    {
      id: 'msg-3',
      threadId: 'thread-2',
      sender: 'agency',
      content: 'Please complete your preferred industry before Friday.',
      createdAt: inDays(-3),
    },
  ],
};

const journeyStore: JourneyMilestone[] = [
  {
    id: 'journey-1',
    title: 'Account created',
    date: inDays(-20),
    status: 'done',
    description: 'You created your student account.',
  },
  {
    id: 'journey-2',
    title: 'Profile review',
    date: inDays(-5),
    status: 'done',
    description: 'Agency reviewed your profile and gave feedback.',
  },
  {
    id: 'journey-3',
    title: 'Company matching in progress',
    date: inDays(1),
    status: 'current',
    description: 'Your profile is being matched with partner companies.',
  },
  {
    id: 'journey-4',
    title: 'Interview round',
    date: inDays(7),
    status: 'upcoming',
    description: 'You will attend first interviews with top matches.',
  },
];

const resourceStore: ResourceItem[] = [
  {
    id: 'resource-1',
    title: 'Finding student housing in Berlin',
    category: 'housing',
    excerpt: 'A practical checklist to secure short-term housing before arrival.',
    url: 'https://example.com/housing-berlin',
  },
  {
    id: 'resource-2',
    title: 'Workplace German essentials',
    category: 'language',
    excerpt: 'Essential terms and phrases for your first internship month.',
    url: 'https://example.com/german-essentials',
  },
  {
    id: 'resource-3',
    title: 'Public transport and local life guide',
    category: 'local-life',
    excerpt: 'How to navigate the city, SIM cards, and everyday admin tasks.',
    url: 'https://example.com/local-life',
  },
  {
    id: 'resource-4',
    title: 'Internship legal checklist',
    category: 'legal',
    excerpt: 'Visa, insurance, and contract checkpoints before departure.',
    url: 'https://example.com/legal-checklist',
  },
  {
    id: 'resource-5',
    title: 'Healthcare access for international students',
    category: 'health',
    excerpt: 'What to do in urgent and non-urgent medical situations.',
    url: 'https://example.com/healthcare-access',
  },
];

export const mockApi = {
  async login(payload: LoginPayload): Promise<AuthSession> {
    await sleep();
    const [firstChunk = 'Student', secondChunk = 'User'] = payload.email.split('@')[0].split(/[._-]/);
    const firstName = firstChunk.charAt(0).toUpperCase() + firstChunk.slice(1);
    const lastName = secondChunk.charAt(0).toUpperCase() + secondChunk.slice(1);

    studentUserStore = {
      ...studentUserStore,
      email: payload.email,
      firstName,
      lastName,
    };
    profileStore = {
      ...profileStore,
      email: payload.email,
      firstName,
      lastName,
    };

    return {
      accessToken: 'demo-access-token',
      refreshToken: 'demo-refresh-token',
      user: studentUserStore,
    };
  },

  async register(payload: RegisterPayload): Promise<AuthSession> {
    await sleep();
    studentUserStore = {
      ...studentUserStore,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      status: 'active',
    };

    profileStore = {
      ...profileStore,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
    };

    return {
      accessToken: 'demo-access-token',
      refreshToken: 'demo-refresh-token',
      user: studentUserStore,
    };
  },

  async me(): Promise<StudentUser> {
    await sleep();
    return studentUserStore;
  },

  async refresh(refreshToken: string): Promise<AuthTokens> {
    await sleep(120);
    return {
      accessToken: `demo-access-token-${Date.now()}`,
      refreshToken: refreshToken || 'demo-refresh-token',
    };
  },

  async logout(): Promise<void> {
    await sleep(80);
  },

  async dashboardSummary(): Promise<DashboardResponse> {
    await sleep();
    const scheduled = appointmentStore.find((appointment) => appointment.status === 'scheduled') ?? null;

    return {
      profileCompletion: profileStore.completion,
      matchCount: matchStore.length,
      nextStep: 'Complete interview availability preferences',
      nextAppointment: scheduled,
      upcomingActions: [
        'Review top company matches',
        'Prepare interview answers in English',
        'Upload updated resume PDF',
      ],
    };
  },

  async getProfile(): Promise<ProfileResponse> {
    await sleep();
    return profileStore;
  },

  async updateProfile(payload: ProfilePayload): Promise<ProfileResponse> {
    await sleep();
    const nextProfile: StudentProfile = {
      ...profileStore,
      ...payload,
    };
    const completion = computeProfileCompletion(nextProfile);
    profileStore = {
      ...nextProfile,
      id: profileStore.id,
      completion,
    };
    studentUserStore = {
      ...studentUserStore,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      profileCompletion: completion,
    };

    return profileStore;
  },

  async uploadResume(file: File): Promise<ProfileResponse> {
    await sleep();
    const safeName = file.name.replace(/\s+/g, '_');

    profileStore = {
      ...profileStore,
      resumeFileName: file.name,
      resumeUrl: `https://example.com/uploads/${encodeURIComponent(safeName)}`,
      resumeUploadedAt: new Date().toISOString(),
      completion: computeProfileCompletion({
        ...profileStore,
        resumeFileName: file.name,
      }),
    };

    studentUserStore = {
      ...studentUserStore,
      profileCompletion: profileStore.completion,
    };

    return profileStore;
  },

  async uploadAvatar(file: File): Promise<ProfileResponse> {
    await sleep();
    const dataUrl = await readFileAsDataUrl(file);

    profileStore = {
      ...profileStore,
      avatarUrl: dataUrl,
    };

    studentUserStore = {
      ...studentUserStore,
      avatarUrl: profileStore.avatarUrl,
    };

    return profileStore;
  },

  async listMatches(query: MatchesQuery): Promise<MatchesResponse> {
    await sleep();
    let filtered = [...matchStore];

    if (query.industry) {
      filtered = filtered.filter((item) => item.industry.toLowerCase() === query.industry?.toLowerCase());
    }

    if (typeof query.minScore === 'number') {
      filtered = filtered.filter((item) => item.score >= query.minScore!);
    }

    if (query.search?.trim()) {
      const needle = query.search.trim().toLowerCase();
      filtered = filtered.filter((item) => item.companyName.toLowerCase().includes(needle));
    }

    return paginate(filtered, query.page ?? 1, query.pageSize ?? 10);
  },

  async listAppointments(query: AppointmentsQuery): Promise<AppointmentsResponse> {
    await sleep();
    let filtered = [...appointmentStore];

    if (query.status) {
      filtered = filtered.filter((item) => item.status === query.status);
    }

    filtered.sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime());
    return paginate(filtered, query.page ?? 1, query.pageSize ?? 10);
  },

  async createAppointment(payload: CreateAppointmentPayload): Promise<Appointment> {
    await sleep();
    const next: Appointment = {
      id: randomId('appt'),
      title: payload.title,
      date: new Date(payload.date).toISOString(),
      type: payload.type,
      notes: payload.notes,
      status: 'scheduled',
    };
    appointmentStore = [next, ...appointmentStore];
    return next;
  },

  async listThreads(query: MessageThreadsQuery): Promise<MessageThreadsResponse> {
    await sleep();
    const ordered = [...threadStore].sort(
      (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
    );
    return paginate(ordered, query.page ?? 1, query.pageSize ?? 20);
  },

  async listMessages(threadId: string, page = 1, pageSize = 20): Promise<MessagesResponse> {
    await sleep();
    const messages = messageStore[threadId] ?? [];
    return paginate(messages, page, pageSize);
  },

  async sendMessage(threadId: string, payload: SendMessagePayload): Promise<ChatMessage> {
    await sleep(120);
    const nextMessage: ChatMessage = {
      id: randomId('msg'),
      threadId,
      sender: 'student',
      content: payload.content,
      createdAt: new Date().toISOString(),
    };

    if (!messageStore[threadId]) {
      messageStore[threadId] = [];
    }
    messageStore[threadId].push(nextMessage);

    const threadIndex = threadStore.findIndex((thread) => thread.id === threadId);
    if (threadIndex >= 0) {
      const current = threadStore[threadIndex];
      threadStore[threadIndex] = {
        ...current,
        lastMessage: payload.content,
        updatedAt: nextMessage.createdAt,
      };
    } else {
      threadStore.unshift({
        id: threadId,
        companyName: 'Boarding Advisor',
        lastMessage: payload.content,
        unreadCount: 0,
        updatedAt: nextMessage.createdAt,
      });
    }

    return nextMessage;
  },

  async listJourney(): Promise<JourneyResponse> {
    await sleep();
    return { milestones: journeyStore };
  },

  async listResources(query: ResourcesQuery): Promise<ResourcesResponse> {
    await sleep();
    const filtered =
      query.category && query.category !== 'all'
        ? resourceStore.filter((item) => item.category === query.category)
        : resourceStore;

    return paginate(filtered, query.page ?? 1, query.pageSize ?? 10);
  },

  unwrap,
};
