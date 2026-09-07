import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GIcon, GText, theme } from '@/src/design-system';

export type OrderDetailsTopBarProps = {
  orderNumber: string;
  subtitle: string;
  onBack: () => void;
  onSupport: () => void;
  onMore?: () => void;
};

export function OrderDetailsTopBar({
  orderNumber,
  subtitle,
  onBack,
  onSupport,
  onMore,
}: OrderDetailsTopBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top + theme.spacing[2] }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={onBack}
        style={styles.circleBtn}
        hitSlop={8}
      >
        <GIcon name="back" size={20} color={theme.colors.text} />
      </Pressable>

      <View style={styles.center}>
        <GText variant="title" style={styles.orderNumber} numberOfLines={1}>
          #{orderNumber}
        </GText>
        <GText
          variant="caption"
          color={theme.colors.textSecondary}
          numberOfLines={1}
          center
        >
          {subtitle}
        </GText>
      </View>

      <View style={styles.right}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Support"
          onPress={onSupport}
          style={styles.circleBtn}
          hitSlop={8}
        >
          <GIcon name="support" size={18} color={theme.colors.text} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="More options"
          onPress={onMore}
          style={styles.circleBtn}
          hitSlop={8}
        >
          <GIcon name="more" size={18} color={theme.colors.text} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[4],
    paddingBottom: theme.spacing[3],
    gap: theme.spacing[2],
    backgroundColor: theme.colors.background,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    backgroundColor: '#EEF0F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
    paddingHorizontal: theme.spacing[1],
  },
  orderNumber: {
    fontWeight: '700',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
});
