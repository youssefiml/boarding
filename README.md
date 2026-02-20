# Boarding Student App Front-end

Student-facing SPA for Boarding Agency, focused on a clear journey from account creation to internship placement and on-site integration.

## Stack

- React + Vite + TypeScript
- React Router
- Tailwind CSS
- Axios
- Zustand
- React Hook Form + Zod
- React Hot Toast

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

```bash
cp .env.example .env
```

3. Run development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Environment

`.env.example`

```bash
VITE_API_BASE_URL=http://localhost:5000/api
VITE_DEMO_MODE=true
```

When `VITE_DEMO_MODE=true`, the app uses in-memory mock data and works without backend connectivity.

## Architecture

### Folder Structure

```txt
src/
  api/
    client.ts
    endpoints.ts
    modules/
      auth.api.ts
      dashboard.api.ts
      profile.api.ts
      matching.api.ts
      appointments.api.ts
      messaging.api.ts
      journey.api.ts
      resources.api.ts
  app/
    App.tsx
    router.tsx
    routes.ts
    guards/
    layouts/
    providers/
  components/
    feedback/
    layout/
    ui/
  features/
    auth/
    onboarding/
  hooks/
  lib/
  pages/
    auth/
  stores/
  types/
```

### Routing Map

Public:

- `/login`
- `/register`

Protected:

- `/dashboard`
- `/onboarding`
- `/profile`
- `/matching`
- `/appointments`
- `/messaging`
- `/messaging/:threadId`
- `/journey`
- `/resources`

System:

- `/` redirects to `/dashboard` when authenticated, else `/login`
- `*` -> Not Found page

## Reusable UI Components

- `Button`
- `Input`
- `Select`
- `TextArea`
- `Card`
- `Badge`
- `Skeleton`
- `EmptyState`
- `ProgressBar`
- `Pagination`
- `PageHeader`
- `GlobalLoadingOverlay`

## State Management and Query Strategy

### Zustand Stores

- `auth.store.ts`
  - Persisted JWT session (`accessToken`, `refreshToken`, `user`)
  - Session actions: set/clear/update

- `ui.store.ts`
  - Global HTTP request counter for loading overlay
  - Centralized global API error queue/message

- `onboarding.store.ts`
  - Persisted onboarding draft and current step
  - Autosave support with timestamp

### Query Strategy

- Server state is fetched in page-level `useEffect` flows using typed API modules.
- Forms are managed with `react-hook-form` + `zodResolver`.
- Global request lifecycle is centralized in Axios interceptors.
- Global API errors are surfaced as toasts unless explicitly silenced per request.

## API Layer

- `apiClient` configured in `src/api/client.ts`
- Request interceptor:
  - Attach `Authorization: Bearer <accessToken>`
  - Start global loading tracker
- Response interceptor:
  - Stop loading tracker
  - Handle token refresh on `401` (single-flight refresh queue)
  - Push normalized errors to global UI store

Per-domain API modules isolate endpoint contracts and types:

- `authApi`
- `dashboardApi`
- `profileApi`
- `matchingApi`
- `appointmentsApi`
- `messagingApi`
- `journeyApi`
- `resourcesApi`

## Core Screens and Component Breakdown

- Auth
  - `LoginPage`, `RegisterPage`
  - Zod-validated forms, inline errors, auth session set on success

- Onboarding
  - `OnboardingPage`
  - 3-step flow with `PersonalInfoStep`, `EducationStep`, `PreferencesStep`
  - Progress bar, autosave, manual save, final submit

- Dashboard
  - `DashboardPage`
  - Summary cards: completion, matches, next step, next appointment

- Profile
  - `ProfilePage`
  - Full editable profile using same validation model as onboarding

- Matching
  - `MatchingPage`
  - Filters, score threshold, paginated match cards

- Appointments
  - `AppointmentsPage`
  - List + status filter, booking form, pagination

- Messaging
  - `MessagingPage`
  - Inbox thread list + chat panel, send message action

- Journey
  - `JourneyPage`
  - Timeline view with milestone statuses

- Resources
  - `ResourcesPage`
  - Category filters and paginated resource list

## UX Standards Included

- Mobile-first responsive layout
- Guarded routes
- Clear empty states
- Skeleton/loading placeholders
- Global loading indicator
- Toast notifications
- Accessible labels/focus states

## Production Notes

- Replace endpoint paths in `src/api/endpoints.ts` as needed to match IA Backoffice contracts.
- Tighten CORS and auth refresh behavior according to backend policy.
- Add automated tests for route guards, forms, and API error states.
