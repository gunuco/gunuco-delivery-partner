/**
 * Safe logger — redacts OTP, tokens, phone numbers, bank details, and documents.
 * NEVER log raw OTPs or access/refresh tokens.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const SENSITIVE_KEY =
  /(otp|token|password|secret|authorization|refresh|access|phone|mobile|account|ifsc|bank|document|licence|license|aadhaar|pan|fileuri|fileUrl)/i;

/** Keys that should always trigger an explicit warning when logged. */
const WARN_SENSITIVE_KEY = /(otp|token|password|ifsc|account)/i;

const OTP_PATTERN = /\b\d{4,8}\b/g;
const PHONE_PATTERN = /(\+?91[\s-]?)?[6-9]\d{9}/g;
const TOKENISH_PATTERN = /\b[A-Za-z0-9_-]{20,}\b/g;

function redactString(value: string): string {
  return value
    .replace(PHONE_PATTERN, '[REDACTED_PHONE]')
    .replace(OTP_PATTERN, '[REDACTED_CODE]')
    .replace(TOKENISH_PATTERN, '[REDACTED_TOKEN]');
}

function warnSensitiveKeys(value: unknown, path = ''): void {
  if (value === null || value === undefined) {
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => warnSensitiveKeys(item, `${path}[${index}]`));
    return;
  }
  if (typeof value === 'object') {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const nextPath = path ? `${path}.${k}` : k;
      if (WARN_SENSITIVE_KEY.test(k)) {
        console.warn(
          `[GUNUCO][warn] Attempted to log sensitive key "${nextPath}" — value redacted`,
        );
      }
      warnSensitiveKeys(v, nextPath);
    }
  }
}

function redactValue(value: unknown, keyHint?: string): unknown {
  if (keyHint && SENSITIVE_KEY.test(keyHint)) {
    return '[REDACTED]';
  }
  if (typeof value === 'string') {
    return redactString(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => redactValue(item));
  }
  if (value !== null && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = redactValue(v, k);
    }
    return out;
  }
  return value;
}

function emit(level: LogLevel, message: string, meta?: unknown): void {
  if (meta !== undefined) {
    warnSensitiveKeys(meta);
  }
  const safeMeta = meta === undefined ? undefined : redactValue(meta);
  const prefix = `[GUNUCO][${level}]`;
  if (safeMeta === undefined) {
    console[level === 'debug' ? 'log' : level](prefix, message);
    return;
  }
  console[level === 'debug' ? 'log' : level](prefix, message, safeMeta);
}

export const logger = {
  debug(message: string, meta?: unknown): void {
    if (__DEV__) {
      emit('debug', message, meta);
    }
  },
  info(message: string, meta?: unknown): void {
    emit('info', message, meta);
  },
  warn(message: string, meta?: unknown): void {
    emit('warn', message, meta);
  },
  error(message: string, meta?: unknown): void {
    emit('error', message, meta);
  },
};
