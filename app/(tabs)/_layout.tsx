import { useCallback } from 'react';
import { Tabs } from 'expo-router';

import { theme, useToast } from '@/src/design-system';
import { PartnerTabBar } from '@/src/features/home/PartnerTabBar';
import { useOrders, usePartner } from '@/src/hooks';

function TabsWithPartnerBar() {
  const toast = useToast();
  const {
    availability,
    goOnline,
    goOffline,
    isTogglingAvailability,
  } = usePartner();
  const { orders } = useOrders();

  const isOnline = availability === 'ONLINE' || availability === 'BUSY';
  const ordersBadge = orders.filter(
    (o) =>
      o.status === 'ASSIGNED' ||
      o.status === 'ACCEPTED' ||
      o.status === 'GOING_TO_PICKUP' ||
      o.status === 'ARRIVED_AT_PICKUP' ||
      o.status === 'PICKED_UP' ||
      o.status === 'GOING_TO_CUSTOMER' ||
      o.status === 'ARRIVED_AT_CUSTOMER' ||
      o.status === 'DELIVERY_VERIFICATION',
  ).length;

  const onToggleOnline = useCallback(async () => {
    try {
      if (isOnline) {
        await goOffline();
        toast.showToast({ type: 'info', message: 'You are offline' });
      } else {
        await goOnline();
        toast.showToast({ type: 'success', message: 'You are online' });
      }
    } catch {
      toast.showToast({
        type: 'error',
        message: 'Could not update availability. Please try again.',
      });
    }
  }, [goOffline, goOnline, isOnline, toast]);

  return (
    <Tabs
      tabBar={(props) => (
        <PartnerTabBar
          {...props}
          isOnline={isOnline}
          isToggling={isTogglingAvailability}
          onToggleOnline={onToggleOnline}
          ordersBadge={ordersBadge}
        />
      )}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="orders" options={{ title: 'Orders' }} />
      <Tabs.Screen name="earnings" options={{ title: 'Earnings' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

export default function TabsLayout() {
  return <TabsWithPartnerBar />;
}
