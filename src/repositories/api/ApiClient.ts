import { appConfig } from '@/src/config/env';
import type { AppError } from '@/src/types';
import { logger } from '@/src/services/logger';
import { getSession, clearSession } from '@/src/services/session';

export type UnauthorizedHandler = () => void | Promise<void>;

export interface ApiClientOptions {
  baseUrl?: string;
  onUnauthorized?: UnauthorizedHandler;
}

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
  auth?: boolean;
}

/**
 * Fetch boundary for future API wiring.
 * Methods throw until EXPO_PUBLIC_API_BASE_URL / backend is configured.
 */
export class ApiClient {
  private readonly baseUrl: string;
  private onUnauthorized: UnauthorizedHandler | null;

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? appConfig.apiBaseUrl;
    this.onUnauthorized = options.onUnauthorized ?? null;
  }

  setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
    this.onUnauthorized = handler;
  }

  isConfigured(): boolean {
    return this.baseUrl.trim().length > 0;
  }

  private assertConfigured(): void {
    if (!this.isConfigured()) {
      throw new Error('API not configured');
    }
  }

  async request<T>(_options: ApiRequestOptions): Promise<T> {
    this.assertConfigured();
    // Stub path — real fetch wiring lands when backend is ready
    throw new Error('API not configured');
  }

  async getAccessToken(): Promise<string | null> {
    const session = await getSession();
    return session?.accessToken ?? null;
  }

  async handleUnauthorized(): Promise<void> {
    logger.warn('API unauthorized — clearing session');
    await clearSession();
    if (this.onUnauthorized) {
      await this.onUnauthorized();
    }
  }

  notConnectedError(): AppError {
    return {
      code: 'API_NOT_CONNECTED',
      message: 'API repositories are not connected yet',
      userMessage: 'Backend is not available in this build.',
      retryable: false,
    };
  }
}

export const apiClient = new ApiClient();
