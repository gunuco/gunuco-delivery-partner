import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import { GCard, GIcon, GText, theme } from '@/src/design-system';
import type { OrderItem } from '@/src/types';

export type OrderItemsCardProps = {
  items: OrderItem[];
  itemsCount: number;
};

function unitLabel(item: OrderItem): string {
  return /box/i.test(item.name) ? 'Box' : 'unit';
}

function chipColors(instruction: string): { bg: string; text: string } {
  const upper = instruction.toUpperCase();
  if (upper.includes('HEAT') || upper.includes('WARM')) {
    return { bg: theme.colors.orangeSoft, text: theme.colors.warning };
  }
  if (upper.includes('FLAT') || upper.includes('UPRIGHT') || upper.includes('TILT')) {
    return { bg: theme.colors.accentSoft, text: theme.colors.primary };
  }
  if (upper.includes('COLD') || upper.includes('REFRIGER')) {
    return { bg: theme.colors.infoSoft, text: theme.colors.info };
  }
  return { bg: theme.colors.accentSoft, text: theme.colors.primary };
}

export function OrderItemsCard({ items, itemsCount }: OrderItemsCardProps) {
  const safeItems = items ?? [];

  return (
    <GCard padding="md" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <GIcon name="package" size={18} color={theme.colors.primary} />
        </View>
        <GText variant="bodyBold">Items ({itemsCount})</GText>
      </View>

      <View style={styles.list}>
        {safeItems.map((item) => {
          const instructions = item.handlingInstructions ?? [];
          return (
            <View key={item.id} style={styles.row}>
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.thumb}
                  contentFit="cover"
                  accessibilityLabel={item.name}
                />
              ) : (
                <View style={[styles.thumb, styles.thumbFallback]}>
                  <GIcon name="cake" size={20} color={theme.colors.primary} />
                </View>
              )}

              <View style={styles.meta}>
                <GText variant="bodyBold" numberOfLines={2}>
                  {item.name}
                </GText>
                <GText variant="caption" color={theme.colors.textSecondary}>
                  {item.quantity} x {unitLabel(item)}
                </GText>
                {instructions.length > 0 ? (
                  <View style={styles.chips}>
                    {instructions.map((instruction) => {
                      const colors = chipColors(instruction);
                      return (
                        <View
                          key={`${item.id}-${instruction}`}
                          style={[styles.chip, { backgroundColor: colors.bg }]}
                        >
                          <GText variant="label" color={colors.text} style={styles.chipText}>
                            {instruction.toUpperCase()}
                          </GText>
                        </View>
                      );
                    })}
                  </View>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
    </GCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing[4],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    gap: theme.spacing[4],
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing[3],
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.accentSoft,
  },
  thumbFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[1],
    marginTop: 2,
  },
  chip: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: 3,
    borderRadius: theme.radius.sm,
  },
  chipText: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
