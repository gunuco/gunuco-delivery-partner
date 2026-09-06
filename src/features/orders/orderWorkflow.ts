/**
 * Order workflow lives in `@/src/utils/orderWorkflow` — do not duplicate
 * status transitions or progress steppers here.
 *
 * Feature screens should import workflow helpers from utils and call
 * `repositories.orders` for stateful mutations.
 */
export {
  canTransition,
  getAvailableOrderActions,
  getNextPrimaryAction,
  getOrderProgressSteps,
  type OrderProgressStep,
} from '@/src/utils/orderWorkflow';
