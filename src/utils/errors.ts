/**
 * Extracts a rider-facing message from RTK Query / repository errors.
 */
export function getErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (typeof error === 'object' && error !== null) {
    if (
      'error' in error &&
      typeof (error as { error: unknown }).error === 'string' &&
      (error as { error: string }).error.trim()
    ) {
      return (error as { error: string }).error;
    }
    if (
      'message' in error &&
      typeof (error as { message: unknown }).message === 'string' &&
      (error as { message: string }).message.trim()
    ) {
      return (error as { message: string }).message;
    }
  }
  if (typeof error === 'string' && error.trim()) {
    return error;
  }
  return fallback;
}
