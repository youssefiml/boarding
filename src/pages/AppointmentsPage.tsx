import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { appointmentsApi } from '@/api/modules/appointments.api';
import { PageHeader } from '@/app/layout/PageHeader/PageHeader';
import { Badge } from '@/ui/Badge/Badge';
import { Button } from '@/ui/Button/Button';
import { Card } from '@/ui/Card/Card';
import { EmptyState } from '@/ui/EmptyState/EmptyState';
import { Input } from '@/ui/Input/Input';
import { Pagination } from '@/ui/Pagination/Pagination';
import { Select } from '@/ui/Select/Select';
import { formatDateTime } from '@/lib/date';
import type { AppointmentsResponse } from '@/types/api';
import type { AppointmentStatus } from '@/types/domain';

const bookingSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  date: z.string().min(1, 'Date and time are required'),
  type: z.enum(['interview', 'coaching', 'orientation']),
  notes: z.string().max(400, 'Max 400 characters').optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

function appointmentBadgeVariant(status: AppointmentStatus): 'brand' | 'success' | 'warning' | 'neutral' {
  if (status === 'completed') {
    return 'success';
  }

  if (status === 'scheduled') {
    return 'brand';
  }

  if (status === 'cancelled') {
    return 'warning';
  }

  return 'neutral';
}

export function AppointmentsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<'all' | AppointmentStatus>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [response, setResponse] = useState<AppointmentsResponse | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      title: '',
      date: '',
      type: 'interview',
      notes: '',
    },
  });

  const loadAppointments = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await appointmentsApi.listAppointments({
        page,
        pageSize: 8,
        status: status === 'all' ? undefined : status,
      });

      setResponse(data);
    } catch {
      setResponse(null);
    } finally {
      setIsLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    void loadAppointments();
  }, [loadAppointments]);

  const onBook = async (values: BookingFormValues) => {
    await appointmentsApi.createAppointment(values);
    reset();
    await loadAppointments();
  };

  return (
    <div>
      <PageHeader title="Appointments" subtitle="Track interviews and book the next meeting with your placement team." />

      <div className="grid gap-4 lg:gap-5 lg:grid-cols-[2fr_1fr]">
        <Card>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Scheduled appointments</h2>
            <div className="w-full sm:max-w-[220px]">
              <Select
                label="Filter by status"
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value as 'all' | AppointmentStatus);
                  setPage(1);
                }}
              >
                <option value="all">All</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </div>
          </div>

          {isLoading ? <p className="text-sm text-slate-500 dark:text-slate-300">Loading appointments...</p> : null}

          {!isLoading && response && response.items.length === 0 ? (
            <EmptyState
              title="No appointments yet"
              description="Book your first interview or coaching session from the panel."
            />
          ) : null}

          {!isLoading && response && response.items.length > 0 ? (
            <>
              <div className="space-y-3">
                {response.items.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/65"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{appointment.title}</p>
                      <Badge variant={appointmentBadgeVariant(appointment.status)}>{appointment.status}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{formatDateTime(appointment.date)}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{appointment.type}</p>
                    {appointment.notes ? (
                      <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{appointment.notes}</p>
                    ) : null}
                  </div>
                ))}
              </div>
              <Pagination page={response.page} totalPages={response.totalPages} onPageChange={setPage} />
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

        <Card>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Book appointment</h2>
          <form className="mt-4 space-y-3" onSubmit={handleSubmit(onBook)} noValidate>
            <Input
              label="Title"
              placeholder="Interview prep call"
              {...register('title')}
              error={errors.title?.message}
            />
            <Input label="Date and time" type="datetime-local" {...register('date')} error={errors.date?.message} />
            <Select label="Type" {...register('type')} error={errors.type?.message}>
              <option value="interview">Interview</option>
              <option value="coaching">Coaching</option>
              <option value="orientation">Orientation</option>
            </Select>
            <Input
              label="Notes"
              placeholder="What should be prepared"
              {...register('notes')}
              error={errors.notes?.message}
            />
            <Button className="w-full" type="submit" isLoading={isSubmitting}>
              Book now
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}


