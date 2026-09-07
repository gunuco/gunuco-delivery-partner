import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { GIcon, GText, theme, type IconName } from '@/src/design-system';
import { formatDistanceKm } from '@/src/features/orders/orderFormat';
import type { EarningsSummary } from '@/src/types';
import { formatPaise } from '@/src/utils/money';

export type HomeStatsRowProps = {
  summary?: EarningsSummary | null;
  rating: number;
};

type StatItem = {
  key: string;
  icon: IconName;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  caption: string;
};

function ratingCaption(rating: number): string {
  if (rating >= 4.5) return 'Excellent';
  if (rating >= 4.0) return 'Great';
  if (rating >= 3.5) return 'Good';
  return 'Keep going';
}

export function HomeStatsRow({ summary, rating }: HomeStatsRowProps) {
  const { width } = useWindowDimensions();
  const useScroll = width < 360;

  const todayOrders = summary?.todayOrders ?? 0;
  const items: StatItem[] = [
    {
      key: 'earnings',
      icon: 'rupee',
      iconBg: theme.colors.successSoft,
      iconColor: theme.colors.success,
      label: "Today's earnings",
      value: formatPaise(summary?.todayPaise ?? 0),
      caption: `${todayOrders} order${todayOrders === 1 ? '' : 's'}`,
    },
    {
      key: 'orders',
      icon: 'package',
      iconBg: theme.colors.purpleSoft,
      iconColor: '#7C3AED',
      label: "Today's orders",
      value: String(todayOrders),
      caption: 'Completed',
    },
    {
      key: 'distance',
      icon: 'location',
      iconBg: theme.colors.infoSoft,
      iconColor: theme.colors.info,
      label: 'Distance',
      value: formatDistanceKm(summary?.todayDistanceKm ?? 0),
      caption: 'Today',
    },
    {
      key: 'rating',
      icon: 'star',
      iconBg: theme.colors.orangeSoft,
      iconColor: theme.colors.warning,
      label: 'Rating',
      value: rating.toFixed(1),
      caption: ratingCaption(rating),
    },
  ];

  const cards = items.map((item) => (
    <View
      key={item.key}
      style={[styles.card, useScroll ? styles.cardScroll : styles.cardFlex]}
    >
      <View style={[styles.iconCircle, { backgroundColor: item.iconBg }]}>
        <GIcon name={item.icon} size={16} color={item.iconColor} />
      </View>
      <GText variant="label" color={theme.colors.textSecondary} numberOfLines={1}>
        {item.label}
      </GText>
      <GText variant="bodyBold" numberOfLines={1} style={styles.value}>
        {item.value}
      </GText>
      <GText variant="caption" color={theme.colors.textMuted} numberOfLines={1}>
        {item.caption}
      </GText>
    </View>
  ));

  if (useScroll) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {cards}
      </ScrollView>
    );
  }

  return <View style={styles.row}>{cards}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: theme.spacing[2],
  },
  scrollContent: {
    flexDirection: 'row',
    gap: theme.spacing[2],
    paddingRight: theme.spacing[1],
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing[2],
    gap: 4,
    ...theme.shadows.sm,
  },
  cardFlex: {
    flex: 1,
    minWidth: 0,
  },
  cardScroll: {
    width: 112,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  value: {
    fontWeight: '700',
  },
});
