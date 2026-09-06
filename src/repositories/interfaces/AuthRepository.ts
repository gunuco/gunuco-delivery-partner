import type {
  AuthSession,
  Result,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from '@/src/types';

export interface AuthRepository {
  sendOtp(request: SendOtpRequest): Promise<Result<SendOtpResponse>>;
  verifyOtp(request: VerifyOtpRequest): Promise<Result<VerifyOtpResponse>>;
  logout(): Promise<Result<void>>;
  refreshSession(): Promise<Result<AuthSession>>;
  getSession(): Promise<Result<AuthSession | null>>;
}
