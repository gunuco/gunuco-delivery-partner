import { StyleSheet, View } from 'react-native';

import { GIcon } from '../icons/GIcon';
import { theme } from '../theme';
import { GCard } from './GCard';
import { GStatusBadge } from './GStatusBadge';
import { GText } from './GText';

export type GOrderCardProps = {
  orderNumber: string;
  status: string;
  customerArea: string;
  earnings: string;
  distance: string;
  onPress?: () => void;
};

function statusLabel(status: string): string {
  return status.replace(/_/g, ' ').toUpperCase();
}

export function GOrderCard({
  orderNumber,
  status,
  customerArea,
  earnings,
  distance,
  onPress,
}: GOrderCardProps) {
  return (
    <GCard onPress={onPress} padding="md" elevated style={styles.card}>
      <View pointerEvents="none" style={styles.watermark}>
        <GIcon name="package" size={72} color={theme.colors.accentSoft} />
      </View>

      <View style={styles.top}>
        <GText variant="bodyBold" style={styles.orderNumber}>
          #{orderNumber}
        </GText>
        <GStatusBadge status={status} kind="order" label={statusLabel(status)} />
      </View>

      <View style={styles.areaRow}>
        <GIcon name="location" size={15} color={theme.colors.textSecondary} />
        <GText
          variant="body"
          color={theme.colors.textSecondary}
          numberOfLines={1}
          style={styles.area}
        >
          {customerArea}
        </GText>
      </View>

      <View style={styles.bottom}>
        <View style={styles.metaCluster}>
          <View style={styles.metaItem}>
            <GIcon name="money" size={16} color={theme.colors.success} />
            <GText variant="bodyBold" color={theme.colors.success}>
              {earnings}
            </GText>
          </View>
          <View style={styles.divider} />
          <View style={styles.metaItem}>
            <GIcon name="distance" size={16} color={theme.colors.textSecondary} />
            <GText variant="caption" color={theme.colors.textSecondary}>
              {distance}
            </GText>
          </View>
        </View>
        <GIcon name="chevronRight" size={18} color={theme.colors.textMuted} />
      </View>
    </GCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing[2],
    overflow: 'hidden',
    borderWidth: 0,
    borderRadius: theme.radius.xl,
  },
  watermark: {
    position: 'absolute',
    right: 56,
    top: '50%',
    marginTop: -36,
    opacity: 0.55,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing[2],
    zIndex: 1,
  },
  orderNumber: {
    flexShrink: 1,
  },
  areaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[1],
    zIndex: 1,
  },
  area: {
    flex: 1,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing[1],
    gap: theme.spacing[2],
    zIndex: 1,
  },
  metaCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    flexShrink: 1,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[1],
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: 16,
    backgroundColor: theme.colors.borderStrong,
  },
});
