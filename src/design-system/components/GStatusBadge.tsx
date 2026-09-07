import { theme, type OrderStatusColorKey, type PartnerStatusColorKey } from '../theme';
import { GBadge, type GBadgeTone } from './GBadge';

export type GStatusBadgeProps = {
  status?: string | null;
  kind?: 'order' | 'partner';
  label?: string;
};

function formatLabel(status: string): string {
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function toneFromColor(hex: string): GBadgeTone {
  switch (hex) {
    case theme.colors.success:
    case theme.colors.online:
      return 'success';
    case theme.colors.warning:
      return 'warning';
    case theme.colors.danger:
      return 'danger';
    case theme.colors.info:
      return 'info';
    case theme.colors.accent:
      return 'accent';
    case theme.colors.primary:
    case theme.colors.primaryLight:
      return 'primary';
    default:
      return 'neutral';
  }
}

export function GStatusBadge({ status, kind = 'order', label }: GStatusBadgeProps) {
  const safeStatus = status ?? '';
  const key = safeStatus.toLowerCase().replace(/\s+/g, '_');
  let color: string = theme.colors.textSecondary;

  if (kind === 'order' && key in theme.colors.status) {
    color = theme.colors.status[key as OrderStatusColorKey];
  } else if (kind === 'partner' && key in theme.colors.partnerStatus) {
    color = theme.colors.partnerStatus[key as PartnerStatusColorKey];
  }

  return (
    <GBadge
      label={label ?? (safeStatus ? formatLabel(safeStatus) : 'Unknown')}
      tone={toneFromColor(color)}
    />
  );
}
