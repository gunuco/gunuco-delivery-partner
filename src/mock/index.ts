/**
 * Mock / UI-test scenario helpers for GUNUCO Delivery Partner.
 * Prefer importing from `@/src/repositories/mock` for store access.
 */
export {
  applyUiTestScenario,
  getActiveScenarioName,
  reseedScenario,
} from '@/src/repositories/mock/scenarioSeeder';
export {
  createFullSeed,
  createSeedPartner,
  MOCK_OTP,
  SEED_PARTNER_CODE,
  SEED_PARTNER_ID,
  SEED_PARTNER_PHONE,
} from '@/src/repositories/mock/seedData';
export { mockStore } from '@/src/repositories/mock/MockStore';
export {
  getScenarioSeed,
  isUiTestScenario,
  SCENARIO_DEFAULTS,
  UI_TEST_SCENARIO_LIST,
  type ScenarioSeed,
  type UiTestScenario,
} from '@/src/config/scenarios';
