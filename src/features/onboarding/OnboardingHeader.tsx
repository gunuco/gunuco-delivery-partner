import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GIcon, GIconButton, GText, theme } from '@/src/design-system';

export type OnboardingHeaderProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  onHelp?: () => void;
};

export function OnboardingHeader({
  title,
  subtitle,
  showBack = true,
  onBack,
  onHelp,
}: OnboardingHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(onboarding)');
  };

  const handleHelp = () => {
    if (onHelp) {
      onHelp();
      return;
    }
    router.push('/support');
  };

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + theme.spacing[2] }]}>
      <View style={styles.side}>
        {showBack ? (
          <GIconButton accessibilityLabel="Go back" onPress={handleBack}>
            <GIcon name="back" size={22} color={theme.colors.text} />
          </GIconButton>
        ) : null}
      </View>

      <View style={styles.center}>
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

      <View style={[styles.side, styles.sideRight]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Need help"
          onPress={handleHelp}
          style={({ pressed }) => [styles.helpChip, pressed && styles.helpPressed]}
        >
          <GIcon name="support" size={14} color={theme.colors.primary} />
          <GText variant="label" color={theme.colors.primary}>
            Need help?
          </GText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing[2],
    paddingHorizontal: theme.spacing[2],
    flexDirection: 'row',
    alignItems: 'center',
  },
  side: {
    minWidth: 72,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing[1],
  },
  helpChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.accentSoft,
  },
  helpPressed: {
    opacity: 0.85,
  },
});
