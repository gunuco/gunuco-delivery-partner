import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import {
  GBadge,
  GChip,
  GEmptyState,
  GErrorState,
  GHeader,
  GListRow,
  GSkeleton,
  GText,
  theme,
  useToast,
} from '@/src/design-system';
import { useNotifications } from '@/src/hooks';
import type { NotificationCategory } from '@/src/types';
import { formatRelativeTime } from '@/src/utils/date';
import { getErrorMessage } from '@/src/utils/errors';
import { NOTIFICATION_CATEGORY_LABELS } from '@/src/utils/labels';

type Filter = 'ALL' | NotificationCategory | 'UNREAD';

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

  if (isLoading && notifications.length === 0) {
    return (
      <View style={styles.screen}>
        <GHeader title="Notifications" showBack onBack={() => router.back()} />
        <View style={styles.pad}>
          <GSkeleton height={64} borderRadius={theme.radius.md} />
          <GSkeleton height={64} borderRadius={theme.radius.md} />
          <GSkeleton height={64} borderRadius={theme.radius.md} />
        </View>
      </View>
    );
  }

  if (error && notifications.length === 0) {
    return (
      <View style={styles.screen}>
        <GHeader title="Notifications" showBack onBack={() => router.back()} />
        <GErrorState
          title="Couldn’t load notifications"
          description={getErrorMessage(error)}
          onRetry={() => {
            void refetch();
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <GHeader
        title="Notifications"
        subtitle={
          unreadCount > 0 ? `${unreadCount} unread` : 'You’re all caught up'
        }
        showBack
        onBack={() => router.back()}
        rightActions={
          unreadCount > 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Mark all as read"
              onPress={() => {
                void (async () => {
                  try {
                    await markAllRead();
                    showToast({ type: 'success', message: 'All marked as read.' });
                  } catch (err) {
                    Alert.alert('Couldn’t update', getErrorMessage(err));
                  }
                })();
              }}
              disabled={markAllReadState.isLoading}
              hitSlop={8}
            >
              <GText variant="caption" color={theme.colors.primary}>
                Read all
              </GText>
            </Pressable>
          ) : null
        }
      />
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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          <GChip
            label="All"
            selected={filter === 'ALL'}
            onPress={() => setFilter('ALL')}
          />
          <GChip
            label="Unread"
            selected={filter === 'UNREAD'}
            onPress={() => setFilter('UNREAD')}
          />
          {categories.map((category) => (
            <GChip
              key={category}
              label={NOTIFICATION_CATEGORY_LABELS[category]}
              selected={filter === category}
              onPress={() => setFilter(category)}
            />
          ))}
        </ScrollView>

        {filtered.length === 0 ? (
          <GEmptyState
            title="No notifications"
            description="Order updates, incentives, and payout alerts will land here."
          />
        ) : (
          filtered.map((item) => (
            <GListRow
              key={item.id}
              title={item.title}
              subtitle={`${NOTIFICATION_CATEGORY_LABELS[item.category]} · ${formatRelativeTime(item.createdAt)}\n${item.body}`}
              right={
                item.read ? undefined : <GBadge label="New" tone="accent" />
              }
              showChevron={Boolean(item.deepLink)}
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
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  pad: {
    padding: theme.spacing[4],
    gap: theme.spacing[3],
  },
  content: {
    paddingBottom: theme.spacing[8],
    flexGrow: 1,
  },
  chips: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    gap: theme.spacing[2],
  },
});
