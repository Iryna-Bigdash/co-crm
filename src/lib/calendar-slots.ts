import { isSameDay, parseISO } from 'date-fns';

export const TIME_INTERVAL_MINUTES = 15;

export function floorToTimeSlot(date: Date): Date {
  const slot = new Date(date);
  slot.setSeconds(0, 0);
  slot.setMilliseconds(0);
  const remainder = slot.getMinutes() % TIME_INTERVAL_MINUTES;
  slot.setMinutes(slot.getMinutes() - remainder);
  return slot;
}

export function getTimeSlotKey(date: Date): string {
  return floorToTimeSlot(date).toISOString();
}

export function buildOccupiedSlotKeys(
  events: { nextCall?: string | null; status?: string }[],
): Set<string> {
  const keys = new Set<string>();

  for (const event of events) {
    if (!event.nextCall || event.status !== 'PENDING') continue;
    keys.add(getTimeSlotKey(parseISO(event.nextCall)));
  }

  return keys;
}

export function isTimeSlotOccupied(date: Date, occupied: Set<string>): boolean {
  return occupied.has(getTimeSlotKey(date));
}

export function getExcludedTimesForDay(
  events: { nextCall?: string | null; status?: string }[],
  day: Date,
): Date[] {
  return events
    .filter(
      (event) =>
        event.nextCall &&
        event.status === 'PENDING' &&
        isSameDay(parseISO(event.nextCall), day),
    )
    .map((event) => parseISO(event.nextCall!));
}

export function combineDateAndTime(day: Date, time: Date): Date {
  const combined = new Date(day);
  combined.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return combined;
}
