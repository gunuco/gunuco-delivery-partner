import type { AppError, Result } from '@/src/types';

export function ok<T>(data: T): Result<T> {
  return { ok: true, data };
}

export function err<T = never>(error: AppError): Result<T> {
  return { ok: false, error };
}

export function appError(
  code: string,
  message: string,
  userMessage: string,
  retryable = false,
): AppError {
  return { code, message, userMessage, retryable };
}

export const MOCK_FORCE_ERROR: AppError = appError(
  'MOCK_FORCE_ERROR',
  'UI test scenario forced an error response',
  'Something went wrong. Please try again.',
  true,
);

export const NOT_FOUND = (entity: string, id?: string): AppError =>
  appError(
    'NOT_FOUND',
    id ? `${entity} not found: ${id}` : `${entity} not found`,
    `${entity} could not be found.`,
    false,
  );

export const INVALID_STATE = (message: string, userMessage: string): AppError =>
  appError('INVALID_STATE', message, userMessage, false);

export const UNAUTHORIZED: AppError = appError(
  'UNAUTHORIZED',
  'No active session',
  'Please sign in to continue.',
  false,
);

export const API_NOT_CONNECTED: AppError = appError(
  'API_NOT_CONNECTED',
  'API repositories are not connected yet',
  'Backend is not available in this build.',
  false,
);
