import { Image, StyleSheet, View } from 'react-native';

import { brandImageSources } from '../../../assets/images/brand/sources';
import { GIcon, GText, theme } from '@/src/design-system';
import type { OrderStatus } from '@/src/types';

export type OrderStatusBannerProps = {
  status: OrderStatus;
  title: string;
  message: string;
};

export function OrderStatusBanner({
  status,
  title,
  message,
}: OrderStatusBannerProps) {
  const isDelivered = status === 'DELIVERED';
  const isFailed = status === 'FAILED' || status === 'CANCELLED';

  const bg = isDelivered
    ? theme.colors.successSoft
    : isFailed
      ? theme.colors.dangerSoft
      : theme.colors.accentSoft;

  const iconColor = isDelivered
    ? theme.colors.success
    : isFailed
      ? theme.colors.danger
      : theme.colors.primary;

  const iconName = isDelivered ? 'checkCircle' : isFailed ? 'closeCircle' : 'info';

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <View style={styles.left}>
        <View style={[styles.iconCircle, { backgroundColor: iconColor }]}>
          <GIcon
            name={iconName}
            size={22}
            color={theme.colors.white}
          />
        </View>
        <View style={styles.copy}>
          <GText
            variant="title"
            style={styles.title}
            color={isDelivered ? theme.colors.success : undefined}
          >
            {title}
          </GText>
          <GText variant="caption" color={theme.colors.textSecondary}>
            {message}
          </GText>
        </View>
      </View>

      {isDelivered ? (
        <Image
          source={brandImageSources.logo}
          style={styles.logo}
          accessibilityLabel="GUNUCO"
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: theme.radius.xl,
    padding: theme.spacing[4],
    gap: theme.spacing[3],
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    minWidth: 0,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  title: {
    fontWeight: '700',
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.white,
  },
});
