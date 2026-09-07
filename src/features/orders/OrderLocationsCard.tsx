import { Pressable, StyleSheet, View } from 'react-native';

import { GCard, GIcon, GText, theme } from '@/src/design-system';

export type OrderLocationsCardProps = {
  pickupName: string;
  pickupAddress: string;
  pickupInstructions?: string;
  customerName: string;
  deliveryAddress: string;
  deliveryInstructions?: string;
  onOpenPickupMap: () => void;
  onOpenDeliveryMap: () => void;
};

export function OrderLocationsCard({
  pickupName,
  pickupAddress,
  pickupInstructions,
  customerName,
  deliveryAddress,
  deliveryInstructions,
  onOpenPickupMap,
  onOpenDeliveryMap,
}: OrderLocationsCardProps) {
  return (
    <GCard padding="md" style={styles.card}>
      <View style={styles.block}>
        <View style={styles.rail}>
          <View style={[styles.iconCircle, styles.pickupIcon]}>
            <GIcon name="store" size={18} color={theme.colors.primary} />
          </View>
          <View style={styles.dottedLine}>
            {Array.from({ length: 8 }).map((_, i) => (
              <View key={i} style={styles.dot} />
            ))}
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.headerRow}>
            <GText variant="bodyBold">Pickup</GText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="View pickup on map"
              onPress={onOpenPickupMap}
              hitSlop={8}
            >
              <GText variant="caption" color={theme.colors.primary} style={styles.mapLink}>
                View on map
              </GText>
            </Pressable>
          </View>
          <GText variant="bodyBold" style={styles.placeName}>
            {pickupName}
          </GText>
          <GText variant="caption" color={theme.colors.textSecondary}>
            {pickupAddress}
          </GText>
          {pickupInstructions ? (
            <View style={styles.pickupInstruction}>
              <GText variant="caption" color={theme.colors.primary}>
                {pickupInstructions}
              </GText>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.block}>
        <View style={styles.rail}>
          <View style={[styles.iconCircle, styles.customerIcon]}>
            <GIcon name="profile" size={18} color={theme.colors.success} />
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.headerRow}>
            <GText variant="bodyBold">Customer</GText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="View customer on map"
              onPress={onOpenDeliveryMap}
              hitSlop={8}
            >
              <GText variant="caption" color={theme.colors.primary} style={styles.mapLink}>
                View on map
              </GText>
            </Pressable>
          </View>
          <GText variant="bodyBold" style={styles.placeName}>
            {customerName}
          </GText>
          <GText variant="caption" color={theme.colors.textSecondary}>
            {deliveryAddress}
          </GText>
          {deliveryInstructions ? (
            <View style={styles.deliveryInstruction}>
              <GText variant="caption" color={theme.colors.textSecondary}>
                {deliveryInstructions}
              </GText>
            </View>
          ) : null}
        </View>
      </View>
    </GCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing[4],
  },
  block: {
    flexDirection: 'row',
    gap: theme.spacing[3],
  },
  rail: {
    width: 36,
    alignItems: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickupIcon: {
    backgroundColor: theme.colors.accentSoft,
  },
  customerIcon: {
    backgroundColor: theme.colors.successSoft,
  },
  dottedLine: {
    flex: 1,
    marginTop: theme.spacing[1],
    marginBottom: -theme.spacing[4],
    alignItems: 'center',
    justifyContent: 'space-evenly',
    minHeight: 36,
    gap: 4,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
  },
  body: {
    flex: 1,
    gap: 4,
    minWidth: 0,
    paddingBottom: theme.spacing[1],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing[2],
  },
  mapLink: {
    fontWeight: '600',
  },
  placeName: {
    fontWeight: '700',
  },
  pickupInstruction: {
    marginTop: theme.spacing[1],
    backgroundColor: theme.colors.accentSoft,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
  },
  deliveryInstruction: {
    marginTop: theme.spacing[1],
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
  },
});
