import { delay, degradedDelay } from './delay';
import { mockStore } from './MockStore';
import { err, MOCK_FORCE_ERROR } from './result';
import type { Result } from '@/src/types';

/**
 * Shared prelude for mock repository methods:
 * simulated latency + optional forced error / degraded network.
 */
export async function withMockLatency<T>(
  run: () => Result<T> | Promise<Result<T>>,
): Promise<Result<T>> {
  const { networkDegraded, forceError } = mockStore.getState();
  if (networkDegraded) {
    await degradedDelay();
  } else {
    await delay();
  }
  if (forceError) {
    return err(MOCK_FORCE_ERROR);
  }
  return run();
}
