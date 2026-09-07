import { Image, Pressable, StyleSheet, View } from 'react-native';

import { GAvatar, GIcon, GText, theme } from '@/src/design-system';
import { brandImageSources } from '../../../assets/images/brand/sources';

import { getTimeGreeting } from './greeting';

const TAGLINE_BANNER = brandImageSources.taglineGiraffes;

export type HomeHeaderProps = {
  partnerName: string;
  photoUrl?: string | null;
  isOnline: boolean;
  unreadCount: number;
  onNotifications: () => void;
  onProfile: () => void;
};

export function HomeHeader({
  partnerName,
  photoUrl,
  isOnline,
  unreadCount,
  onNotifications,
  onProfile,
}: HomeHeaderProps) {
  const greeting = getTimeGreeting();

  return (
    <View style={styles.root}>
      <View style={styles.topRow}>
        <View style={styles.brandRow}>
          <Image
            source={brandImageSources.logo}
            style={styles.logo}
            accessibilityLabel="GUNUCO logo"
          />
          <View style={styles.brandText}>
            <GText variant="title" color={theme.colors.primary} style={styles.brandName}>
              GUNUCO
            </GText>
            <GText variant="caption" color={theme.colors.textSecondary}>
              Delivery Partner
            </GText>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'
            }
            onPress={onNotifications}
            style={styles.bellBtn}
          >
            <GIcon name="notification" size={20} color={theme.colors.textSecondary} />
            {unreadCount > 0 ? <View style={styles.unreadDot} /> : null}
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Profile"
            onPress={onProfile}
            style={styles.avatarWrap}
          >
            <GAvatar size="md" uri={photoUrl} name={partnerName} />
            {isOnline ? <View style={styles.onlineDot} /> : null}
          </Pressable>
        </View>
      </View>

      <View style={styles.greetingBlock}>
        <View style={styles.watermark} pointerEvents="none">
          <Image
            source={TAGLINE_BANNER}
            style={styles.taglineBanner}
            resizeMode="contain"
            accessibilityLabel="Delivering Happiness Together"
          />
        </View>

        <GText variant="body" color={theme.colors.textSecondary} style={styles.greetingLine}>
          {greeting},
        </GText>
        <GText variant="h2" style={styles.partnerName}>
          {partnerName}
        </GText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: theme.spacing[4],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    flexShrink: 1,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
  },
  brandText: {
    gap: 1,
    flexShrink: 1,
  },
  brandName: {
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    backgroundColor: '#EEF0F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadDot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.danger,
    borderWidth: 1.5,
    borderColor: theme.colors.white,
  },
  avatarWrap: {
    position: 'relative',
  },
  onlineDot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.online,
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  greetingBlock: {
    position: 'relative',
    paddingVertical: theme.spacing[1],
    gap: 2,
    overflow: 'hidden',
    minHeight: 68,
  },
  watermark: {
    position: 'absolute',
    right: -8,
    top: 0,
    bottom: 0,
    width: 210,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  taglineBanner: {
    width: 228,
    height: 78,
    opacity: 1,
  },
  partnerName: {
    fontWeight: '800',
    zIndex: 1,
    maxWidth: '55%',
  },
  greetingLine: {
    zIndex: 1,
    maxWidth: '55%',
  },
});
