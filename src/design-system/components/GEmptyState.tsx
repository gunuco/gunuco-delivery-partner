import { StyleSheet, View } from 'react-native';

import { GIcon } from '../icons/GIcon';
import { theme } from '../theme';
import { GButton } from './GButton';
import { GText } from './GText';

export type GEmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function GEmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: GEmptyStateProps) {
  return (
    <View style={styles.wrap} accessibilityRole="summary">
      <View style={styles.iconWrap}>
        <GIcon name="package" size={36} color={theme.colors.textMuted} />
      </View>
      <GText variant="h3" center>
        {title}
      </GText>
      {description ? (
        <GText variant="body" color={theme.colors.textSecondary} center style={styles.desc}>
          {description}
        </GText>
      ) : null}
      {actionLabel && onAction ? (
        <GButton title={actionLabel} onPress={onAction} style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing[6],
    gap: theme.spacing[2],
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[2],
  },
  desc: {
    maxWidth: 280,
  },
  action: {
    marginTop: theme.spacing[3],
  },
});
