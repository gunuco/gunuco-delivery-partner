/**
 * Idempotency helpers for critical order mutations.
 *
 * When the backend supports idempotency keys, pass the result of
 * `generateIdempotencyKey()` on accept / complete / fail (and similar)
 * mutations so retries after flaky networks do not double-apply side effects.
 *
 * Mock repositories currently ignore these keys — `OrderRepository` does not
 * yet accept an idempotencyKey parameter. Extend the interface + API client
 * headers (`Idempotency-Key`) when backend confirms support. Until then,
 * callers may still generate and hold a key for a retry window.
 */

/** Creates a unique idempotency key suitable for HTTP `Idempotency-Key` headers. */
export function generateIdempotencyKey(prefix = 'gunuco'): string {
  const random =
    typeof globalThis.crypto?.randomUUID === 'function'
      ? globalThis.crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}_${random}`;
}
