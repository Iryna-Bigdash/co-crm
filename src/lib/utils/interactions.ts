export type UIType = 'call' | 'email' | 'meeting' | 'other';
export type UIStatus = 'pending' | 'done' | 'canceled' | 'callback';

export function toUpperEnum<T extends string>(v: T) {
  return v.toUpperCase() as Uppercase<T>;
}

export function toIso(v?: Date | string | null) {
  if (v == null) return null;
  if (v instanceof Date) return v.toISOString();
  return new Date(v).toISOString();
}