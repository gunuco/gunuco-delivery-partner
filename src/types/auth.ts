/** GUNUCO partner auth session & OTP domain types */

import type { PartnerStatus } from './partner';

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  partnerId: string;
}

export interface SendOtpRequest {
  phone: string;
  countryCode?: string;
}

export interface SendOtpResponse {
  requestId: string;
  expiresInSeconds: number;
  maskedPhone: string;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
  requestId: string;
}

export interface VerifyOtpResponse {
  session: AuthSession;
  isNewPartner: boolean;
  partnerStatus: PartnerStatus;
}
