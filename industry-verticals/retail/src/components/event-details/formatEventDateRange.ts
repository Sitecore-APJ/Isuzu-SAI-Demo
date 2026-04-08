import type { Field } from '@sitecore-content-sdk/nextjs';

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function toLocalDateOnly(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function parseFieldDate(raw: string | undefined): Date | null {
  if (raw === undefined || raw === null || String(raw).trim() === '') {
    return null;
  }
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return toLocalDateOnly(parsed);
}

const monthShortFormatter = new Intl.DateTimeFormat('en-AU', { month: 'short' });

function formatMonthShort(d: Date): string {
  return monthShortFormatter.format(d);
}

function formatDayMonthYear(d: Date): string {
  return `${pad2(d.getDate())} ${formatMonthShort(d)} ${d.getFullYear()}`;
}

/**
 * Same calendar day: "DD MMM YYYY".
 * Multi-day, same month/year: "d1/d2/d3 MMM yyyy".
 * Multi-day spanning months: "DD MMM YYYY - DD MMM YYYY".
 */
export function formatEventDateDisplay(
  startRaw: string | undefined,
  endRaw: string | undefined
): string | null {
  const start = parseFieldDate(startRaw);
  const end = parseFieldDate(endRaw);
  if (!start || !end) {
    return null;
  }

  if (start.getTime() === end.getTime()) {
    return formatDayMonthYear(start);
  }

  if (end < start) {
    return formatDayMonthYear(start);
  }

  const days: Date[] = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endCap = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  while (cursor <= endCap) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  const sameMonthYear =
    start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  if (sameMonthYear) {
    const dayPart = days.map((d) => d.getDate()).join('/');
    return `${dayPart} ${formatMonthShort(start)} ${start.getFullYear()}`;
  }

  return `${formatDayMonthYear(start)} - ${formatDayMonthYear(end)}`;
}

export function formatAudWholeDollars(amount: number | undefined): string | null {
  if (amount === undefined || amount === null || Number.isNaN(Number(amount))) {
    return null;
  }
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

export function parseNumericFieldValue(field: Field<number> | undefined): number | undefined {
  const raw = field?.value as unknown;
  if (raw === null || raw === undefined || raw === '') {
    return undefined;
  }
  const n = typeof raw === 'number' ? raw : Number(raw);
  return Number.isNaN(n) ? undefined : n;
}
