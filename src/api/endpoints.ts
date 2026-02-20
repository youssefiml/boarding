export const AUTH_ENDPOINTS = {
  login: '/auth/login',
  register: '/auth/register',
  me: '/auth/me',
  refresh: '/auth/refresh',
  logout: '/auth/logout',
};

export const DASHBOARD_ENDPOINTS = {
  summary: '/students/dashboard/summary',
};

export const PROFILE_ENDPOINTS = {
  detail: '/students/profile',
  uploadResume: '/students/profile/resume',
  uploadAvatar: '/students/profile/avatar',
};

export const MATCHING_ENDPOINTS = {
  list: '/students/matches',
  detail: (matchId: string) => `/students/matches/${matchId}`,
};

export const APPOINTMENT_ENDPOINTS = {
  list: '/students/appointments',
  detail: (appointmentId: string) => `/students/appointments/${appointmentId}`,
};

export const MESSAGING_ENDPOINTS = {
  threads: '/students/messages/threads',
  messages: (threadId: string) => `/students/messages/threads/${threadId}`,
};

export const JOURNEY_ENDPOINTS = {
  list: '/students/journey',
};

export const RESOURCE_ENDPOINTS = {
  list: '/students/resources',
};
