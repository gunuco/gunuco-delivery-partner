/**
 * GUNUCO Delivery Partner color tokens.
 * Warm cocoa primary, soft rose-gold accent — professional rider-app palette.
 */
export const colors = {
  primary: '#5C3A21',
  primaryDark: '#3E2615',
  primaryLight: '#8B5E3C',
  accent: '#C45C6A',
  success: '#1B7A4E',
  warning: '#C47B1A',
  danger: '#C62828',
  info: '#2F6FED',

  background: '#FBF7F2',
  surface: '#FFFFFF',
  surfaceMuted: '#F5EDE3',

  text: '#1A1410',
  textSecondary: '#6B5E54',
  textInverse: '#FFFFFF',
  textMuted: '#9A8B7E',

  border: '#E8DDD2',
  borderStrong: '#D4C4B5',

  online: '#1B7A4E',
  offline: '#8A8178',

  overlay: 'rgba(26, 20, 16, 0.48)',
  skeleton: '#EDE4DA',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  /** Order lifecycle status colors */
  status: {
    pending: '#C47B1A',
    assigned: '#2F6FED',
    accepted: '#2F6FED',
    arriving_store: '#8B5E3C',
    picked_up: '#5C3A21',
    in_transit: '#C45C6A',
    arriving_customer: '#C45C6A',
    delivered: '#1B7A4E',
    completed: '#1B7A4E',
    cancelled: '#C62828',
    rejected: '#C62828',
    failed: '#C62828',
  },

  /** Partner availability / account status */
  partnerStatus: {
    online: '#1B7A4E',
    offline: '#8A8178',
    busy: '#C47B1A',
    on_delivery: '#2F6FED',
    suspended: '#C62828',
    pending_verification: '#C47B1A',
    verified: '#1B7A4E',
  },
} as const;

export type Colors = typeof colors;
export type OrderStatusColorKey = keyof typeof colors.status;
export type PartnerStatusColorKey = keyof typeof colors.partnerStatus;
