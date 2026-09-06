import type { AuthRepository } from '@/src/repositories/interfaces/AuthRepository';
import type {
  AuthSession,
  Result,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from '@/src/types';

import { apiClient } from './ApiClient';

function notConnected<T>(): Result<T> {
  return { ok: false, error: apiClient.notConnectedError() };
}

export class ApiAuthRepository implements AuthRepository {
  async sendOtp(_request: SendOtpRequest): Promise<Result<SendOtpResponse>> {
    return notConnected();
  }

  async verifyOtp(_request: VerifyOtpRequest): Promise<Result<VerifyOtpResponse>> {
    return notConnected();
  }

  async logout(): Promise<Result<void>> {
    return notConnected();
  }

  async refreshSession(): Promise<Result<AuthSession>> {
    return notConnected();
  }

  async getSession(): Promise<Result<AuthSession | null>> {
    return notConnected();
  }
}
