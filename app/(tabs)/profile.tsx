import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Share, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  GAvatar,
  GConfirmationDialog,
  GErrorState,
  GIcon,
  GSkeleton,
  GText,
  theme,
  useToast,
  type IconName,
} from '@/src/design-system';
import { useAuth, usePartner } from '@/src/hooks';
import { maskPhone } from '@/src/utils/phone';
import { profileImageSources } from '../../assets/images/profile/sources';

const BG = '#FFF8FA';
const HEADER_PINK = '#FDE8ED';
const AVATAR_SIZE = 100;

const MENU: {
  title: string;
  subtitle: string;
  href: string;
  icon: IconName;
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
    icon: 'training',
  },
  {
    title: 'Refer & earn',
    subtitle: 'Invite partners',
    href: '/profile/referral',
    icon: 'genderOther',
  },
];

function availabilityLabel(value?: string | null): string {
  if (!value) return 'Offline';
  const key = value.toUpperCase();
  if (key === 'ONLINE') return 'Online';
  if (key === 'BUSY' || key === 'ON_DELIVERY') return 'Busy';
  return 'Offline';
}

function isOnline(value?: string | null): boolean {
  return (value ?? '').toUpperCase() === 'ONLINE';
}

export default function ProfileTabScreen() {
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { partner, availability, isLoading, error, refetch, isFetching } = usePartner();
  const { logout, logoutState } = useAuth();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const online = isOnline(availability);
  const statusText = availabilityLabel(availability);
  const partnerCode = partner?.partnerCode ?? '—';

  const onCopyCode = () => {
    if (!partner?.partnerCode) return;
    void (async () => {
      try {
        await Share.share({ message: partner.partnerCode });
      } catch {
        showToast({ type: 'error', message: 'Could not share partner ID' });
      }
    })();
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: theme.spacing[10] + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
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
        {/* Header: pink art + title/settings overlay + avatar straddling wave */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <View style={styles.bannerStage}>
            <Image
              source={profileImageSources.banner}
              style={styles.banner}
              contentFit="cover"
              contentPosition="top center"
              accessibilityLabel="Deliver Grow Belong"
              transition={120}
            />
          </View>

          <View style={styles.titleBar} pointerEvents="box-none">
            <View style={styles.titleCopy}>
              <GText variant="h2" style={styles.titleCenter}>
                Profile
              </GText>
              <GText
                variant="caption"
                color={theme.colors.textSecondary}
                style={styles.titleCenter}
              >
                Your GUNUCO partner account
              </GText>
            </View>
          </View>

          {/* Keeps header tall enough for slogan + character behind avatar */}
          <View style={styles.headerSpacer} />

          <View style={styles.avatarSlot}>
            {isLoading && !partner ? (
              <GSkeleton width={AVATAR_SIZE} height={AVATAR_SIZE} borderRadius={AVATAR_SIZE / 2} />
            ) : (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Edit profile photo"
                onPress={() => router.push('/profile/personal')}
                style={styles.avatarWrap}
              >
                <View style={styles.avatarRing}>
                  <GAvatar size="xxl" uri={partner?.photoUrl} name={partner?.name} />
                </View>
                <View style={styles.editBadge}>
                  <GIcon name="edit" size={12} color={theme.colors.textInverse} />
                </View>
              </Pressable>
            )}
          </View>
        </View>

        {error && !partner ? (
          <GErrorState
            title="Couldn't load profile"
            onRetry={() => {
              void refetch();
            }}
          />
        ) : (
          <>
            <View style={styles.identity}>
              {isLoading && !partner ? (
                <>
                  <GSkeleton height={24} width="55%" />
                  <GSkeleton height={28} width="42%" borderRadius={theme.radius.full} />
                  <GSkeleton height={16} width="48%" />
                </>
              ) : (
                <>
                  <GText variant="h2">{partner?.name ?? 'Partner'}</GText>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Copy partner ID ${partnerCode}`}
                    onPress={onCopyCode}
                    style={({ pressed }) => [styles.codePill, pressed && styles.pressed]}
                  >
                    <GText
                      variant="caption"
                      color={theme.colors.textSecondary}
                      style={styles.codeText}
                    >
                      {partnerCode}
                    </GText>
                    <GIcon name="document" size={14} color={theme.colors.textMuted} />
                  </Pressable>

                  <GText variant="caption" color={theme.colors.textMuted}>
                    {partner?.phone ? maskPhone(partner.phone) : '—'}
                  </GText>

                  <View style={styles.statusRow}>
                    <View
                      style={[
                        styles.onlinePill,
                        {
                          backgroundColor: online
                            ? theme.colors.successSoft
                            : theme.colors.surfaceMuted,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.dot,
                          {
                            backgroundColor: online ? theme.colors.online : theme.colors.offline,
                          },
                        ]}
                      />
                      <GText
                        variant="bodyBold"
                        color={online ? theme.colors.online : theme.colors.textSecondary}
                      >
                        {statusText}
                      </GText>
                    </View>
                    <View style={styles.statusDivider} />
                    <View style={styles.ratingSide}>
                      <GIcon name="starFilled" size={16} color="#F5B301" />
                      <GText variant="bodyBold">
                        {typeof partner?.rating === 'number' ? partner.rating.toFixed(2) : '—'}
                      </GText>
                    </View>
                  </View>
                </>
              )}
            </View>

            <View style={styles.menu}>
              {MENU.map((item) => (
                <Pressable
                  key={item.href}
                  accessibilityRole="button"
                  accessibilityLabel={item.title}
                  onPress={() => router.push(item.href as never)}
                  style={({ pressed }) => [styles.menuRow, pressed && styles.pressed]}
                >
                  <View style={styles.menuIcon}>
                    <GIcon name={item.icon} size={20} color={theme.colors.primary} />
                  </View>
                  <View style={styles.menuCopy}>
                    <GText variant="bodyBold">{item.title}</GText>
                    <GText variant="caption" color={theme.colors.textSecondary}>
                      {item.subtitle}
                    </GText>
                  </View>
                  <GIcon name="chevronRight" size={18} color={theme.colors.textMuted} />
                </Pressable>
              ))}
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="More deliveries More rewards"
              onPress={() => router.push('/profile/benefits')}
              style={({ pressed }) => [styles.promo, pressed && styles.pressed]}
            >
              <View style={styles.promoIcon}>
                <GIcon name="gift" size={22} color={theme.colors.primary} />
              </View>
              <GText variant="bodyBold" color={theme.colors.primary} style={styles.promoText}>
                More deliveries More rewards!
              </GText>
              <View style={styles.promoCta}>
                <GText variant="caption" color={theme.colors.primary} style={styles.promoCtaLabel}>
                  Know more {'>'}
                </GText>
              </View>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Log out"
              onPress={() => setConfirmLogout(true)}
              style={({ pressed }) => [styles.logoutRow, pressed && styles.pressed]}
            >
              <View style={[styles.menuIcon, styles.logoutIcon]}>
                <GIcon name="logout" size={20} color={theme.colors.danger} />
              </View>
              <View style={styles.menuCopy}>
                <GText variant="bodyBold" color={theme.colors.danger}>
                  Log out
                </GText>
                <GText variant="caption" color={theme.colors.textSecondary}>
                  Sign out of this device
                </GText>
              </View>
            </Pressable>
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
    backgroundColor: BG,
  },
  content: {
    backgroundColor: BG,
  },
  header: {
    backgroundColor: HEADER_PINK,
    paddingBottom: AVATAR_SIZE / 2,
    overflow: 'visible',
    zIndex: 1,
  },
  bannerStage: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  banner: {
    width: '100%',
    height: '110%',
    top: -4,
  },
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[2],
    paddingBottom: theme.spacing[1],
    zIndex: 2,
  },
  headerSpacer: {
    height: 32,
  },
  titleCopy: {
    alignItems: 'center',
    gap: 2,
    flex: 1,
  },
  titleCenter: {
    textAlign: 'center',
  },

  avatarSlot: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -(AVATAR_SIZE / 2),
    alignItems: 'center',
    zIndex: 3,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatarRing: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 4,
    borderColor: theme.colors.white,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
  },
  editBadge: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 28,
    height: 28,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identity: {
    alignItems: 'center',
    gap: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
    paddingTop: AVATAR_SIZE / 2 + theme.spacing[3],
    paddingBottom: theme.spacing[4],
  },
  codePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[1],
    backgroundColor: '#EEF0F3',
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.radius.full,
  },
  codeText: {
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    marginTop: theme.spacing[1],
  },
  onlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.radius.full,
  },
  ratingSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[1],
  },
  statusDivider: {
    width: StyleSheet.hairlineWidth,
    height: 18,
    backgroundColor: theme.colors.borderStrong,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: theme.radius.full,
  },
  menu: {
    paddingHorizontal: theme.spacing[4],
    gap: theme.spacing[2],
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[3],
    ...theme.shadows.sm,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  promo: {
    marginTop: theme.spacing[3],
    marginHorizontal: theme.spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    backgroundColor: theme.colors.accentSoft,
    borderRadius: theme.radius.xl,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[3],
    overflow: 'hidden',
  },
  promoIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoText: {
    flex: 1,
  },
  promoCta: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
  },
  promoCtaLabel: {
    fontWeight: '700',
  },
  logoutRow: {
    marginTop: theme.spacing[3],
    marginHorizontal: theme.spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[3],
    ...theme.shadows.sm,
  },
  logoutIcon: {
    backgroundColor: theme.colors.dangerSoft,
  },
  pressed: {
    opacity: 0.9,
  },
});
