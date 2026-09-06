import { useCallback, useRef, useState } from 'react';

import { logger } from '@/src/services/logger';

export type PendingActionKind =
  | 'accept'
  | 'reject'
  | 'confirmPickup'
  | 'complete'
  | 'fail'
  | 'toggleAvailability'
  | 'other';

export interface PendingAction {
  id: string;
  kind: PendingActionKind;
  /** Stable dedupe key — e.g. `accept:order_123` */
  dedupeKey: string;
  createdAt: number;
  payload?: Record<string, unknown>;
  run: () => Promise<void>;
}

/**
 * Minimal in-memory queue for critical actions attempted while offline.
 *
 * Callers MUST supply a stable `dedupeKey` so the same mutation is not
 * enqueued twice (e.g. double-tap accept). This queue is process-local and
 * does not survive app restarts — persist + reconcile when backend wiring lands.
 */
export function usePendingActions() {
  const queueRef = useRef<PendingAction[]>([]);
  const [size, setSize] = useState(0);
  const flushingRef = useRef(false);

  const syncSize = useCallback(() => {
    setSize(queueRef.current.length);
  }, []);

  const enqueue = useCallback(
    (action: Omit<PendingAction, 'id' | 'createdAt'>) => {
      const exists = queueRef.current.some((item) => item.dedupeKey === action.dedupeKey);
      if (exists) {
        logger.warn('Skipped duplicate pending action', { dedupeKey: action.dedupeKey });
        return false;
      }
      queueRef.current.push({
        ...action,
        id: `pending_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        createdAt: Date.now(),
      });
      syncSize();
      return true;
    },
    [syncSize],
  );

  const clear = useCallback(() => {
    queueRef.current = [];
    syncSize();
  }, [syncSize]);

  const flush = useCallback(async () => {
    if (flushingRef.current || queueRef.current.length === 0) {
      return { flushed: 0, failed: 0 };
    }
    flushingRef.current = true;
    let flushed = 0;
    let failed = 0;
    const remaining: PendingAction[] = [];

    try {
      for (const action of queueRef.current) {
        try {
          await action.run();
          flushed += 1;
        } catch (error) {
          failed += 1;
          remaining.push(action);
          logger.warn('Pending action flush failed', {
            kind: action.kind,
            dedupeKey: action.dedupeKey,
            error: error instanceof Error ? error.message : 'unknown',
          });
        }
      }
      queueRef.current = remaining;
      syncSize();
    } finally {
      flushingRef.current = false;
    }

    return { flushed, failed };
  }, [syncSize]);

  return {
    pendingCount: size,
    enqueue,
    flush,
    clear,
  };
}
