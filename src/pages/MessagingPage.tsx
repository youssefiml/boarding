import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

import { messagingApi } from '@/api/modules/messaging.api';
import { ROUTES } from '@/app/routes';
import { PageHeader } from '@/app/layout/PageHeader/PageHeader';
import { Badge } from '@/ui/Badge/Badge';
import { Button } from '@/ui/Button/Button';
import { Card } from '@/ui/Card/Card';
import { EmptyState } from '@/ui/EmptyState/EmptyState';
import { formatDateTime } from '@/lib/date';
import type { MessagesResponse, MessageThreadsResponse } from '@/types/api';

const sendMessageSchema = z.object({
  content: z.string().min(1, 'Type a message').max(1000, 'Message too long'),
});

type SendMessageFormValues = z.infer<typeof sendMessageSchema>;

export function MessagingPage() {
  const { threadId } = useParams<{ threadId: string }>();
  const navigate = useNavigate();

  const [threads, setThreads] = useState<MessageThreadsResponse | null>(null);
  const [messages, setMessages] = useState<MessagesResponse | null>(null);
  const [isLoadingThreads, setIsLoadingThreads] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SendMessageFormValues>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      content: '',
    },
  });

  const loadThreads = useCallback(async () => {
    setIsLoadingThreads(true);

    try {
      const data = await messagingApi.listThreads({ page: 1, pageSize: 30 });
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
      const data = await messagingApi.listMessages(threadId, 1, 40);
      setMessages(data);
    } catch {
      setMessages(null);
    } finally {
      setIsLoadingMessages(false);
    }
  }, [threadId]);

  useEffect(() => {
    void loadThreads();
  }, [loadThreads]);

  useEffect(() => {
    if (!threadId && threads && threads.items.length > 0) {
      navigate(`${ROUTES.messaging}/${threads.items[0].id}`, { replace: true });
    }
  }, [navigate, threadId, threads]);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  const selectedThread = useMemo(() => {
    if (!threadId || !threads) {
      return null;
    }

    return threads.items.find((item) => item.id === threadId) ?? null;
  }, [threadId, threads]);

  const onSend = async (values: SendMessageFormValues) => {
    if (!threadId) {
      return;
    }

    await messagingApi.sendMessage(threadId, values);
    reset();
    await loadMessages();
    await loadThreads();
  };

  return (
    <div>
      <PageHeader title="Messaging" subtitle="Keep conversations active with agencies and matched companies." />

      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Card className="max-h-[320px] overflow-auto sm:max-h-[380px] lg:h-[520px] lg:max-h-none">
          <h2 className="mb-3 text-base font-semibold text-slate-900 dark:text-slate-100">Inbox</h2>
          {isLoadingThreads ? <p className="text-sm text-slate-500 dark:text-slate-300">Loading threads...</p> : null}
          {!isLoadingThreads && threads && threads.items.length === 0 ? (
            <EmptyState title="No threads" description="You will see messages here once a company or advisor contacts you." />
          ) : null}
          {!isLoadingThreads && threads && threads.items.length > 0 ? (
            <div className="space-y-2">
              {threads.items.map((thread) => {
                const isActive = thread.id === threadId;

                return (
                  <button
                    key={thread.id}
                    type="button"
                    className={`w-full rounded-lg border px-3 py-2 text-left transition-colors ${
                      isActive
                        ? 'border-brand-300 bg-brand-50 dark:border-brand-400/70 dark:bg-brand-500/20'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/65 dark:hover:border-slate-600 dark:hover:bg-slate-700/75'
                    }`}
                    onClick={() => {
                      navigate(`${ROUTES.messaging}/${thread.id}`);
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{thread.companyName}</p>
                      {thread.unreadCount > 0 ? <Badge variant="brand">{thread.unreadCount}</Badge> : null}
                    </div>
                    <p className="mt-1 line-clamp-1 text-xs text-slate-600 dark:text-slate-300">{thread.lastMessage}</p>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{formatDateTime(thread.updatedAt)}</p>
                  </button>
                );
              })}
            </div>
          ) : null}
        </Card>

        <Card className="flex min-h-[420px] flex-col lg:h-[520px]">
          {selectedThread ? (
            <>
              <div className="border-b border-slate-200 pb-3 dark:border-slate-700">
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{selectedThread.companyName}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Thread updated {formatDateTime(selectedThread.updatedAt)}</p>
              </div>

              <div className="mt-4 flex-1 space-y-3 overflow-auto pr-1">
                {isLoadingMessages ? <p className="text-sm text-slate-500 dark:text-slate-300">Loading messages...</p> : null}
                {!isLoadingMessages && messages && messages.items.length === 0 ? (
                  <EmptyState title="No messages yet" description="Start the conversation with your first message." />
                ) : null}
                {!isLoadingMessages && messages && messages.items.length > 0
                  ? messages.items.map((message) => (
                      <div
                        key={message.id}
                        className={`max-w-[92%] break-words rounded-lg px-3 py-2 text-sm sm:max-w-[80%] ${
                          message.sender === 'student'
                            ? 'ml-auto bg-brand-600 text-white'
                            : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p
                          className={`mt-1 text-[11px] ${
                            message.sender === 'student' ? 'text-brand-100' : 'text-slate-500 dark:text-slate-300'
                          }`}
                        >
                          {formatDateTime(message.createdAt)}
                        </p>
                      </div>
                    ))
                  : null}
              </div>

              <form
                className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-3 sm:flex-row sm:items-end dark:border-slate-700"
                onSubmit={handleSubmit(onSend)}
              >
                <label className="flex-1">
                  <span className="sr-only">Message</span>
                  <textarea
                    className="min-h-[88px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 sm:min-h-[72px] dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-400 dark:focus:ring-brand-500/30"
                    placeholder="Write a message"
                    {...register('content')}
                  />
                  {errors.content?.message ? (
                    <span className="mt-1 block text-xs text-rose-600 dark:text-rose-300">{errors.content.message}</span>
                  ) : null}
                </label>
                <Button type="submit" className="w-full sm:w-auto" isLoading={isSubmitting}>
                  Send
                </Button>
              </form>
            </>
          ) : (
            <EmptyState
              title="No conversation selected"
              description="Select a thread from the inbox to read and send messages."
            />
          )}
        </Card>
      </div>
    </div>
  );
}


