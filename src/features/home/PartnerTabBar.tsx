import { Pressable, StyleSheet, View } from 'react-native';
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';

import { GIcon, GText, theme, type IconName } from '@/src/design-system';

export type PartnerTabBarProps = BottomTabBarProps & {
  isOnline: boolean;
  isToggling?: boolean;
  onToggleOnline: () => void;
  ordersBadge?: number;
};

type TabMeta = {
  routeName: string;
  label: string;
  icon: IconName;
  iconFocused: IconName;
};

const LEFT_TABS: TabMeta[] = [
  { routeName: 'home', label: 'Home', icon: 'home', iconFocused: 'homeFilled' },
  { routeName: 'orders', label: 'Orders', icon: 'orders', iconFocused: 'ordersFilled' },
];

const RIGHT_TABS: TabMeta[] = [
  {
    routeName: 'earnings',
    label: 'Earnings',
    icon: 'earnings',
    iconFocused: 'earningsFilled',
  },
  {
    routeName: 'profile',
    label: 'Profile',
    icon: 'profile',
    iconFocused: 'profileFilled',
  },
];

function TabItem({
  meta,
  focused,
  onPress,
  onLongPress,
  badge,
}: {
  meta: TabMeta;
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  badge?: number;
}) {
  const color = focused ? theme.colors.primary : theme.colors.textMuted;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={meta.label}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tab}
    >
      <View>
        <GIcon
          name={focused ? meta.iconFocused : meta.icon}
          size={22}
          color={color}
        />
        {badge != null && badge > 0 ? <View style={styles.badgeDot} /> : null}
      </View>
      <GText variant="label" color={color} style={styles.tabLabel}>
        {meta.label}
      </GText>
    </Pressable>
  );
}

export function PartnerTabBar({
  state,
  descriptors,
  navigation,
  insets,
  isOnline,
  isToggling = false,
  onToggleOnline,
  ordersBadge,
}: PartnerTabBarProps) {
  const renderTab = (meta: TabMeta) => {
    const routeIndex = state.routes.findIndex((r) => r.name === meta.routeName);
    if (routeIndex < 0) return null;
    const route = state.routes[routeIndex];
    const focused = state.index === routeIndex;
    const descriptor = descriptors[route.key];
    if (!descriptor) return null;
    const { options } = descriptor;

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });
      if (!focused && !event.defaultPrevented) {
        navigation.navigate(route.name, route.params);
      }
    };

    const onLongPress = () => {
      navigation.emit({
        type: 'tabLongPress',
        target: route.key,
      });
    };

    return (
      <TabItem
        key={route.key}
        meta={{
          ...meta,
          label: typeof options.title === 'string' ? options.title : meta.label,
        }}
        focused={focused}
        onPress={onPress}
        onLongPress={onLongPress}
        badge={meta.routeName === 'orders' ? ordersBadge : undefined}
      />
    );
  };

  return (
    <View
      style={[
        styles.bar,
        { paddingBottom: Math.max(insets.bottom, theme.spacing[2]) },
      ]}
    >
      <View style={styles.side}>{LEFT_TABS.map(renderTab)}</View>

      <View style={styles.centerSlot}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isOnline ? 'Go offline' : 'Go online'}
          accessibilityState={{ disabled: isToggling, checked: isOnline }}
          disabled={isToggling}
          onPress={onToggleOnline}
          style={[styles.centerButton, isToggling && styles.centerDisabled]}
        >
          <GIcon name="scooter" size={28} color={theme.colors.white} />
        </Pressable>
        <GText
          variant="label"
          color={isOnline ? theme.colors.primary : theme.colors.textSecondary}
          style={styles.centerLabel}
        >
          {isOnline ? 'Go Offline' : 'Go Online'}
        </GText>
      </View>

      <View style={styles.side}>{RIGHT_TABS.map(renderTab)}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing[2],
    paddingHorizontal: theme.spacing[2],
    minHeight: theme.components.tabBarHeight + theme.spacing[4],
  },
  side: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    minHeight: theme.components.minTouchTarget,
    paddingBottom: theme.spacing[1],
  },
  tabLabel: {
    fontWeight: '600',
  },
  badgeDot: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.danger,
  },
  centerSlot: {
    width: 88,
    alignItems: 'center',
    marginTop: -28,
  },
  centerButton: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
    borderWidth: 4,
    borderColor: theme.colors.surface,
  },
  centerDisabled: {
    opacity: 0.6,
  },
  centerLabel: {
    marginTop: 4,
    fontWeight: '600',
    textAlign: 'center',
  },
});
