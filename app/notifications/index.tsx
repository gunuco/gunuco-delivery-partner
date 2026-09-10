import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import {
  GEmptyState,
  GErrorState,
  GIcon,
  GSkeleton,
  GText,
  theme,
  useToast,
  type IconName,
} from '@/src/design-system';
import {
  ProfileHeroCard,
  ProfileScreenShell,
  PROFILE_BG,
} from '@/src/features/profile/ProfileScreenShell';
import { useNotifications } from '@/src/hooks';
import type { NotificationCategory } from '@/src/types';
import { formatRelativeTime } from '@/src/utils/date';
import { getErrorMessage } from '@/src/utils/errors';
import { NOTIFICATION_CATEGORY_LABELS } from '@/src/utils/labels';

type Filter = 'ALL' | NotificationCategory | 'UNREAD';

const CATEGORY_ICONS: Record<NotificationCategory, IconName> = {
  ORDER: 'orders',
  EARNINGS: 'money',
  INCENTIVES: 'gift',
  SHIFT: 'calendar',
  ACCOUNT: 'profile',
  VERIFICATION: 'shield',
  SUPPORT: 'support',
  SYSTEM: 'notification',
};

export default function NotificationsScreen() {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    refetch,
    isFetching,
    markRead,
    markAllRead,
    markAllReadState,
  } = useNotifications();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<Filter>('ALL');

  const categories = useMemo(() => {
    const set = new Set<NotificationCategory>();
    notifications.forEach((n) => set.add(n.category));
    return Array.from(set);
  }, [notifications]);

  const filtered = useMemo(() => {
    if (filter === 'ALL') return notifications;
    if (filter === 'UNREAD') return notifications.filter((n) => !n.read);
    return notifications.filter((n) => n.category === filter);
  }, [notifications, filter]);

  const onMarkAllRead = () => {
    void (async () => {
      try {
        await markAllRead();
        showToast({ type: 'success', message: 'All marked as read.' });
      } catch (err) {
        Alert.alert('Couldn’t update', getErrorMessage(err));
      }
    })();
  };

  if (isLoading && notifications.length === 0) {
    return (
      <ProfileScreenShell
        title="Notifications"
        subtitle="Order updates & alerts"
        onBack={() => router.back()}
      >
        <GSkeleton height={96} borderRadius={theme.radius.xl} />
        <GSkeleton height={88} borderRadius={theme.radius.xl} />
        <GSkeleton height={88} borderRadius={theme.radius.xl} />
      </ProfileScreenShell>
    );
  }

  if (error && notifications.length === 0) {
    return (
      <View style={styles.fallback}>
        <ProfileScreenShell title="Notifications" onBack={() => router.back()}>
          <GErrorState
            title="Couldn’t load notifications"
            description={getErrorMessage(error)}
            onRetry={() => {
              void refetch();
            }}
          />
        </ProfileScreenShell>
      </View>
    );
  }

  return (
    <ProfileScreenShell
      title="Notifications"
      subtitle={
        unreadCount > 0 ? `${unreadCount} unread` : 'You’re all caught up'
      }
      onBack={() => router.back()}
      refreshing={isFetching && !isLoading}
      onRefresh={() => {
        void refetch();
      }}
      rightAction={
        unreadCount > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Mark all as read"
            onPress={onMarkAllRead}
            disabled={markAllReadState.isLoading}
            hitSlop={8}
            style={({ pressed }) => [styles.readAllBtn, pressed && styles.pressed]}
          >
            <GText variant="caption" color={theme.colors.primary} style={styles.readAllLabel}>
              Read all
            </GText>
          </Pressable>
        ) : null
      }
    >
      <ProfileHeroCard
        tone="primary"
        icon="notification"
        eyebrow="Inbox"
        title={unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
        body="Order updates, incentives, and payout alerts land here."
      />

      <View style={styles.chips}>
        {(
          [
            { key: 'ALL' as const, label: 'All' },
            { key: 'UNREAD' as const, label: 'Unread' },
            ...categories.map((category) => ({
              key: category,
              label: NOTIFICATION_CATEGORY_LABELS[category],
            })),
          ] as { key: Filter; label: string }[]
        ).map((item) => {
          const selected = filter === item.key;
          return (
            <Pressable
              key={String(item.key)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setFilter(item.key)}
              style={[
                styles.chip,
                selected ? styles.chipSelected : styles.chipIdle,
              ]}
            >
              <GText
                variant="caption"
                color={selected ? theme.colors.textInverse : theme.colors.text}
                style={styles.chipLabel}
              >
                {item.label}
              </GText>
            </Pressable>
          );
        })}
      </View>

      {filtered.length === 0 ? (
        <GEmptyState
          title="No notifications"
          description="Order updates, incentives, and payout alerts will land here."
        />
      ) : (
        filtered.map((item) => {
          const icon = CATEGORY_ICONS[item.category] ?? 'notification';
          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={item.title}
              onPress={() => {
                void (async () => {
                  if (!item.read) {
                    try {
                      await markRead(item.id);
                    } catch {
                      // Still allow navigation if mark-read fails.
                    }
                  }
                  if (item.deepLink) {
                    router.push(item.deepLink as never);
                  }
                })();
              }}
              style={({ pressed }) => [
                styles.card,
                !item.read && styles.cardUnread,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.iconCircle}>
                <GIcon name={icon} size={18} color={theme.colors.primary} />
              </View>
              <View style={styles.copy}>
                <View style={styles.titleRow}>
                  <GText variant="bodyBold" style={styles.title} numberOfLines={1}>
                    {item.title}
                  </GText>
                  {!item.read ? (
                    <View style={styles.newPill}>
                      <GText variant="label" color={theme.colors.primary}>
                        New
                      </GText>
                    </View>
                  ) : null}
                </View>
                <GText variant="caption" color={theme.colors.textSecondary} numberOfLines={2}>
                  {item.body}
                </GText>
                <GText variant="caption" color={theme.colors.textMuted}>
                  {NOTIFICATION_CATEGORY_LABELS[item.category]} ·{' '}
                  {formatRelativeTime(item.createdAt)}
                </GText>
              </View>
              {item.deepLink ? (
                <GIcon name="chevronRight" size={18} color={theme.colors.textMuted} />
              ) : null}
            </Pressable>
          );
        })
      )}
    </ProfileScreenShell>
  );
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    backgroundColor: PROFILE_BG,
  },
  readAllBtn: {
    paddingVertical: 4,
  },
  readAllLabel: {
    fontWeight: '700',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
  },
  chip: {
    minHeight: 36,
    paddingHorizontal: theme.spacing[3],
    borderRadius: theme.radius.full,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipIdle: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.borderStrong,
  },
  chipLabel: {
    fontWeight: '600',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing[3],
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing[3],
    ...theme.shadows.sm,
  },
  cardUnread: {
    borderWidth: 1,
    borderColor: theme.colors.accentSoft,
    backgroundColor: '#FFFCFD',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  title: {
    flexShrink: 1,
  },
  newPill: {
    backgroundColor: theme.colors.accentSoft,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: 2,
    borderRadius: theme.radius.full,
  },
  pressed: {
    opacity: 0.9,
  },
});
