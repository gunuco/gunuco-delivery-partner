import { StyleSheet, Switch, View } from 'react-native';

import { GText, theme } from '@/src/design-system';

export type OnlineStatusCardProps = {
  isOnline: boolean;
  isToggling?: boolean;
  onToggle: (next: boolean) => void;
};

export function OnlineStatusCard({
  isOnline,
  isToggling = false,
  onToggle,
}: OnlineStatusCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View
          style={[
            styles.dot,
            { backgroundColor: isOnline ? theme.colors.online : theme.colors.offline },
          ]}
        />
        <View style={styles.textCol}>
          <GText
            variant="bodyBold"
            color={isOnline ? theme.colors.online : theme.colors.text}
          >
            {isOnline ? 'You are online' : 'You are offline'}
          </GText>
          <GText variant="caption" color={theme.colors.textSecondary}>
            {isOnline
              ? 'Receiving new order assignments'
              : 'Go online to start receiving orders'}
          </GText>
        </View>
      </View>

      <Switch
        accessibilityLabel={isOnline ? 'Go offline' : 'Go online'}
        value={isOnline}
        onValueChange={onToggle}
        disabled={isToggling}
        trackColor={{
          false: theme.colors.borderStrong,
          true: theme.colors.online,
        }}
        thumbColor={theme.colors.white}
        ios_backgroundColor={theme.colors.borderStrong}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing[3],
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[4],
    ...theme.shadows.sm,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: theme.radius.full,
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
});
