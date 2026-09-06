import { appConfig } from '@/src/config/env';
import type { AuthRepository } from '@/src/repositories/interfaces/AuthRepository';
import type { PartnerRepository } from '@/src/repositories/interfaces/PartnerRepository';
import type { OrderRepository } from '@/src/repositories/interfaces/OrderRepository';
import type { EarningsRepository } from '@/src/repositories/interfaces/EarningsRepository';
import type { IncentiveRepository } from '@/src/repositories/interfaces/IncentiveRepository';
import type { PerformanceRepository } from '@/src/repositories/interfaces/PerformanceRepository';
import type { ShiftRepository } from '@/src/repositories/interfaces/ShiftRepository';
import type { DemandRepository } from '@/src/repositories/interfaces/DemandRepository';
import type { NotificationRepository } from '@/src/repositories/interfaces/NotificationRepository';
import type { SupportRepository } from '@/src/repositories/interfaces/SupportRepository';
import type { DocumentRepository } from '@/src/repositories/interfaces/DocumentRepository';
import type { VehicleRepository } from '@/src/repositories/interfaces/VehicleRepository';
import type { BenefitsRepository } from '@/src/repositories/interfaces/BenefitsRepository';
import type { ReferralRepository } from '@/src/repositories/interfaces/ReferralRepository';
import { logger } from '@/src/services/logger';

import {
  ApiAuthRepository,
  ApiBenefitsRepository,
  ApiDemandRepository,
  ApiDocumentRepository,
  ApiEarningsRepository,
  ApiIncentiveRepository,
  ApiNotificationRepository,
  ApiOrderRepository,
  ApiPartnerRepository,
  ApiPerformanceRepository,
  ApiReferralRepository,
  ApiShiftRepository,
  ApiSupportRepository,
  ApiVehicleRepository,
} from './api';
import {
  applyUiTestScenario,
  MockAuthRepository,
  MockBenefitsRepository,
  MockDemandRepository,
  MockDocumentRepository,
  MockEarningsRepository,
  MockIncentiveRepository,
  MockNotificationRepository,
  MockOrderRepository,
  MockPartnerRepository,
  MockPerformanceRepository,
  MockReferralRepository,
  MockShiftRepository,
  MockSupportRepository,
  MockVehicleRepository,
} from './mock';

export interface Repositories {
  auth: AuthRepository;
  partner: PartnerRepository;
  orders: OrderRepository;
  earnings: EarningsRepository;
  incentives: IncentiveRepository;
  performance: PerformanceRepository;
  shifts: ShiftRepository;
  demand: DemandRepository;
  notifications: NotificationRepository;
  support: SupportRepository;
  documents: DocumentRepository;
  vehicle: VehicleRepository;
  benefits: BenefitsRepository;
  referrals: ReferralRepository;
}

function createMockRepositories(): Repositories {
  applyUiTestScenario();
  return {
    auth: new MockAuthRepository(),
    partner: new MockPartnerRepository(),
    orders: new MockOrderRepository(),
    earnings: new MockEarningsRepository(),
    incentives: new MockIncentiveRepository(),
    performance: new MockPerformanceRepository(),
    shifts: new MockShiftRepository(),
    demand: new MockDemandRepository(),
    notifications: new MockNotificationRepository(),
    support: new MockSupportRepository(),
    documents: new MockDocumentRepository(),
    vehicle: new MockVehicleRepository(),
    benefits: new MockBenefitsRepository(),
    referrals: new MockReferralRepository(),
  };
}

function createApiRepositories(): Repositories {
  return {
    auth: new ApiAuthRepository(),
    partner: new ApiPartnerRepository(),
    orders: new ApiOrderRepository(),
    earnings: new ApiEarningsRepository(),
    incentives: new ApiIncentiveRepository(),
    performance: new ApiPerformanceRepository(),
    shifts: new ApiShiftRepository(),
    demand: new ApiDemandRepository(),
    notifications: new ApiNotificationRepository(),
    support: new ApiSupportRepository(),
    documents: new ApiDocumentRepository(),
    vehicle: new ApiVehicleRepository(),
    benefits: new ApiBenefitsRepository(),
    referrals: new ApiReferralRepository(),
  };
}

export function createRepositories(): Repositories {
  const mode = appConfig.dataMode;
  logger.info('Creating repositories', { dataMode: mode });
  if (mode === 'api') {
    return createApiRepositories();
  }
  return createMockRepositories();
}

export const repositories: Repositories = createRepositories();
