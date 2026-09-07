/**
 * GUNUCO Delivery Partner color tokens.
 * Brand maroon + soft pink surfaces matching the Delivery Partner UI.
 */
export const colors = {
  primary: '#6B001D',
  primaryDark: '#4A0014',
  primaryLight: '#8F1A3A',
  accent: '#C45C6A',
  accentSoft: '#FCE8ED',
  accentMuted: '#F8E4E9',
  success: '#16A34A',
  successSoft: '#E8F8EE',
  warning: '#EA8C00',
  warningSoft: '#FFF4E0',
  danger: '#E11D48',
  dangerSoft: '#FDE8EC',
  info: '#2563EB',
  infoSoft: '#E8F0FE',
  purpleSoft: '#F0E8FA',
  orangeSoft: '#FFF1E6',

  background: '#F5F5F7',
  surface: '#FFFFFF',
  surfaceMuted: '#F8F0F2',

  text: '#111111',
  textSecondary: '#6B7280',
  textInverse: '#FFFFFF',
  textMuted: '#9CA3AF',

  border: '#ECECF0',
  borderStrong: '#D8D8DE',

  online: '#16A34A',
  offline: '#9CA3AF',

  overlay: 'rgba(17, 17, 17, 0.45)',
  skeleton: '#EAEAEF',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  brandWash: 'rgba(107, 0, 29, 0.04)',

  /** Order lifecycle status colors */
  status: {
    pending: '#EA8C00',
    assigned: '#2563EB',
    accepted: '#2563EB',
    arriving_store: '#8F1A3A',
    picked_up: '#6B001D',
    in_transit: '#C45C6A',
    arriving_customer: '#C45C6A',
    delivered: '#16A34A',
    completed: '#16A34A',
    cancelled: '#E11D48',
    rejected: '#E11D48',
    failed: '#E11D48',
  },

  /** Partner availability / account status */
  partnerStatus: {
    online: '#16A34A',
    offline: '#9CA3AF',
    busy: '#EA8C00',
    on_delivery: '#2563EB',
    suspended: '#E11D48',
    pending_verification: '#EA8C00',
    verified: '#16A34A',
  },
} as const;

export type Colors = typeof colors;
export type OrderStatusColorKey = keyof typeof colors.status;
export type PartnerStatusColorKey = keyof typeof colors.partnerStatus;
