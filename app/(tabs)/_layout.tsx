import { Tabs } from 'expo-router';

import { GIcon, theme } from '@/src/design-system';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <GIcon
              name={focused ? 'homeFilled' : 'home'}
              size={22}
              color={String(color)}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, focused }) => (
            <GIcon
              name={focused ? 'ordersFilled' : 'orders'}
              size={22}
              color={String(color)}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          title: 'Earnings',
          tabBarIcon: ({ color, focused }) => (
            <GIcon
              name={focused ? 'earningsFilled' : 'earnings'}
              size={22}
              color={String(color)}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <GIcon
              name={focused ? 'profileFilled' : 'profile'}
              size={22}
              color={String(color)}
            />
          ),
        }}
      />
    </Tabs>
  );
}
