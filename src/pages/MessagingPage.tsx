
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

import { appointmentsApi } from '@/api/modules/appointments.api';
import { matchingApi } from '@/api/modules/matching.api';
import { messagingApi } from '@/api/modules/messaging.api';
import { PageHeader } from '@/app/layout/PageHeader/PageHeader';
import { ROUTES } from '@/app/routes';
import { Badge } from '@/ui/Badge/Badge';
import { Button } from '@/ui/Button/Button';
import { Card } from '@/ui/Card/Card';
import { EmptyState } from '@/ui/EmptyState/EmptyState';
import { Input } from '@/ui/Input/Input';
import { Skeleton } from '@/ui/Skeleton/Skeleton';
import { cn } from '@/lib/cn';
import { formatDateTime } from '@/lib/date';
import type { AppointmentsResponse, MatchesResponse, MessagesResponse, MessageThreadsResponse } from '@/types/api';
import type { ChatMessage, CompanyMatch, MessageThread } from '@/types/domain';

const sendMessageSchema = z.object({
  content: z.string().trim().min(1, 'Type a message').max(1000, 'Message too long'),
});

type SendMessageFormValues = z.infer<typeof sendMessageSchema>;
type ThreadTab = 'all' | 'companies' | 'advisors' | 'unread';

interface PendingMessage {
  id: string;
  threadId: string;
  content: string;
  createdAt: string;
  status: 'sending' | 'failed';
}

interface DisplayMessage {
  id: string;
  threadId: string;
  sender: ChatMessage['sender'];
  content: string;
  createdAt: string;
  status?: PendingMessage['status'];
  isPending?: boolean;
}

type MessageEntry =
  | {
      type: 'day';
      key: string;
      label: string;
    }
  | {
      type: 'message';
      key: string;
      message: DisplayMessage;
    };

const threadTabs: Array<{ id: ThreadTab; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'companies', label: 'Companies' },
  { id: 'advisors', label: 'Advisors' },
  { id: 'unread', label: 'Unread' },
];

const quickReplyTemplates = [
  'Thank you for the update. I confirm my availability.',
  'Could we reschedule this to next Tuesday afternoon?',
  'I will share the requested documents today.',
] as const;

const applicationStatusLabels: Record<CompanyMatch['status'], string> = {
  new: 'Interview requested',
  reviewed: 'Awaiting response',
  accepted: 'In progress',
  rejected: 'Needs review',
};

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function threadCategory(thread: MessageThread): 'advisor' | 'company' {
  const text = thread.companyName.toLowerCase();
  if (text.includes('advisor') || text.includes('agency')) {
    return 'advisor';
  }

  return 'company';
}

function hasInterviewSignal(content: string) {
  return /interview|availability|schedule|meeting/i.test(content);
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

function dayLabel(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed);
}

function timeLabel(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(parsed);
}

function companyInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return 'C';
  }

  const first = parts[0]?.charAt(0) ?? 'C';
  const second = parts[1]?.charAt(0) ?? '';
  return `${first}${second}`.toUpperCase();
}

function buildMessageEntries(messages: DisplayMessage[]): MessageEntry[] {
  const entries: MessageEntry[] = [];
  let previousDay = '';

  messages
    .slice()
    .sort((left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime())
    .forEach((message) => {
      const key = dayKey(message.createdAt);
      if (key !== previousDay) {
        previousDay = key;
        entries.push({
          type: 'day',
          key: `day-${key}`,
          label: dayLabel(message.createdAt),
        });
      }

      entries.push({
        type: 'message',
        key: `msg-${message.id}`,
        message,
      });
    });

  return entries;
}

function matchThreadToCompany(thread: MessageThread, matches: CompanyMatch[]) {
  const threadValue = normalize(thread.companyName);

  return (
    matches.find((item) => {
      const companyValue = normalize(item.companyName);
      return companyValue.includes(threadValue) || threadValue.includes(companyValue);
    }) ?? null
  );
}

function isNearBottom(element: HTMLElement) {
  return element.scrollTop + element.clientHeight >= element.scrollHeight - 24;
}

function desktopMedia() {
  return typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;
}

export function MessagingPage() {
  const { threadId } = useParams<{ threadId: string }>();
  const navigate = useNavigate();

  const [isDesktop, setIsDesktop] = useState(() => desktopMedia());

  const [threads, setThreads] = useState<MessageThreadsResponse | null>(null);
  const [messages, setMessages] = useState<MessagesResponse | null>(null);
  const [matches, setMatches] = useState<MatchesResponse | null>(null);
  const [appointments, setAppointments] = useState<AppointmentsResponse | null>(null);

  const [isLoadingThreads, setIsLoadingThreads] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingContext, setIsLoadingContext] = useState(true);

  const [threadTab, setThreadTab] = useState<ThreadTab>('all');
  const [threadSearch, setThreadSearch] = useState('');
  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([]);
  const [showJumpToLatest, setShowJumpToLatest] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sentPulseId, setSentPulseId] = useState<string | null>(null);

  const typingTimeoutRef = useRef<number | null>(null);
  const pulseTimeoutRef = useRef<number | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const composerRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SendMessageFormValues>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      content: '',
    },
    mode: 'onBlur',
  });

  const contentValue = watch('content') ?? '';

  const contentField = register('content');

  const loadThreads = useCallback(async () => {
    setIsLoadingThreads(true);

    try {
      const data = await messagingApi.listThreads({ page: 1, pageSize: 40 });
      setThreads(data);
    } catch {
      setThreads(null);
    } finally {
      setIsLoadingThreads(false);
    }
  }, []);

  const loadMessages = useCallback(async () => {
    if (!threadId) {
      setMessages(null);
      return;
    }

    setIsLoadingMessages(true);

    try {
      const data = await messagingApi.listMessages(threadId, 1, 80);
      setMessages(data);
    } catch {
      setMessages(null);
    } finally {
      setIsLoadingMessages(false);
    }
  }, [threadId]);

  const loadContext = useCallback(async () => {
    setIsLoadingContext(true);

    try {
      const [matchData, appointmentData] = await Promise.all([
        matchingApi.listMatches({ page: 1, pageSize: 40 }),
        appointmentsApi.listAppointments({ page: 1, pageSize: 30 }),
      ]);

      setMatches(matchData);
      setAppointments(appointmentData);
    } catch {
      setMatches(null);
      setAppointments(null);
    } finally {
      setIsLoadingContext(false);
    }
  }, []);

  useEffect(() => {
    void loadThreads();
    void loadContext();
  }, [loadContext, loadThreads]);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const media = window.matchMedia('(min-width: 1024px)');
    const onChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
    };

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    }

    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, []);

  useEffect(() => {
    if (!threadId && threads && threads.items.length > 0 && isDesktop) {
      navigate(`${ROUTES.messaging}/${threads.items[0].id}`, { replace: true });
    }
  }, [isDesktop, navigate, threadId, threads]);

  useEffect(() => {
    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }

    if (pulseTimeoutRef.current) {
      window.clearTimeout(pulseTimeoutRef.current);
    }

    return () => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }

      if (pulseTimeoutRef.current) {
        window.clearTimeout(pulseTimeoutRef.current);
      }
    };
  }, []);

  const filteredThreads = useMemo(() => {
    if (!threads) {
      return [];
    }

    const searchNeedle = threadSearch.trim().toLowerCase();

    return threads.items.filter((thread) => {
      const type = threadCategory(thread);

      if (threadTab === 'companies' && type !== 'company') {
        return false;
      }

      if (threadTab === 'advisors' && type !== 'advisor') {
        return false;
      }

      if (threadTab === 'unread' && thread.unreadCount === 0) {
        return false;
      }

      if (searchNeedle) {
        const value = `${thread.companyName} ${thread.lastMessage}`.toLowerCase();
        if (!value.includes(searchNeedle)) {
          return false;
        }
      }

      return true;
    });
  }, [threadSearch, threadTab, threads]);

  const selectedThread = useMemo(() => {
    if (!threadId || !threads) {
      return null;
    }

    return threads.items.find((item) => item.id === threadId) ?? null;
  }, [threadId, threads]);

  const selectedMatch = useMemo(() => {
    if (!selectedThread || !matches) {
      return null;
    }

    return matchThreadToCompany(selectedThread, matches.items);
  }, [matches, selectedThread]);

  const nextRelatedAppointment = useMemo(() => {
    if (!selectedThread || !appointments) {
      return null;
    }

    const threadNeedle = normalize(selectedThread.companyName);

    return (
      appointments.items
        .filter((item) => item.status === 'scheduled')
        .filter((item) => {
          const titleNeedle = normalize(item.title);
          return titleNeedle.includes(threadNeedle) || item.type === 'interview';
        })
        .sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime())[0] ?? null
    );
  }, [appointments, selectedThread]);

  const conversationStatus = useMemo(() => {
    if (!selectedThread) {
      return { label: 'No conversation', variant: 'neutral' as const };
    }

    if (hasInterviewSignal(selectedThread.lastMessage)) {
      return { label: 'Interview requested', variant: 'brand' as const };
    }

    if (selectedThread.unreadCount > 0) {
      return { label: 'Awaiting your reply', variant: 'warning' as const };
    }

    return { label: 'Awaiting response', variant: 'neutral' as const };
  }, [selectedThread]);

  const threadPendingMessages = useMemo(() => {
    if (!threadId) {
      return [];
    }

    return pendingMessages
      .filter((item) => item.threadId === threadId)
      .map<DisplayMessage>((item) => ({
        id: item.id,
        threadId: item.threadId,
        sender: 'student',
        content: item.content,
        createdAt: item.createdAt,
        status: item.status,
        isPending: true,
      }));
  }, [pendingMessages, threadId]);

  const combinedMessages = useMemo<DisplayMessage[]>(() => {
    const base = messages?.items.map<DisplayMessage>((item) => ({
      id: item.id,
      threadId: item.threadId,
      sender: item.sender,
      content: item.content,
      createdAt: item.createdAt,
    })) ?? [];

    return [...base, ...threadPendingMessages].sort(
      (left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
    );
  }, [messages, threadPendingMessages]);

  const messageEntries = useMemo(() => buildMessageEntries(combinedMessages), [combinedMessages]);

  const showInterviewAction = useMemo(() => {
    const lastInbound = combinedMessages
      .slice()
      .reverse()
      .find((item) => item.sender !== 'student');

    if (!lastInbound) {
      return false;
    }

    return hasInterviewSignal(lastInbound.content);
  }, [combinedMessages]);

  const scrollToBottom = useCallback((behavior: 'auto' | 'smooth' = 'smooth') => {
    if (!chatScrollRef.current) {
      return;
    }

    chatScrollRef.current.scrollTo({
      top: chatScrollRef.current.scrollHeight,
      behavior,
    });
  }, []);

  useEffect(() => {
    if (!chatScrollRef.current) {
      return;
    }

    window.setTimeout(() => {
      scrollToBottom('auto');
      setShowJumpToLatest(false);
    }, 0);
  }, [threadId, scrollToBottom]);

  useEffect(() => {
    if (!chatScrollRef.current || combinedMessages.length === 0) {
      return;
    }

    const container = chatScrollRef.current;
    const lastMessage = combinedMessages[combinedMessages.length - 1];

    if (isNearBottom(container) || lastMessage.sender === 'student') {
      scrollToBottom('smooth');
      setShowJumpToLatest(false);
    } else {
      setShowJumpToLatest(true);
    }
  }, [combinedMessages, scrollToBottom]);

  const autoResizeComposer = useCallback(() => {
    if (!composerRef.current) {
      return;
    }

    composerRef.current.style.height = 'auto';
    const nextHeight = Math.min(180, composerRef.current.scrollHeight);
    composerRef.current.style.height = `${nextHeight}px`;
  }, []);

  useEffect(() => {
    autoResizeComposer();
  }, [autoResizeComposer, contentValue]);

  const sendMessage = useCallback(
    async (content: string, retryId?: string) => {
      if (!threadId) {
        return;
      }

      const trimmed = content.trim();
      if (!trimmed) {
        return;
      }

      const pendingId = retryId ?? `pending-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const createdAt = new Date().toISOString();

      setPendingMessages((current) => {
        if (retryId) {
          return current.map((item) =>
            item.id === retryId
              ? {
                  ...item,
                  content: trimmed,
                  createdAt,
                  status: 'sending',
                }
              : item
          );
        }

        return [
          ...current,
          {
            id: pendingId,
            threadId,
            content: trimmed,
            createdAt,
            status: 'sending',
          },
        ];
      });

      try {
        const sent = await messagingApi.sendMessage(threadId, { content: trimmed });
        setPendingMessages((current) => current.filter((item) => item.id !== pendingId));

        setSentPulseId(sent.id);
        if (pulseTimeoutRef.current) {
          window.clearTimeout(pulseTimeoutRef.current);
        }
        pulseTimeoutRef.current = window.setTimeout(() => {
          setSentPulseId(null);
        }, 1500);

        await Promise.all([loadMessages(), loadThreads()]);

        setIsTyping(true);
        if (typingTimeoutRef.current) {
          window.clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = window.setTimeout(() => {
          setIsTyping(false);
        }, 1400);
      } catch {
        setPendingMessages((current) =>
          current.map((item) =>
            item.id === pendingId
              ? {
                  ...item,
                  status: 'failed',
                }
              : item
          )
        );

        toast.error('Message failed. Retry from the thread.');
      }
    },
    [loadMessages, loadThreads, threadId]
  );

  const onSend = async (values: SendMessageFormValues) => {
    const content = values.content.trim();
    if (!content) {
      return;
    }

    reset({ content: '' });
    await sendMessage(content);
  };

  const retryMessage = useCallback(
    (message: DisplayMessage) => {
      if (!message.isPending || message.status !== 'failed') {
        return;
      }

      void sendMessage(message.content, message.id);
    },
    [sendMessage]
  );

  const applyQuickTemplate = useCallback(
    (template: string) => {
      setValue('content', template, { shouldDirty: true, shouldValidate: true });
      window.setTimeout(() => {
        composerRef.current?.focus();
        autoResizeComposer();
      }, 0);
    },
    [autoResizeComposer, setValue]
  );

  const openCompanyDetails = useCallback(() => {
    navigate(ROUTES.matching);
    toast('Use matching page to review company details.');
  }, [navigate]);

  const openInterviewBooking = useCallback(() => {
    navigate(ROUTES.appointments);
    toast.success('Open appointments to schedule or confirm interview time.');
  }, [navigate]);

  const contextPanelBody = selectedThread ? (
    <div className="space-y-3">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/70">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-300">Company info</p>
        <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{selectedThread.companyName}</p>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{selectedMatch?.location ?? 'Location information pending'}</p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/70">
          <p className="text-xs text-slate-500 dark:text-slate-400">Match score</p>
          <p className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">{selectedMatch ? `${selectedMatch.score}%` : 'N/A'}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/70">
          <p className="text-xs text-slate-500 dark:text-slate-400">Application status</p>
          <p className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">
            {selectedMatch ? applicationStatusLabels[selectedMatch.status] : 'Awaiting match sync'}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/70">
        <p className="text-xs text-slate-500 dark:text-slate-400">Upcoming appointment</p>
        <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
          {nextRelatedAppointment ? nextRelatedAppointment.title : 'No scheduled appointment'}
        </p>
        {nextRelatedAppointment ? (
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{formatDateTime(nextRelatedAppointment.date)}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Button type="button" className="w-full" onClick={openInterviewBooking}>
          Schedule interview
        </Button>
        <Button type="button" variant="secondary" className="w-full" onClick={openCompanyDetails}>
          View matching details
        </Button>
      </div>
    </div>
  ) : (
    <EmptyState title="No context yet" description="Select a thread to view company and placement context." />
  );

  const shouldShowThreadList = isDesktop || !threadId;
  const shouldShowConversation = isDesktop || Boolean(threadId);

  return (
    <div>
      <PageHeader title="Messaging" subtitle="Keep placement conversations calm, clear, and action oriented." />

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-[minmax(260px,0.34fr)_minmax(0,1fr)] 2xl:grid-cols-[minmax(260px,0.25fr)_minmax(0,0.5fr)_minmax(280px,0.25fr)]">
        <Card className={cn('lg:min-h-[620px] min-w-0 p-3 sm:p-4', shouldShowThreadList ? 'block' : 'hidden lg:block')}>
          <div className="mb-4 space-y-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Inbox</h2>
              <p className="text-xs text-slate-500 dark:text-slate-300">Prioritize active conversations and unread updates.</p>
            </div>

            <Input
              label="Search conversations"
              value={threadSearch}
              onChange={(event) => {
                setThreadSearch(event.target.value);
              }}
              placeholder="Company or message"
            />

            <div className="grid w-full grid-cols-2 gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 sm:flex sm:items-center sm:overflow-x-auto dark:border-slate-700 dark:bg-slate-800/70">
              {threadTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setThreadTab(tab.id)}
                  className={cn(
                    'w-full rounded-lg px-2.5 py-1.5 text-center text-xs font-semibold uppercase tracking-[0.08em] whitespace-nowrap transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto sm:shrink-0 dark:focus-visible:ring-offset-slate-900',
                    threadTab === tab.id
                      ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {isLoadingThreads ? (
            <div className="space-y-2">
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
            </div>
          ) : null}

          {!isLoadingThreads && threads && threads.items.length === 0 ? (
            <EmptyState
              title="No active conversations"
              description="Start by applying to a company to open your first thread."
              actionLabel="View matches"
              onAction={() => navigate(ROUTES.matching)}
            />
          ) : null}

          {!isLoadingThreads && threads && threads.items.length > 0 ? (
            <div className={cn('space-y-2 pr-1', isDesktop ? 'max-h-[470px] overflow-y-auto' : '')}>
              {filteredThreads.length === 0 ? (
                <EmptyState
                  title="No threads for this filter"
                  description="Try a different tab or search query."
                  actionLabel="Show all"
                  onAction={() => {
                    setThreadTab('all');
                    setThreadSearch('');
                  }}
                />
              ) : (
                filteredThreads.map((thread) => {
                  const isActive = thread.id === threadId;
                  const interviewActive = hasInterviewSignal(thread.lastMessage);

                  return (
                    <button
                      key={thread.id}
                      type="button"
                      className={cn(
                        'group w-full rounded-xl border px-3 py-3 text-left transition-all hover:-translate-y-[1px] hover:shadow-sm',
                        isActive
                          ? 'border-brand-300 border-l-4 bg-brand-50 dark:border-brand-400/70 dark:bg-brand-500/15'
                          : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/75 dark:hover:border-slate-600'
                      )}
                      onClick={() => {
                        navigate(`${ROUTES.messaging}/${thread.id}`);
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{thread.companyName}</p>
                          <p className="mt-1 truncate text-xs text-slate-600 dark:text-slate-300">{thread.lastMessage}</p>
                        </div>

                        <div className="shrink-0 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <span
                              className={cn(
                                'inline-block h-2 w-2 rounded-full',
                                interviewActive
                                  ? 'bg-emerald-500'
                                  : thread.unreadCount > 0
                                    ? 'bg-brand-500'
                                    : 'bg-slate-300 dark:bg-slate-600'
                              )}
                              aria-hidden
                            />
                            {thread.unreadCount > 0 ? <Badge variant="brand">{thread.unreadCount}</Badge> : null}
                          </div>
                          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{timeLabel(thread.updatedAt)}</p>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          ) : null}
        </Card>

        <Card className={cn('lg:min-h-[620px] min-w-0 p-3 sm:p-4', shouldShowConversation ? 'flex flex-col' : 'hidden lg:flex lg:flex-col')}>
          {selectedThread ? (
            <>
              <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-700">
                <div className="flex items-start gap-3">
                  {!isDesktop ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigate(ROUTES.messaging);
                      }}
                    >
                      Back
                    </Button>
                  ) : null}

                  <div className="grid h-10 w-10 place-items-center rounded-full border border-slate-300 bg-slate-100 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
                    {companyInitials(selectedThread.companyName)}
                  </div>

                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{selectedThread.companyName}</h2>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant={conversationStatus.variant}>{conversationStatus.label}</Badge>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Updated {formatDateTime(selectedThread.updatedAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="grid w-full gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:justify-end">
                  <Button type="button" variant="outline" size="sm" className="w-full sm:w-auto" onClick={openCompanyDetails}>
                    View company
                  </Button>
                  <Button type="button" size="sm" className="w-full sm:w-auto" onClick={openInterviewBooking}>
                    Book interview
                  </Button>
                </div>
              </div>

              <details className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/70 2xl:hidden">
                <summary className="cursor-pointer text-sm font-semibold text-slate-900 dark:text-slate-100">Conversation context</summary>
                <div className="mt-3">{contextPanelBody}</div>
              </details>

              <div
                ref={chatScrollRef}
                onScroll={() => {
                  if (chatScrollRef.current && isNearBottom(chatScrollRef.current)) {
                    setShowJumpToLatest(false);
                  }
                }}
                className="relative mt-4 pr-1 lg:flex-1 lg:overflow-y-auto"
              >
                {isLoadingMessages ? (
                  <div className="space-y-2">
                    <Skeleton className="h-16 w-[70%] rounded-xl" />
                    <Skeleton className="ml-auto h-16 w-[70%] rounded-xl" />
                    <Skeleton className="h-16 w-[70%] rounded-xl" />
                  </div>
                ) : null}

                {!isLoadingMessages && messageEntries.length === 0 ? (
                  <EmptyState title="No messages yet" description="Start the conversation with your first message." />
                ) : null}

                {!isLoadingMessages && messageEntries.length > 0 ? (
                  <div className="space-y-3">
                    {messageEntries.map((entry) => {
                      if (entry.type === 'day') {
                        return (
                          <div key={entry.key} className="flex justify-center">
                            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
                              {entry.label}
                            </span>
                          </div>
                        );
                      }

                      const message = entry.message;
                      const isStudent = message.sender === 'student';
                      const isFailed = message.status === 'failed';
                      const isSending = message.status === 'sending';
                      const hasPulse = sentPulseId === message.id;

                      return (
                        <article
                          key={entry.key}
                          className={cn(
                            'group max-w-[86%] rounded-xl border px-3 py-2 transition-shadow sm:max-w-[75%] lg:max-w-[70%]',
                            isStudent
                              ? 'ml-auto border-brand-500/60 bg-brand-600 text-white'
                              : 'mr-auto border-slate-200 bg-slate-50 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100',
                            hasPulse ? 'ring-2 ring-brand-300 dark:ring-brand-400/70' : '',
                            isFailed ? 'border-rose-400 bg-rose-50 text-rose-900 dark:border-rose-400 dark:bg-rose-500/10 dark:text-rose-100' : ''
                          )}
                        >
                          <p className="whitespace-pre-wrap break-words text-sm leading-6">{message.content}</p>

                          <div className="mt-1 flex items-center justify-between gap-3">
                            <span
                              className={cn(
                                'text-[11px] transition-opacity',
                                message.isPending ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100',
                                isStudent && !isFailed ? 'text-brand-100' : 'text-slate-500 dark:text-slate-300'
                              )}
                            >
                              {timeLabel(message.createdAt)}
                            </span>

                            {isSending ? (
                              <span className="text-[11px] text-brand-100">Sending...</span>
                            ) : null}

                            {isFailed ? (
                              <button
                                type="button"
                                className="text-[11px] font-semibold text-rose-700 underline underline-offset-2 hover:text-rose-800 dark:text-rose-300 dark:hover:text-rose-200"
                                onClick={() => retryMessage(message)}
                              >
                                Retry
                              </button>
                            ) : null}
                          </div>
                        </article>
                      );
                    })}

                    {isTyping ? (
                      <div className="mr-auto inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400 [animation-delay:120ms]" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400 [animation-delay:240ms]" />
                        <span className="ml-1">Typing...</span>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {showJumpToLatest ? (
                  <div className="sticky bottom-3 mt-3 flex justify-center">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        scrollToBottom();
                        setShowJumpToLatest(false);
                      }}
                    >
                      New messages - Jump to latest
                    </Button>
                  </div>
                ) : null}
              </div>

              {showInterviewAction ? (
                <div className="mt-3 rounded-xl border border-brand-200 bg-brand-50 p-3 dark:border-slate-600 dark:bg-slate-800">
                  <p className="text-sm font-semibold text-brand-800 dark:text-slate-100">Interview invitation detected</p>
                  <p className="mt-1 text-xs text-brand-700 dark:text-slate-300">Respond quickly to keep your placement momentum.</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        void sendMessage('Thank you for the invitation. I accept the proposed interview slot.');
                      }}
                    >
                      Accept
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        applyQuickTemplate('Thank you for the invitation. Could we propose an alternative time this week?');
                      }}
                    >
                      Propose new time
                    </Button>
                  </div>
                </div>
              ) : null}

              <div className="mt-4 border-t border-slate-200 pt-3 dark:border-slate-700">
                <div className="mb-2 flex flex-wrap gap-2">
                  {quickReplyTemplates.map((template) => (
                    <button
                      key={template}
                      type="button"
                      onClick={() => applyQuickTemplate(template)}
                      className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-slate-100 dark:focus-visible:ring-offset-slate-900"
                    >
                      Quick reply
                    </button>
                  ))}
                </div>

                <form className="space-y-2" onSubmit={handleSubmit(onSend)}>
                  <div className="flex items-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        toast('File attachment will be available soon.');
                      }}
                    >
                      Attach
                    </Button>

                    <label className="flex-1">
                      <span className="sr-only">Message</span>
                      <textarea
                        {...contentField}
                        ref={(element) => {
                          contentField.ref(element);
                          composerRef.current = element;
                        }}
                        className="max-h-[180px] min-h-[92px] w-full resize-none rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm leading-6 text-slate-900 transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-brand-400 dark:focus:ring-brand-500/30"
                        placeholder="Write a message"
                        onInput={() => {
                          autoResizeComposer();
                        }}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' && !event.shiftKey) {
                            event.preventDefault();
                            void handleSubmit(onSend)();
                          }
                        }}
                      />
                    </label>

                    <Button type="submit" className="shrink-0" isLoading={isSubmitting}>
                      Send
                    </Button>
                  </div>

                  {contentValue.length >= 850 ? (
                    <p className="text-right text-xs text-slate-500 dark:text-slate-400">{contentValue.length}/1000</p>
                  ) : null}

                  {errors.content?.message ? (
                    <p className="text-xs font-medium text-rose-600 dark:text-rose-300">{errors.content.message}</p>
                  ) : null}
                </form>
              </div>
            </>
          ) : (
            <EmptyState title="Select a conversation" description="Choose a thread from inbox to view messages and take action." />
          )}
        </Card>

        <Card className="hidden min-w-0 p-3 sm:p-4 2xl:block 2xl:min-h-[620px]">
          <div className="mb-3">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Context</h2>
            <p className="text-xs text-slate-500 dark:text-slate-300">Keep placement details visible while you chat.</p>
          </div>

          {isLoadingContext ? (
            <div className="space-y-2">
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
            </div>
          ) : (
            contextPanelBody
          )}
        </Card>
      </div>
    </div>
  );
}
