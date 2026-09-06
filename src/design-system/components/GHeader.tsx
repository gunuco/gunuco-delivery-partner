import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GIcon } from '../icons/GIcon';
import { theme } from '../theme';
import { GIconButton } from './GIconButton';
import { GText } from './GText';

export type GHeaderProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightActions?: ReactNode;
};

export function GHeader({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightActions,
}: GHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingTop: insets.top + theme.spacing[2],
          minHeight: theme.components.headerHeight + insets.top,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.side}>
          {showBack ? (
            <GIconButton accessibilityLabel="Go back" onPress={onBack}>
              <GIcon name="back" size={theme.components.iconSizes.lg} color={theme.colors.text} />
            </GIconButton>
          ) : null}
        </View>
        <View style={styles.center}>
          <GText variant="title" center numberOfLines={1}>
            {title}
          </GText>
          {subtitle ? (
            <GText variant="caption" color={theme.colors.textSecondary} center numberOfLines={1}>
              {subtitle}
            </GText>
          ) : null}
        </View>
        <View style={[styles.side, styles.right]}>{rightActions}</View>
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
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: theme.components.headerHeight - theme.spacing[2],
  },
  side: {
    width: 56,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  right: {
    alignItems: 'flex-end',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
