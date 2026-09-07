import type { Order, OrderStatus } from '@/src/types';
import { formatTime } from '@/src/utils/date';
import { getOrderProgressSteps } from '@/src/utils/orderWorkflow';

export type TimelinePoint = {
  key: OrderStatus;
  label: string;
  completed: boolean;
  current: boolean;
  timeLabel?: string; // "10:02 AM"
};

const ANCHOR_STATUSES: OrderStatus[] = [
  'ASSIGNED',
  'ACCEPTED',
  'PICKED_UP',
  'DELIVERED',
];

function parseMs(value?: string): number | undefined {
  if (!value) return undefined;
  const ms = new Date(value).getTime();
  return Number.isFinite(ms) ? ms : undefined;
}

function anchorTimeMs(order: Order, status: OrderStatus): number | undefined {
  switch (status) {
    case 'ASSIGNED':
      return parseMs(order.assignedAt) ?? parseMs(order.createdAt);
    case 'ACCEPTED':
      return parseMs(order.acceptedAt);
    case 'PICKED_UP':
      return parseMs(order.pickedUpAt);
    case 'DELIVERED':
      return parseMs(order.deliveredAt);
    default:
      return undefined;
  }
}

/**
 * Build known timeline anchors, filling a synthetic end from
 * assignedAt + estimatedDurationMinutes when deliveredAt is missing.
 */
function collectAnchors(
  order: Order,
  steps: { key: OrderStatus }[],
): Map<number, number> {
  const anchors = new Map<number, number>();

  for (let i = 0; i < steps.length; i += 1) {
    const key = steps[i].key;
    if (!ANCHOR_STATUSES.includes(key)) continue;
    const ms = anchorTimeMs(order, key);
    if (ms !== undefined) {
      anchors.set(i, ms);
    }
  }

  const start =
    anchorTimeMs(order, 'ASSIGNED') ?? parseMs(order.createdAt);
  if (start !== undefined && !anchors.has(0)) {
    anchors.set(0, start);
  }

  const lastIndex = steps.length - 1;
  const endKnown = anchorTimeMs(order, 'DELIVERED');
  if (endKnown !== undefined) {
    anchors.set(lastIndex, endKnown);
  } else if (
    start !== undefined &&
    Number.isFinite(order.estimatedDurationMinutes) &&
    (order.status === 'DELIVERED' || order.status === 'FAILED')
  ) {
    anchors.set(
      lastIndex,
      start + Math.max(1, order.estimatedDurationMinutes) * 60_000,
    );
  }

  return anchors;
}

function interpolateMs(
  index: number,
  anchors: Map<number, number>,
): number | undefined {
  if (anchors.has(index)) {
    return anchors.get(index);
  }

  let prevIndex = -1;
  let nextIndex = -1;
  for (const key of anchors.keys()) {
    if (key < index && key > prevIndex) prevIndex = key;
    if (key > index && (nextIndex === -1 || key < nextIndex)) nextIndex = key;
  }

  if (prevIndex >= 0 && nextIndex >= 0) {
    const prevMs = anchors.get(prevIndex)!;
    const nextMs = anchors.get(nextIndex)!;
    const ratio = (index - prevIndex) / (nextIndex - prevIndex);
    return Math.round(prevMs + (nextMs - prevMs) * ratio);
  }

  if (prevIndex >= 0 && nextIndex < 0) {
    return anchors.get(prevIndex);
  }

  if (nextIndex >= 0 && prevIndex < 0) {
    return anchors.get(nextIndex);
  }

  return undefined;
}

/**
 * Horizontal order progress timeline with optional time labels.
 * Prefer real timestamps; interpolate intermediates so delivered
 * orders show a full 9-step timeline.
 */
export function buildOrderTimeline(order: Order): TimelinePoint[] {
  const steps = getOrderProgressSteps(order.status);
  const anchors = collectAnchors(order, steps);
  const showAllTimes =
    order.status === 'DELIVERED' ||
    (anchors.size >= 2 &&
      (order.assignedAt != null || order.createdAt != null) &&
      (order.deliveredAt != null ||
        Number.isFinite(order.estimatedDurationMinutes)));

  const allComplete = order.status === 'DELIVERED';

  return steps.map((step, index) => {
    const completed = allComplete ? true : step.completed;
    const current = allComplete ? false : step.current;
    const shouldLabel = showAllTimes || completed || current;
    const ms = shouldLabel ? interpolateMs(index, anchors) : undefined;

    return {
      key: step.key,
      label: step.label,
      completed,
      current,
      timeLabel: ms !== undefined ? formatTime(ms) : undefined,
    };
  });
}
