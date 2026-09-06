import type { Result } from '@/src/types';

import type { ApiCustomError } from './baseApi';

/**
 * Maps repository `Result<T>` into an RTK Query `queryFn` return value.
 */
export function mapResult<T>(
  result: Result<T>,
): { data: T } | { error: ApiCustomError } {
  if (!result.ok) {
    return {
      error: {
        status: 'CUSTOM_ERROR',
        error: result.error.userMessage,
      },
    };
  }
  return { data: result.data };
}
