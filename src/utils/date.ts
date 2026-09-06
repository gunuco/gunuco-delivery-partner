const DATE_LOCALE = 'en-IN';

const relativeFormatter = new Intl.RelativeTimeFormat(DATE_LOCALE, {
  numeric: 'auto',
});

const dateFormatter = new Intl.DateTimeFormat(DATE_LOCALE, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const timeFormatter = new Intl.DateTimeFormat(DATE_LOCALE, {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

const dateTimeFormatter = new Intl.DateTimeFormat(DATE_LOCALE, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

function toDate(value: string | number | Date): Date {
  if (value instanceof Date) {
    return value;
  }
  return new Date(value);
}

/**
 * Relative time for notification/order lists, e.g. "5 minutes ago".
 */
export function formatRelativeTime(value: string | number | Date, now: Date = new Date()): string {
  const date = toDate(value);
  const diffMs = date.getTime() - now.getTime();
  const absMs = Math.abs(diffMs);

  const divisions: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
    { amount: 60_000, unit: 'minute' },
    { amount: 3_600_000, unit: 'hour' },
    { amount: 86_400_000, unit: 'day' },
    { amount: 604_800_000, unit: 'week' },
    { amount: 2_592_000_000, unit: 'month' },
    { amount: 31_536_000_000, unit: 'year' },
  ];

  if (absMs < 60_000) {
    return relativeFormatter.format(Math.round(diffMs / 1000), 'second');
  }

  for (let i = 0; i < divisions.length; i += 1) {
    const current = divisions[i];
    const next = divisions[i + 1];
    if (!next || absMs < next.amount) {
      return relativeFormatter.format(Math.round(diffMs / current.amount), current.unit);
    }
  }

  return relativeFormatter.format(
    Math.round(diffMs / divisions[divisions.length - 1].amount),
    'year',
  );
}

export function formatDate(value: string | number | Date): string {
  return dateFormatter.format(toDate(value));
}

export function formatTime(value: string | number | Date): string {
  return timeFormatter.format(toDate(value));
}

export function formatDateTime(value: string | number | Date): string {
  return dateTimeFormatter.format(toDate(value));
}
