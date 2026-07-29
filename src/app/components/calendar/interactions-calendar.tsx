'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  eachHourOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns';
import { uk } from 'date-fns/locale';
import Header from '@/app/components/header';
import {
  CalendarInteraction,
  InteractionStatus,
  InteractionType,
  getCalendarInteractions,
} from '@/lib/api';

type CalendarView = 'month' | 'week' | 'day';

const TYPE_LABELS: Record<InteractionType, string> = {
  CALL: 'Дзвінок',
  EMAIL: 'Email',
  MEETING: 'Зустріч',
  OTHER: 'Інше',
};

const STATUS_LABELS: Record<InteractionStatus, string> = {
  PENDING: 'В процесі',
  DONE: 'Завершено',
  CANCELED: 'Скасовано',
};

const TYPE_COLORS: Record<InteractionType, string> = {
  CALL: 'border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-100',
  EMAIL: 'border-green-500 bg-green-50 text-green-900 dark:bg-green-950/40 dark:text-green-100',
  MEETING: 'border-purple-500 bg-purple-50 text-purple-900 dark:bg-purple-950/40 dark:text-purple-100',
  OTHER: 'border-gray-500 bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-gray-100',
};

const TYPE_OPTIONS: InteractionType[] = ['CALL', 'EMAIL', 'MEETING', 'OTHER'];
const STATUS_OPTIONS: InteractionStatus[] = ['PENDING', 'DONE', 'CANCELED'];

const TYPE_FILTER_COLORS: Record<InteractionType, string> = {
  CALL: 'border-blue-500 text-blue-700 dark:text-blue-300',
  EMAIL: 'border-green-500 text-green-700 dark:text-green-300',
  MEETING: 'border-purple-500 text-purple-700 dark:text-purple-300',
  OTHER: 'border-gray-500 text-gray-700 dark:text-gray-300',
};

const STATUS_FILTER_COLORS: Record<InteractionStatus, string> = {
  PENDING: 'border-yellow-500 text-yellow-700 dark:text-yellow-300',
  DONE: 'border-green-500 text-green-700 dark:text-green-300',
  CANCELED: 'border-red-500 text-red-700 dark:text-red-300',
};

function FilterButton({
  active,
  onClick,
  children,
  className = '',
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${className} ${
        active
          ? 'bg-gray-900 text-white border-gray-900 dark:bg-gray-100 dark:text-gray-900 dark:border-gray-100'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700'
      }`}
    >
      {children}
    </button>
  );
}

const WEEK_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
const HOURS = Array.from({ length: 24 }, (_, index) => index);

function getRange(view: CalendarView, cursor: Date) {
  if (view === 'month') {
    const monthStart = startOfMonth(cursor);
    const monthEnd = endOfMonth(cursor);
    return {
      start: startOfWeek(monthStart, { weekStartsOn: 1 }),
      end: endOfWeek(monthEnd, { weekStartsOn: 1 }),
    };
  }

  if (view === 'week') {
    return {
      start: startOfWeek(cursor, { weekStartsOn: 1 }),
      end: endOfWeek(cursor, { weekStartsOn: 1 }),
    };
  }

  return {
    start: startOfDay(cursor),
    end: endOfDay(cursor),
  };
}

function shiftCursor(view: CalendarView, cursor: Date, direction: -1 | 1) {
  if (view === 'month') return direction === 1 ? addMonths(cursor, 1) : subMonths(cursor, 1);
  if (view === 'week') return direction === 1 ? addWeeks(cursor, 1) : subWeeks(cursor, 1);
  return direction === 1 ? addDays(cursor, 1) : subDays(cursor, 1);
}

function getHeaderLabel(view: CalendarView, cursor: Date) {
  if (view === 'day') {
    return format(cursor, 'd MMMM yyyy', { locale: uk });
  }

  if (view === 'week') {
    const start = startOfWeek(cursor, { weekStartsOn: 1 });
    const end = endOfWeek(cursor, { weekStartsOn: 1 });
    return `${format(start, 'd MMM', { locale: uk })} – ${format(end, 'd MMM yyyy', { locale: uk })}`;
  }

  return format(cursor, 'LLLL yyyy', { locale: uk });
}

function CalendarEventCard({ event }: { event: CalendarInteraction }) {
  const eventDate = event.nextCall ? parseISO(event.nextCall) : null;

  return (
    <Link
      href={`/companies/${event.companyId}/contact-history`}
      className={`block rounded-lg border-l-4 px-2 py-1.5 text-xs transition hover:opacity-80 ${TYPE_COLORS[event.type]}`}
    >
      <div className="font-semibold truncate">{event.companyTitle}</div>
      <div className="truncate">
        {TYPE_LABELS[event.type]} · {STATUS_LABELS[event.status]}
      </div>
      {eventDate && (
        <div className="opacity-80">
          {format(eventDate, 'HH:mm', { locale: uk })}
        </div>
      )}
    </Link>
  );
}

export default function InteractionsCalendar() {
  const { data: session } = useSession({ required: true });
  const [view, setView] = useState<CalendarView>('month');
  const [cursor, setCursor] = useState(new Date());
  const [selectedType, setSelectedType] = useState<InteractionType | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<InteractionStatus | null>(null);

  const employeeId = session?.user?.role === 'manager' ? session.user.id : undefined;
  const range = useMemo(() => getRange(view, cursor), [view, cursor]);

  const { data: events = [], isLoading, isError } = useQuery({
    queryKey: [
      'interactions',
      'calendar',
      view,
      range.start.toISOString(),
      range.end.toISOString(),
      employeeId,
      selectedType,
      selectedStatus,
    ],
    queryFn: () =>
      getCalendarInteractions({
        employeeId,
        dateFrom: range.start.toISOString(),
        dateTo: range.end.toISOString(),
        ...(selectedType ? { type: selectedType } : {}),
        ...(selectedStatus ? { status: selectedStatus } : {}),
      }),
    staleTime: 30 * 1000,
  });

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarInteraction[]>();

    events.forEach((event) => {
      if (!event.nextCall) return;
      const key = format(parseISO(event.nextCall), 'yyyy-MM-dd');
      const list = map.get(key) ?? [];
      list.push(event);
      map.set(key, list);
    });

    map.forEach((list, key) => {
      list.sort(
        (a, b) =>
          parseISO(a.nextCall!).getTime() - parseISO(b.nextCall!).getTime(),
      );
      map.set(key, list);
    });

    return map;
  }, [events]);

  const monthDays = useMemo(() => {
    if (view !== 'month') return [];
    return eachDayOfInterval({ start: range.start, end: range.end });
  }, [view, range]);

  const weekDays = useMemo(() => {
    if (view !== 'week') return [];
    return eachDayOfInterval({ start: range.start, end: range.end });
  }, [view, range]);

  const dayHours = useMemo(() => {
    if (view !== 'day') return [];
    return eachHourOfInterval({ start: range.start, end: range.end });
  }, [view, range]);

  const selectedDayEvents = useMemo(() => {
    const key = format(cursor, 'yyyy-MM-dd');
    return eventsByDay.get(key) ?? [];
  }, [cursor, eventsByDay]);

  return (
    <div>
      <Header>Calendar</Header>

      <main className="py-6 px-4 sm:py-10 sm:px-7 lg:pl-10 lg:pr-7">
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setCursor(shiftCursor(view, cursor, -1))}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => setCursor(new Date())}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600"
              >
                Сьогодні
              </button>
              <button
                type="button"
                onClick={() => setCursor(shiftCursor(view, cursor, 1))}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600"
              >
                →
              </button>
              <h2 className="ml-2 text-xl font-semibold capitalize text-gray-900 dark:text-gray-100">
                {getHeaderLabel(view, cursor)}
              </h2>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Тип:
                </span>
                <FilterButton
                  active={selectedType === null}
                  onClick={() => setSelectedType(null)}
                >
                  Усі
                </FilterButton>
                {TYPE_OPTIONS.map((type) => (
                  <FilterButton
                    key={type}
                    active={selectedType === type}
                    onClick={() =>
                      setSelectedType((current) => (current === type ? null : type))
                    }
                    className={selectedType === type ? '' : TYPE_FILTER_COLORS[type]}
                  >
                    {TYPE_LABELS[type]}
                  </FilterButton>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Статус:
                </span>
                <FilterButton
                  active={selectedStatus === null}
                  onClick={() => setSelectedStatus(null)}
                >
                  Усі
                </FilterButton>
                {STATUS_OPTIONS.map((status) => (
                  <FilterButton
                    key={status}
                    active={selectedStatus === status}
                    onClick={() =>
                      setSelectedStatus((current) => (current === status ? null : status))
                    }
                    className={selectedStatus === status ? '' : STATUS_FILTER_COLORS[status]}
                  >
                    {STATUS_LABELS[status]}
                  </FilterButton>
                ))}
              </div>
            </div>
          </div>

          <div className="flex rounded-lg border border-gray-300 p-1 dark:border-gray-600">
            {(['month', 'week', 'day'] as CalendarView[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setView(item)}
                className={`rounded-md px-4 py-2 text-sm font-medium capitalize transition ${
                  view === item
                    ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                {item === 'month' ? 'Місяць' : item === 'week' ? 'Тиждень' : 'День'}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-800">
            Завантаження календаря...
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-10 text-center text-red-700">
            Не вдалося завантажити події календаря
          </div>
        )}

        {!isLoading && !isError && view === 'month' && (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
              {WEEK_DAYS.map((day) => (
                <div
                  key={day}
                  className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {monthDays.map((day) => {
                const key = format(day, 'yyyy-MM-dd');
                const dayEvents = eventsByDay.get(key) ?? [];

                return (
                  <div
                    key={key}
                    className={`min-h-[120px] border-b border-r border-gray-200 p-2 dark:border-gray-700 ${
                      !isSameMonth(day, cursor) ? 'bg-gray-50 dark:bg-gray-900/40' : ''
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setCursor(day);
                        setView('day');
                      }}
                      className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                        isToday(day)
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 dark:text-gray-200'
                      }`}
                    >
                      {format(day, 'd')}
                    </button>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <CalendarEventCard key={event.id} event={event} />
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          +{dayEvents.length - 3} ще
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!isLoading && !isError && view === 'week' && (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="grid min-w-[900px] grid-cols-[80px_repeat(7,minmax(0,1fr))]">
              <div className="border-b border-r border-gray-200 p-3 dark:border-gray-700" />
              {weekDays.map((day) => (
                <div
                  key={day.toISOString()}
                  className="border-b border-r border-gray-200 p-3 text-center dark:border-gray-700"
                >
                  <div className="text-xs uppercase text-gray-500 dark:text-gray-400">
                    {format(day, 'EEE', { locale: uk })}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCursor(day);
                      setView('day');
                    }}
                    className={`mt-1 text-lg font-semibold ${
                      isToday(day) ? 'text-blue-600' : 'text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {format(day, 'd')}
                  </button>
                </div>
              ))}

              {HOURS.map((hour) => (
                <React.Fragment key={hour}>
                  <div className="border-b border-r border-gray-200 px-2 py-4 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                    {`${hour.toString().padStart(2, '0')}:00`}
                  </div>
                  {weekDays.map((day) => {
                    const dayEvents = (eventsByDay.get(format(day, 'yyyy-MM-dd')) ?? []).filter(
                      (event) => parseISO(event.nextCall!).getHours() === hour,
                    );

                    return (
                      <div
                        key={`${day.toISOString()}-${hour}`}
                        className="min-h-[64px] border-b border-r border-gray-200 p-1 dark:border-gray-700"
                      >
                        <div className="space-y-1">
                          {dayEvents.map((event) => (
                            <CalendarEventCard key={event.id} event={event} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {!isLoading && !isError && view === 'day' && (
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              {dayHours.map((hourDate) => {
                const hour = hourDate.getHours();
                const hourEvents = selectedDayEvents.filter(
                  (event) => parseISO(event.nextCall!).getHours() === hour,
                );

                return (
                  <div
                    key={hour}
                    className="grid grid-cols-[80px_1fr] border-b border-gray-200 dark:border-gray-700"
                  >
                    <div className="border-r border-gray-200 px-3 py-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                      {format(hourDate, 'HH:mm')}
                    </div>
                    <div className="min-h-[72px] p-2">
                      <div className="space-y-2">
                        {hourEvents.map((event) => (
                          <CalendarEventCard key={event.id} event={event} />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                План на день
              </h3>
              {selectedDayEvents.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  На цей день запланованих взаємодій немає
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedDayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
                    >
                      <div className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {event.companyTitle}
                      </div>
                      <div className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                        {event.nextCall &&
                          format(parseISO(event.nextCall), 'HH:mm', { locale: uk })}{' '}
                        · {TYPE_LABELS[event.type]} · {STATUS_LABELS[event.status]}
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{event.comment}</p>
                      <Link
                        href={`/companies/${event.companyId}/contact-history`}
                        className="mt-3 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400"
                      >
                        Відкрити Contact history
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
