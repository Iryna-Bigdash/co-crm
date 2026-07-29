'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { endOfDay, format, parseISO, startOfDay } from 'date-fns';
import { uk } from 'date-fns/locale';
import { Bell, X } from 'lucide-react';
import {
  CalendarInteraction,
  InteractionType,
  getCalendarInteractions,
} from '@/lib/api';

const DISMISSED_KEY = 'interaction-reminder-dismissed';
const ONE_MINUTE_MS = 60_000;

const TYPE_LABELS: Record<InteractionType, string> = {
  CALL: 'Дзвінок',
  EMAIL: 'Email',
  MEETING: 'Зустріч',
  OTHER: 'Інше',
};

function loadDismissed(): Set<string> {
  if (typeof window === 'undefined') return new Set();

  try {
    const raw = sessionStorage.getItem(DISMISSED_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveDismissed(ids: Set<string>) {
  sessionStorage.setItem(DISMISSED_KEY, JSON.stringify(Array.from(ids)));
}

interface ReminderItem {
  interaction: CalendarInteraction;
  eventTime: Date;
  isOverdue: boolean;
}

function ReminderCard({
  item,
  onDismiss,
  onNavigate,
}: {
  item: ReminderItem;
  onDismiss: () => void;
  onNavigate: () => void;
}) {
  const { interaction, eventTime, isOverdue } = item;

  const colorClasses = isOverdue
    ? 'border-red-500 bg-red-50 text-red-950 dark:bg-red-950/90 dark:text-red-50'
    : 'border-green-500 bg-green-50 text-green-950 dark:bg-green-950/90 dark:text-green-50';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onNavigate}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onNavigate();
        }
      }}
      className={`relative w-80 cursor-pointer rounded-xl border-l-4 p-4 shadow-lg transition-colors ${colorClasses}`}
    >
      <button
        type="button"
        aria-label="Закрити"
        onClick={(event) => {
          event.stopPropagation();
          onDismiss();
        }}
        className="absolute right-2 top-2 rounded p-1 opacity-70 transition hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-2 pr-6">
        <Bell className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="font-semibold">{interaction.companyTitle}</p>
          <p className="text-sm opacity-90">
            {TYPE_LABELS[interaction.type]} · {format(eventTime, 'HH:mm', { locale: uk })}
          </p>
          <p className="mt-1 text-xs opacity-80">
            {isOverdue ? 'Час події настав' : 'Подія за хвилину'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function InteractionReminderPopup() {
  const router = useRouter();
  const { data: session } = useSession();
  const [now, setNow] = useState(() => Date.now());
  const [dismissed, setDismissed] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setDismissed(loadDismissed());
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  const employeeId =
    session?.user?.role === 'manager' ? session.user.id : undefined;

  const todayKey = format(new Date(now), 'yyyy-MM-dd');
  const dateFrom = useMemo(
    () => startOfDay(new Date(now)).toISOString(),
    [todayKey],
  );
  const dateTo = useMemo(
    () => endOfDay(new Date(now)).toISOString(),
    [todayKey],
  );

  const { data: events = [] } = useQuery({
    queryKey: ['interaction-reminders', employeeId, todayKey],
    queryFn: () =>
      getCalendarInteractions({
        employeeId,
        dateFrom,
        dateTo,
        status: 'PENDING',
      }),
    enabled: Boolean(session?.user),
    refetchInterval: 60_000,
  });

  const activeReminders = useMemo((): ReminderItem[] => {
    return events
      .filter((event) => event.nextCall && !dismissed.has(event.id))
      .reduce<ReminderItem[]>((acc, event) => {
        const eventTime = parseISO(event.nextCall!);
        const eventMs = eventTime.getTime();
        const showFrom = eventMs - ONE_MINUTE_MS;

        if (now < showFrom) {
          return acc;
        }

        acc.push({
          interaction: event,
          eventTime,
          isOverdue: now >= eventMs,
        });

        return acc;
      }, [])
      .sort((a, b) => a.eventTime.getTime() - b.eventTime.getTime());
  }, [events, dismissed, now]);

  const dismiss = useCallback((id: string) => {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveDismissed(next);
      return next;
    });
  }, []);

  if (activeReminders.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[10001] flex max-w-[calc(100vw-2rem)] flex-col gap-3">
      {activeReminders.map((item) => (
        <div key={item.interaction.id} className="pointer-events-auto">
          <ReminderCard
            item={item}
            onDismiss={() => dismiss(item.interaction.id)}
            onNavigate={() => router.push(`/companies/${item.interaction.companyId}/contact-history`)}
          />
        </div>
      ))}
    </div>
  );
}
