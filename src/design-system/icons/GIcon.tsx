import { Ionicons } from '@expo/vector-icons';

import { theme } from '../theme';
import { iconMap, type IconName } from './iconMap';

export type GIconProps = {
  name: IconName;
  size?: number;
  color?: string;
  accessibilityLabel?: string;
};

export function GIcon({
  name,
  size = theme.components.iconSizes.md,
  color = theme.colors.text,
  accessibilityLabel,
}: GIconProps) {
  return (
    <Ionicons
      name={iconMap[name]}
      size={size}
      color={color}
      accessibilityLabel={accessibilityLabel ?? name}
    />
  );
}
