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

export function GOrderCard({
  orderNumber,
  status,
  customerArea,
  earnings,
  distance,
  onPress,
}: GOrderCardProps) {
  return (
    <GCard onPress={onPress} padding="md" style={styles.card}>
      <View style={styles.top}>
        <GText variant="bodyBold">#{orderNumber}</GText>
        <GStatusBadge status={status} kind="order" />
      </View>
      <View style={styles.areaRow}>
        <GIcon name="location" size={16} color={theme.colors.textSecondary} />
        <GText variant="body" color={theme.colors.textSecondary} numberOfLines={1} style={styles.area}>
          {customerArea}
        </GText>
      </View>
      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <GIcon name="money" size={16} color={theme.colors.success} />
          <GText variant="bodyBold" color={theme.colors.success}>
            {earnings}
          </GText>
        </View>
        <View style={styles.metaItem}>
          <GIcon name="distance" size={16} color={theme.colors.textSecondary} />
          <GText variant="caption" color={theme.colors.textSecondary}>
            {distance}
          </GText>
        </View>
      </View>
    </GCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing[2],
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing[2],
  },
  areaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[1],
  },
  area: {
    flex: 1,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing[1],
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[1],
  },
});
