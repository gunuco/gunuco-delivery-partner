import type { ReactNode } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GIcon, GText, theme, type IconName } from '@/src/design-system';

export const PROFILE_BG = '#FFF8FA';

export type ProfileScreenShellProps = {
  title: string;
  subtitle?: string;
  onBack: () => void;
  children: ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  contentStyle?: StyleProp<ViewStyle>;
  rightAction?: ReactNode;
  /** When false, children fill the body (for forms / chat composers). */
  scroll?: boolean;
};

/** Soft-pink profile stack shell matching Orders / Earnings / Profile tab language. */
export function ProfileScreenShell({
  title,
  subtitle,
  onBack,
  children,
  refreshing = false,
  onRefresh,
  contentStyle,
  rightAction,
  scroll = true,
}: ProfileScreenShellProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onBack}
          hitSlop={8}
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
        >
          <GIcon name="back" size={22} color={theme.colors.primary} />
        </Pressable>
        <View style={styles.headerCopy}>
          <GText variant="title" center numberOfLines={1}>
            {title}
          </GText>
          {subtitle ? (
            <GText
              variant="caption"
              color={theme.colors.textSecondary}
              center
              numberOfLines={1}
            >
              {subtitle}
            </GText>
          ) : null}
        </View>
        <View style={styles.headerRight}>{rightAction}</View>
      </View>

      {scroll ? (
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: theme.spacing[10] + insets.bottom },
            contentStyle,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={theme.colors.primary}
              />
            ) : undefined
          }
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View
          style={[
            styles.body,
            { paddingBottom: Math.max(insets.bottom, theme.spacing[3]) },
            contentStyle,
          ]}
        >
          {children}
        </View>
      )}
    </View>
  );
}

export type ProfileDetailRowProps = {
  label: string;
  value: string;
  icon?: IconName;
  right?: ReactNode;
  onPress?: () => void;
};

export function ProfileDetailRow({
  label,
  value,
  icon,
  right,
  onPress,
}: ProfileDetailRowProps) {
  const body = (
    <View style={styles.rowInner}>
      {icon ? (
        <View style={styles.iconCircle}>
          <GIcon name={icon} size={18} color={theme.colors.primary} />
        </View>
      ) : null}
      <View style={styles.rowCopy}>
        <GText variant="caption" color={theme.colors.textSecondary}>
          {label}
        </GText>
        <GText variant="bodyBold" numberOfLines={2}>
          {value}
        </GText>
      </View>
      {right}
      {onPress ? (
        <GIcon name="chevronRight" size={18} color={theme.colors.textMuted} />
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        style={({ pressed }) => [styles.rowCard, pressed && styles.pressed]}
      >
        {body}
      </Pressable>
    );
  }

  return <View style={styles.rowCard}>{body}</View>;
}

export type ProfileHeroCardProps = {
  icon?: IconName;
  eyebrow?: string;
  title: string;
  body?: string;
  right?: ReactNode;
  children?: ReactNode;
  tone?: 'primary' | 'soft';
};

export function ProfileHeroCard({
  icon,
  eyebrow,
  title,
  body,
  right,
  children,
  tone = 'soft',
}: ProfileHeroCardProps) {
  const primary = tone === 'primary';
  return (
    <View style={[styles.hero, primary ? styles.heroPrimary : styles.heroSoft]}>
      <View style={styles.heroTop}>
        {icon ? (
          <View
            style={[
              styles.heroIcon,
              primary ? styles.heroIconOnPrimary : styles.iconCircle,
            ]}
          >
            <GIcon
              name={icon}
              size={22}
              color={primary ? theme.colors.textInverse : theme.colors.primary}
            />
          </View>
        ) : null}
        <View style={styles.heroCopy}>
          {eyebrow ? (
            <GText
              variant="label"
              color={primary ? 'rgba(255,255,255,0.8)' : theme.colors.textSecondary}
              style={styles.eyebrow}
            >
              {eyebrow}
            </GText>
          ) : null}
          <GText
            variant="h3"
            color={primary ? theme.colors.textInverse : theme.colors.text}
          >
            {title}
          </GText>
          {body ? (
            <GText
              variant="body"
              color={primary ? 'rgba(255,255,255,0.88)' : theme.colors.textSecondary}
            >
              {body}
            </GText>
          ) : null}
        </View>
        {right}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PROFILE_BG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    gap: theme.spacing[2],
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: theme.spacing[4],
    gap: theme.spacing[3],
  },
  body: {
    flex: 1,
    paddingHorizontal: theme.spacing[4],
  },
  rowCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[3],
    ...theme.shadows.sm,
  },
  rowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  hero: {
    borderRadius: theme.radius.xl,
    padding: theme.spacing[4],
    gap: theme.spacing[3],
    ...theme.shadows.sm,
  },
  heroSoft: {
    backgroundColor: theme.colors.surface,
  },
  heroPrimary: {
    backgroundColor: theme.colors.primary,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing[3],
  },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIconOnPrimary: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  heroCopy: {
    flex: 1,
    gap: theme.spacing[1],
    minWidth: 0,
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  pressed: {
    opacity: 0.9,
  },
});
