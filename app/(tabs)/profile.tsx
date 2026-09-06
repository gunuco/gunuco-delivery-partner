import { router } from 'expo-router';
import { useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  GAvatar,
  GConfirmationDialog,
  GErrorState,
  GHeader,
  GIcon,
  GListRow,
  GSkeleton,
  GStatusBadge,
  GText,
  theme,
} from '@/src/design-system';
import { useAuth, useNotifications, usePartner } from '@/src/hooks';
import { maskPhone } from '@/src/utils/phone';

export default function ProfileTabScreen() {
  const insets = useSafeAreaInsets();
  const { partner, availability, isLoading, error, refetch, isFetching } =
    usePartner();
  const { unreadCount } = useNotifications();
  const { logout, logoutState } = useAuth();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const sections: {
    title: string;
    subtitle: string;
    href: string;
    icon: 'profile' | 'document' | 'vehicle' | 'money' | 'shield' | 'star' | 'help' | 'settings' | 'notification';
  }[] = [
    {
      title: 'Personal details',
      subtitle: 'Name, contact, hub',
      href: '/profile/personal',
      icon: 'profile',
    },
    {
      title: 'Documents',
      subtitle: 'Licence, RC, identity',
      href: '/profile/documents',
      icon: 'document',
    },
    {
      title: 'Vehicle',
      subtitle: 'Bike / scooter details',
      href: '/profile/vehicle',
      icon: 'vehicle',
    },
    {
      title: 'Bank account',
      subtitle: 'Payout destination',
      href: '/profile/bank',
      icon: 'money',
    },
    {
      title: 'Insurance',
      subtitle: 'On-trip cover',
      href: '/profile/insurance',
      icon: 'shield',
    },
    {
      title: 'Benefits',
      subtitle: 'Partner perks',
      href: '/profile/benefits',
      icon: 'star',
    },
    {
      title: 'Training',
      subtitle: 'Cake handling & safety',
      href: '/profile/training',
      icon: 'help',
    },
    {
      title: 'Refer & earn',
      subtitle: 'Invite partners',
      href: '/profile/referral',
      icon: 'star',
    },
    {
      title: 'Notifications',
      subtitle:
        unreadCount > 0 ? `${unreadCount} unread` : 'Alerts & updates',
      href: '/notifications',
      icon: 'notification',
    },
    {
      title: 'Settings',
      subtitle: 'App preferences',
      href: '/settings',
      icon: 'settings',
    },
    {
      title: 'Support',
      subtitle: 'Help & tickets',
      href: '/support',
      icon: 'help',
    },
  ];

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <GHeader title="Profile" subtitle="Your GUNUCO partner account" />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={() => {
              void refetch();
            }}
            tintColor={theme.colors.primary}
          />
        }
      >
        {isLoading && !partner ? (
          <View style={styles.skeleton}>
            <GSkeleton width={72} height={72} borderRadius={36} />
            <GSkeleton height={24} width="60%" />
            <GSkeleton height={16} width="40%" />
          </View>
        ) : error && !partner ? (
          <GErrorState
            title="Couldn't load profile"
            onRetry={() => {
              void refetch();
            }}
          />
        ) : (
          <>
            <View style={styles.hero}>
              <GAvatar size="lg" uri={partner?.photoUrl} name={partner?.name} />
              <GText variant="h2">{partner?.name ?? 'Partner'}</GText>
              <GText variant="caption" color={theme.colors.textSecondary}>
                {partner?.partnerCode ?? '—'}
              </GText>
              <GText variant="caption" color={theme.colors.textMuted}>
                {partner?.phone ? maskPhone(partner.phone) : '—'}
              </GText>
              <View style={styles.metaRow}>
                {availability ? (
                  <GStatusBadge
                    status={availability.toLowerCase()}
                    kind="partner"
                  />
                ) : null}
                <GText variant="bodyBold">
                  ★ {partner?.rating?.toFixed(2) ?? '—'}
                </GText>
              </View>
            </View>

            {sections.map((section) => (
              <GListRow
                key={section.href}
                title={section.title}
                subtitle={section.subtitle}
                left={
                  <GIcon
                    name={section.icon}
                    size={22}
                    color={theme.colors.primary}
                  />
                }
                showChevron
                onPress={() => router.push(section.href as never)}
              />
            ))}

            <GListRow
              title="Log out"
              subtitle="Sign out of this device"
              left={
                <GIcon name="logout" size={22} color={theme.colors.danger} />
              }
              onPress={() => setConfirmLogout(true)}
            />
          </>
        )}
      </ScrollView>

      <GConfirmationDialog
        visible={confirmLogout}
        title="Log out?"
        message="You’ll need to verify your phone again to continue delivering."
        confirmLabel="Log out"
        cancelLabel="Stay signed in"
        destructive
        loading={logoutState.isLoading}
        onConfirm={() => {
          void (async () => {
            await logout();
            setConfirmLogout(false);
            router.replace('/(auth)/login');
          })();
        }}
        onCancel={() => setConfirmLogout(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingBottom: theme.spacing[10],
  },
  skeleton: {
    padding: theme.spacing[4],
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  hero: {
    alignItems: 'center',
    gap: theme.spacing[2],
    paddingVertical: theme.spacing[5],
    paddingHorizontal: theme.spacing[4],
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    marginTop: theme.spacing[1],
  },
});
