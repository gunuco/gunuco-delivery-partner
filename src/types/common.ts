/** Shared async / result helpers for GUNUCO repositories & UI state */

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AppError {
  code: string;
  message: string;
  userMessage: string;
  retryable?: boolean;
}

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: AppError };

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}
