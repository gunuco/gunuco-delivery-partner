const DATE_LOCALE_CANDIDATES = ['en-IN', 'en-GB', 'en'] as const;

function resolveLocale(preferred: string): string {
  try {
    if (typeof Intl !== 'undefined' && typeof Intl.DateTimeFormat === 'function') {
      const supported =
        typeof Intl.DateTimeFormat.supportedLocalesOf === 'function'
          ? Intl.DateTimeFormat.supportedLocalesOf([preferred, ...DATE_LOCALE_CANDIDATES])
          : [];
      if (supported.length > 0) {
        return supported[0];
      }
    }
  } catch {
    // Hermes / incomplete Intl — fall through
  }
  return 'en';
}

const DATE_LOCALE = resolveLocale('en-IN');

function createDateTimeFormatter(
  options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat | null {
  try {
    if (typeof Intl === 'undefined' || typeof Intl.DateTimeFormat !== 'function') {
      return null;
    }
    return new Intl.DateTimeFormat(DATE_LOCALE, options);
  } catch {
    try {
      return new Intl.DateTimeFormat('en', options);
    } catch {
      return null;
    }
  }
}

function createRelativeFormatter(): Intl.RelativeTimeFormat | null {
  try {
    if (
      typeof Intl === 'undefined' ||
      typeof (Intl as typeof Intl & { RelativeTimeFormat?: unknown }).RelativeTimeFormat !==
        'function'
    ) {
      return null;
    }
    return new Intl.RelativeTimeFormat(DATE_LOCALE, { numeric: 'auto' });
  } catch {
    try {
      return new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    } catch {
      return null;
    }
  }
}

const relativeFormatter = createRelativeFormatter();

const dateFormatter = createDateTimeFormatter({
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const timeFormatter = createDateTimeFormatter({
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

const dateTimeFormatter = createDateTimeFormatter({
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

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function fallbackFormatDate(date: Date): string {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function fallbackFormatTime(date: Date): string {
  let hours = date.getHours();
  const minutes = pad2(date.getMinutes());
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours}:${minutes} ${ampm}`;
}

function fallbackRelative(diffMs: number): string {
  const absMs = Math.abs(diffMs);
  const past = diffMs < 0;
  const suffix = past ? 'ago' : 'from now';

  if (absMs < 60_000) return past ? 'just now' : 'in a moment';
  if (absMs < 3_600_000) {
    const m = Math.round(absMs / 60_000);
    return `${m} minute${m === 1 ? '' : 's'} ${suffix}`;
  }
  if (absMs < 86_400_000) {
    const h = Math.round(absMs / 3_600_000);
    return `${h} hour${h === 1 ? '' : 's'} ${suffix}`;
  }
  const d = Math.round(absMs / 86_400_000);
  return `${d} day${d === 1 ? '' : 's'} ${suffix}`;
}

/**
 * Relative time for notification/order lists, e.g. "5 minutes ago".
 * Safe on Hermes — never throws if RelativeTimeFormat is missing.
 */
export function formatRelativeTime(
  value: string | number | Date,
  now: Date = new Date(),
): string {
  const date = toDate(value);
  const diffMs = date.getTime() - now.getTime();
  const absMs = Math.abs(diffMs);

  if (!relativeFormatter) {
    return fallbackRelative(diffMs);
  }

  const divisions: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
    { amount: 60_000, unit: 'minute' },
    { amount: 3_600_000, unit: 'hour' },
    { amount: 86_400_000, unit: 'day' },
    { amount: 604_800_000, unit: 'week' },
    { amount: 2_592_000_000, unit: 'month' },
    { amount: 31_536_000_000, unit: 'year' },
  ];

  try {
    if (absMs < 60_000) {
      return relativeFormatter.format(Math.round(diffMs / 1000), 'second');
    }

    for (let i = 0; i < divisions.length; i += 1) {
      const current = divisions[i];
      const next = divisions[i + 1];
      if (!next || absMs < next.amount) {
        return relativeFormatter.format(
          Math.round(diffMs / current.amount),
          current.unit,
        );
      }
    }

    return relativeFormatter.format(
      Math.round(diffMs / divisions[divisions.length - 1].amount),
      'year',
    );
  } catch {
    return fallbackRelative(diffMs);
  }
}

export function formatDate(value: string | number | Date): string {
  const date = toDate(value);
  try {
    return dateFormatter?.format(date) ?? fallbackFormatDate(date);
  } catch {
    return fallbackFormatDate(date);
  }
}

export function formatTime(value: string | number | Date): string {
  const date = toDate(value);
  try {
    return timeFormatter?.format(date) ?? fallbackFormatTime(date);
  } catch {
    return fallbackFormatTime(date);
  }
}

export function formatDateTime(value: string | number | Date): string {
  const date = toDate(value);
  try {
    return dateTimeFormatter?.format(date) ?? `${fallbackFormatDate(date)}, ${fallbackFormatTime(date)}`;
  } catch {
    return `${fallbackFormatDate(date)}, ${fallbackFormatTime(date)}`;
  }
}

/** e.g. "12 Nov, 11:24 AM" for order detail headers */
export function formatShortDateTime(value: string | number | Date): string {
  const date = toDate(value);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${date.getDate()} ${months[date.getMonth()]}, ${fallbackFormatTime(date)}`;
}
