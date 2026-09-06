/** Simulated network latency for mock repositories (200–600ms). */

export function randomDelayMs(min = 200, max = 600): number {
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  return Math.floor(lo + Math.random() * (hi - lo + 1));
}

export function delay(ms?: number): Promise<void> {
  const wait = ms ?? randomDelayMs();
  return new Promise((resolve) => {
    setTimeout(resolve, wait);
  });
}

/** Longer delay used when scenario.networkDegraded is true. */
export function degradedDelay(): Promise<void> {
  return delay(randomDelayMs(800, 1800));
}
