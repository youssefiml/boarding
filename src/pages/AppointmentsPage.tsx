import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { appointmentsApi } from '@/api/modules/appointments.api';
import { PageHeader } from '@/app/layout/PageHeader/PageHeader';
import { Button } from '@/ui/Button/Button';
import { Card } from '@/ui/Card/Card';
import { EmptyState } from '@/ui/EmptyState/EmptyState';
import { Input } from '@/ui/Input/Input';
import { Pagination } from '@/ui/Pagination/Pagination';
import { Select } from '@/ui/Select/Select';
import { Skeleton } from '@/ui/Skeleton/Skeleton';
import { TextArea } from '@/ui/TextArea/TextArea';
import { cn } from '@/lib/cn';
import { formatDateTime } from '@/lib/date';
import type { AppointmentsResponse } from '@/types/api';
import type { Appointment, AppointmentStatus, AppointmentType } from '@/types/domain';

const bookingSchema = z
  .object({
    title: z.string().trim().min(2, 'Title is required'),
    type: z.enum(['interview', 'coaching', 'orientation']),
    date: z.string().min(1, 'Date is required'),
    time: z.string().min(1, 'Time is required'),
    notes: z.string().max(400, 'Max 400 characters').optional(),
  })
  .superRefine((values, ctx) => {
    const scheduledDate = new Date(`${values.date}T${values.time}`);

    if (Number.isNaN(scheduledDate.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['time'],
        message: 'Select a valid date and time',
      });
    }
  });

type BookingFormValues = z.infer<typeof bookingSchema>;
type AppointmentTimelineFilter = 'all' | 'upcoming' | 'past' | 'cancelled';

interface TimelineGroup {
  key: string;
  label: string;
  items: Appointment[];
}

const timelineFilterLabels: Record<AppointmentTimelineFilter, string> = {
  all: 'All',
  upcoming: 'Upcoming',
  past: 'Past',
  cancelled: 'Cancelled',
};

const appointmentTypeLabels: Record<AppointmentType, string> = {
  interview: 'Interview',
  coaching: 'Coaching',
  orientation: 'Orientation',
};

const appointmentStatusLabels: Record<AppointmentStatus, string> = {
  scheduled: 'Scheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

function formatTimelineDate(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  }).format(parsed);
}

function formatTimelineTime(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return '--:--';
  }

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(parsed);
}

function dayKey(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function statusBadgeClasses(status: AppointmentStatus) {
  if (status === 'completed') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/40 dark:bg-emerald-500/10 dark:text-emerald-200';
  }

  if (status === 'cancelled') {
    return 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400/40 dark:bg-rose-500/10 dark:text-rose-200';
  }

  return 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-400/40 dark:bg-sky-500/10 dark:text-sky-200';
}

function toCalendarStamp(date: Date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function createCalendarLink(appointment: Appointment) {
  const start = new Date(appointment.date);

  if (Number.isNaN(start.getTime())) {
    return '#';
  }

  const end = new Date(start.getTime() + 45 * 60 * 1000);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: appointment.title,
    dates: `${toCalendarStamp(start)}/${toCalendarStamp(end)}`,
    details: appointment.notes || `Appointment type: ${appointmentTypeLabels[appointment.type]}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function toInputDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function toInputTime(date: Date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function notePreview(value: string) {
  const normalized = value.trim();

  if (normalized.length <= 130) {
    return normalized;
  }

  return `${normalized.slice(0, 127)}...`;
}

export function AppointmentsPage() {
  const [page, setPage] = useState(1);
  const [timelineFilter, setTimelineFilter] = useState<AppointmentTimelineFilter>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [response, setResponse] = useState<AppointmentsResponse | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const bookingPanelRef = useRef<HTMLDivElement | null>(null);
  const highlightTimeoutRef = useRef<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      title: '',
      type: 'interview',
      date: '',
      time: '',
      notes: '',
    },
  });

  const apiStatusFilter: AppointmentStatus | undefined =
    timelineFilter === 'cancelled' ? 'cancelled' : timelineFilter === 'upcoming' ? 'scheduled' : undefined;

  const loadAppointments = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await appointmentsApi.listAppointments({
        page,
        pageSize: 20,
        status: apiStatusFilter,
      });

      setResponse(data);
    } catch {
      setResponse(null);
    } finally {
      setIsLoading(false);
    }
  }, [apiStatusFilter, page]);

  useEffect(() => {
    void loadAppointments();
  }, [loadAppointments]);

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) {
        window.clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, []);

  const visibleAppointments = useMemo(() => {
    if (!response) {
      return [];
    }

    const now = Date.now();

    return [...response.items]
      .sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime())
      .filter((appointment) => {
        const timestamp = new Date(appointment.date).getTime();

        if (timelineFilter === 'upcoming') {
          return appointment.status === 'scheduled' && timestamp >= now;
        }

        if (timelineFilter === 'past') {
          return appointment.status === 'completed' || (timestamp < now && appointment.status !== 'cancelled');
        }

        if (timelineFilter === 'cancelled') {
          return appointment.status === 'cancelled';
        }

        return true;
      });
  }, [response, timelineFilter]);

  const groupedAppointments = useMemo<TimelineGroup[]>(() => {
    const groups: TimelineGroup[] = [];

    visibleAppointments.forEach((appointment) => {
      const key = dayKey(appointment.date);
      const previous = groups[groups.length - 1];

      if (!previous || previous.key !== key) {
        groups.push({
          key,
          label: formatTimelineDate(appointment.date),
          items: [appointment],
        });
        return;
      }

      previous.items.push(appointment);
    });

    return groups;
  }, [visibleAppointments]);

  const summaryStats = useMemo(() => {
    if (!response) {
      return { upcoming: 0, completed: 0, total: 0 };
    }

    const now = Date.now();
    const total = response.items.length;
    const upcoming = response.items.filter((appointment) => {
      const timestamp = new Date(appointment.date).getTime();
      return appointment.status === 'scheduled' && timestamp >= now;
    }).length;
    const completed = response.items.filter((appointment) => appointment.status === 'completed').length;

    return { upcoming, completed, total };
  }, [response]);

  const focusBookingPanel = useCallback(
    (dateHint?: string) => {
      if (dateHint) {
        const parsed = new Date(dateHint);

        if (!Number.isNaN(parsed.getTime())) {
          setValue('date', toInputDate(parsed));
          setValue('time', toInputTime(parsed));
        }
      }

      bookingPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(() => setFocus('title'), 220);
    },
    [setFocus, setValue]
  );

  const prefillForReschedule = useCallback(
    (appointment: Appointment) => {
      setValue('title', appointment.title);
      setValue('type', appointment.type);
      setValue('notes', appointment.notes ?? '');

      const parsed = new Date(appointment.date);
      if (!Number.isNaN(parsed.getTime())) {
        setValue('date', toInputDate(parsed));
        setValue('time', toInputTime(parsed));
      }

      focusBookingPanel();
    },
    [focusBookingPanel, setValue]
  );

  const onBook = async (values: BookingFormValues) => {
    try {
      const scheduledDate = new Date(`${values.date}T${values.time}`);
      const created = await appointmentsApi.createAppointment({
        title: values.title,
        type: values.type,
        date: scheduledDate.toISOString(),
        notes: values.notes?.trim() || undefined,
      });

      reset({
        title: '',
        type: 'interview',
        date: '',
        time: '',
        notes: '',
      });

      await loadAppointments();
      toast.success('Appointment scheduled successfully.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setHighlightedId(created.id);

      if (highlightTimeoutRef.current) {
        window.clearTimeout(highlightTimeoutRef.current);
      }

      highlightTimeoutRef.current = window.setTimeout(() => {
        setHighlightedId((current) => (current === created.id ? null : current));
      }, 3000);
    } catch {
      toast.error('Unable to schedule appointment right now.');
    }
  };

  return (
    <div>
      <PageHeader
        title="Appointments"
        subtitle="Manage interviews and coaching sessions."
        action={
          <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
            <span className="inline-flex min-h-9 items-center rounded-full border border-slate-300/85 bg-white/75 px-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:border-slate-600/85 dark:bg-slate-800/85 dark:text-slate-200">
              {summaryStats.upcoming} upcoming  -  {summaryStats.completed} completed
            </span>
            <Button className="w-full sm:w-auto" type="button" onClick={() => focusBookingPanel()}>
              Book new appointment
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)] lg:gap-5">
        <Card className="overflow-hidden">
          <div className="mb-5 flex flex-col gap-4 border-b border-slate-200 pb-4 dark:border-slate-700">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Timeline</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Chronological overview of your interviews and coaching sessions.
                </p>
              </div>

              <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100/70 p-1 dark:border-slate-700 dark:bg-slate-800/85">
                {(Object.keys(timelineFilterLabels) as AppointmentTimelineFilter[]).map((filterValue) => (
                  <button
                    key={filterValue}
                    type="button"
                    onClick={() => {
                      setTimelineFilter(filterValue);
                      setPage(1);
                    }}
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900',
                      timelineFilter === filterValue
                        ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100'
                    )}
                    aria-pressed={timelineFilter === filterValue}
                  >
                    {timelineFilterLabels[filterValue]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
            </div>
          ) : null}

          {!isLoading && response && groupedAppointments.length === 0 ? (
            <EmptyState
              title={timelineFilter === 'all' ? 'No appointments yet' : `No ${timelineFilter} appointments`}
              description={
                timelineFilter === 'all'
                  ? 'Book your first interview or coaching session to start your timeline.'
                  : 'Try another filter or schedule a new appointment.'
              }
              actionLabel={timelineFilter === 'all' ? 'Book your first appointment' : 'Show all'}
              onAction={() => {
                if (timelineFilter === 'all') {
                  focusBookingPanel();
                  return;
                }

                setTimelineFilter('all');
                setPage(1);
              }}
            />
          ) : null}

          {!isLoading && response && groupedAppointments.length > 0 ? (
            <>
              <div className="space-y-6">
                {groupedAppointments.map((group, index) => {
                  const nextGroupDate = groupedAppointments[index + 1]?.items[0]?.date;

                  return (
                    <section key={group.key} className="relative pl-7">
                      <span
                        className="absolute left-2 top-0 h-full w-px bg-slate-200 dark:bg-slate-700/85"
                        aria-hidden
                      />

                      <div className="relative mb-3 flex items-center gap-3">
                        <span
                          className="relative z-10 h-3 w-3 rounded-full border-2 border-white bg-brand-500 dark:border-slate-900 dark:bg-brand-400"
                          aria-hidden
                        />
                        <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-300">
                          {group.label}
                        </h3>
                      </div>

                      <div className="space-y-3 pl-2">
                        {group.items.map((appointment) => (
                          <article
                            key={appointment.id}
                            className={cn(
                              'rounded-xl border p-4 shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-px hover:shadow-md dark:shadow-none',
                              highlightedId === appointment.id
                                ? 'border-brand-400 bg-brand-50/75 dark:border-brand-400/70 dark:bg-brand-500/10'
                                : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/70'
                            )}
                          >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div className="space-y-1">
                                <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                  {appointment.title}
                                </h4>
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                  {formatTimelineTime(appointment.date)}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  {formatDateTime(appointment.date)}
                                </p>
                              </div>
                              <span
                                className={cn(
                                  'inline-flex min-h-7 items-center rounded-full border px-2.5 text-xs font-semibold',
                                  statusBadgeClasses(appointment.status)
                                )}
                              >
                                {appointmentStatusLabels[appointment.status]}
                              </span>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                              <span className="inline-flex min-h-7 items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                Type: {appointmentTypeLabels[appointment.type]}
                              </span>
                              {appointment.notes ? (
                                <span className="inline-flex min-h-7 items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                  Notes available
                                </span>
                              ) : null}
                            </div>

                            {appointment.notes ? (
                              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                {notePreview(appointment.notes)}
                              </p>
                            ) : null}

                            <div className="mt-4 flex flex-wrap gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => prefillForReschedule(appointment)}
                              >
                                Reschedule
                              </Button>

                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  toast('Cancellation request sent to your advisor.');
                                }}
                              >
                                Cancel
                              </Button>

                              <a
                                className="inline-flex min-h-9 items-center justify-center rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-900"
                                href={createCalendarLink(appointment)}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Add to calendar
                              </a>
                            </div>
                          </article>
                        ))}
                      </div>

                      {nextGroupDate ? (
                        <div className="mt-3 pl-2">
                          <button
                            type="button"
                            onClick={() => focusBookingPanel(nextGroupDate)}
                            className="inline-flex min-h-8 items-center rounded-lg border border-dashed border-slate-300 px-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 transition hover:border-brand-300 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-600 dark:text-slate-300 dark:hover:border-brand-400/70 dark:hover:text-brand-300 dark:focus-visible:ring-offset-slate-900"
                          >
                            Add appointment
                          </button>
                        </div>
                      ) : null}
                    </section>
                  );
                })}
              </div>

              {response.totalPages > 1 ? <Pagination page={response.page} totalPages={response.totalPages} onPageChange={setPage} /> : null}
            </>
          ) : null}

          {!isLoading && !response ? (
            <EmptyState
              title="Unable to load appointments"
              description="Please retry in a few seconds."
              actionLabel="Retry"
              onAction={() => {
                void loadAppointments();
              }}
            />
          ) : null}
        </Card>

        <div ref={bookingPanelRef} className="self-start lg:sticky lg:top-24">
          <Card>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Book appointment</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Add your next interview or coaching session with clear preparation notes.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onBook)} noValidate>
              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-300">
                  Meeting details
                </p>
                <Input
                  label="Title"
                  placeholder="Placement coaching session"
                  {...register('title')}
                  error={errors.title?.message}
                />
                <Select label="Type" {...register('type')} error={errors.type?.message}>
                  <option value="interview">Interview</option>
                  <option value="coaching">Coaching</option>
                  <option value="orientation">Orientation</option>
                </Select>
              </div>

              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-300">Schedule</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input label="Date" type="date" {...register('date')} error={errors.date?.message} />
                  <Input label="Time" type="time" {...register('time')} error={errors.time?.message} />
                </div>
              </div>

              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-300">
                  Preparation
                </p>
                <TextArea
                  label="Notes"
                  placeholder="Agenda, documents to prepare, and key talking points."
                  rows={4}
                  maxLength={400}
                  {...register('notes')}
                  error={errors.notes?.message}
                  hint="Optional. Keep it concise and actionable."
                />
              </div>

              <Button className="w-full" type="submit" isLoading={isSubmitting}>
                Schedule appointment
              </Button>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {summaryStats.total > 0
                  ? `${summaryStats.total} appointments in current feed.`
                  : 'No appointments yet. Start by scheduling your first one.'}
              </p>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
