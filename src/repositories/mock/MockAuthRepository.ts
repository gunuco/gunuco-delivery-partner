import type {
  AuthRepository,
} from '@/src/repositories/interfaces/AuthRepository';
import type {
  AuthSession,
  PartnerDocument,
  Result,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from '@/src/types';
import { maskPhone } from '@/src/utils/phone';
import * as sessionService from '@/src/services/session';
import { logger } from '@/src/services/logger';

import { mockStore } from './MockStore';
import { appError, err, ok, UNAUTHORIZED } from './result';
import {
  createSeedOnboarding,
  createSeedPersonalDetails,
  createSeedSession,
  MOCK_OTP,
  SEED_PARTNER_PHONE,
} from './seedData';
import { withMockLatency } from './withMockLatency';

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.startsWith('91') && digits.length === 12) {
    return `+${digits}`;
  }
  if (phone.startsWith('+')) {
    return phone;
  }
  return `+${digits}`;
}

export class MockAuthRepository implements AuthRepository {
  async sendOtp(request: SendOtpRequest): Promise<Result<SendOtpResponse>> {
    return withMockLatency(() => {
      const phone = normalizePhone(request.phone);
      const requestId = `otp_req_${Date.now()}`;
      // Store OTP for verify — NEVER log the OTP value
      mockStore.addPendingOtp({
        requestId,
        phone,
        otp: MOCK_OTP,
        expiresAtMs: Date.now() + 5 * 60_000,
      });
      logger.info('OTP sent (mock)', { requestId, maskedPhone: maskPhone(phone) });
      return ok<SendOtpResponse>({
        requestId,
        expiresInSeconds: 300,
        maskedPhone: maskPhone(phone),
      });
    });
  }

  async verifyOtp(request: VerifyOtpRequest): Promise<Result<VerifyOtpResponse>> {
    return withMockLatency(async () => {
      const pending = mockStore.takePendingOtp(request.requestId);
      if (!pending || pending.expiresAtMs < Date.now()) {
        return err<VerifyOtpResponse>(
          appError(
            'OTP_EXPIRED',
            'OTP request expired or missing',
            'OTP expired. Please request a new one.',
            true,
          ),
        );
      }

      // Accept MOCK_OTP for any phone; never log request.otp
      if (request.otp !== MOCK_OTP) {
        logger.warn('OTP verification failed (mock)', { requestId: request.requestId });
        return err<VerifyOtpResponse>(
          appError(
            'OTP_INVALID',
            'Invalid OTP',
            'Incorrect OTP. Please try again.',
            true,
          ),
        );
      }

      const phone = normalizePhone(request.phone);
      const partner = mockStore.getState().partner;
      const isNewPartner = phone !== SEED_PARTNER_PHONE && partner.phone !== phone;

      if (!isNewPartner) {
        mockStore.patchPartner({ phone });
      } else {
        const blankDocs: PartnerDocument[] = [
          'DRIVING_LICENCE',
          'RC',
          'INSURANCE',
          'IDENTITY',
          'PROFILE_PHOTO',
        ].map((type) => ({
          id: `doc_${type.toLowerCase()}`,
          type: type as PartnerDocument['type'],
          status: 'NOT_UPLOADED' as const,
        }));
        mockStore.patchPartner({
          phone,
          status: 'PENDING',
          availability: 'UNAVAILABLE',
          onboardingStep: 'PERSONAL_DETAILS',
          name: 'New Partner',
          photoUrl: undefined,
          totalDeliveries: 0,
          rating: 0,
        });
        mockStore.replaceState({
          onboarding: createSeedOnboarding({
            currentStep: 'PERSONAL_DETAILS',
            completedSteps: ['PHONE_VERIFIED'],
          }),
          personalDetails: {
            ...createSeedPersonalDetails(),
            fullName: '',
            dateOfBirth: '',
            address: '',
            city: 'Hyderabad',
            state: 'Telangana',
            pincode: '',
          },
          documents: blankDocs,
        });
      }

      const session = createSeedSession(partner.id);
      mockStore.setSession(session);
      await sessionService.setSession(session);

      logger.info('OTP verified (mock)', {
        partnerId: session.partnerId,
        isNewPartner,
      });

      return ok<VerifyOtpResponse>({
        session,
        isNewPartner,
        partnerStatus: mockStore.getState().partner.status,
      });
    });
  }

  async logout(): Promise<Result<void>> {
    return withMockLatency(async () => {
      mockStore.setSession(null);
      mockStore.patchPartner({ availability: 'OFFLINE' });
      await sessionService.clearSession();
      logger.info('Partner logged out (mock)');
      return ok(undefined);
    });
  }

  async refreshSession(): Promise<Result<AuthSession>> {
    return withMockLatency(async () => {
      const current = mockStore.getState().session;
      if (!current) {
        return err(UNAUTHORIZED);
      }
      const refreshed: AuthSession = {
        ...current,
        accessToken: `mock_access_${current.partnerId}_${Date.now()}`,
        expiresAt: new Date(Date.now() + 12 * 3_600_000).toISOString(),
      };
      mockStore.setSession(refreshed);
      await sessionService.setSession(refreshed);
      logger.info('Session refreshed (mock)', { partnerId: refreshed.partnerId });
      return ok(refreshed);
    });
  }

  async getSession(): Promise<Result<AuthSession | null>> {
    return withMockLatency(async () => {
      const memory = mockStore.getState().session;
      if (memory) {
        return ok(memory);
      }
      const stored = await sessionService.getSession();
      if (stored) {
        mockStore.setSession(stored);
      }
      return ok(stored);
    });
  }
}
