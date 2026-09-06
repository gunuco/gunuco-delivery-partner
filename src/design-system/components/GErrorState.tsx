import { StyleSheet, View } from 'react-native';

import { GIcon } from '../icons/GIcon';
import { theme } from '../theme';
import { GButton } from './GButton';
import { GText } from './GText';

export type GErrorStateProps = {
  title: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export function GErrorState({
  title,
  description,
  onRetry,
  retryLabel = 'Try again',
}: GErrorStateProps) {
  return (
    <View style={styles.wrap} accessibilityRole="alert">
      <View style={styles.iconWrap}>
        <GIcon name="alert" size={36} color={theme.colors.danger} />
      </View>
      <GText variant="h3" center>
        {title}
      </GText>
      {description ? (
        <GText variant="body" color={theme.colors.textSecondary} center style={styles.desc}>
          {description}
        </GText>
      ) : null}
      {onRetry ? (
        <GButton title={retryLabel} variant="outline" onPress={onRetry} style={styles.action} />
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
    backgroundColor: '#F8E4E4',
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
