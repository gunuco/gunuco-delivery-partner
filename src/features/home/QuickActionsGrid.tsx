import { Pressable, StyleSheet, View } from 'react-native';

import { GIcon, GText, theme, type IconName } from '@/src/design-system';

export type QuickActionsGridProps = {
  onSupport: () => void;
  onEmergency: () => void;
  onAlerts: () => void;
  onHelp: () => void;
};

type Action = {
  key: string;
  label: string;
  icon: IconName;
  onPress: () => void;
  variant: 'surface' | 'danger' | 'soft';
};

export function QuickActionsGrid({
  onSupport,
  onEmergency,
  onAlerts,
  onHelp,
}: QuickActionsGridProps) {
  const actions: Action[] = [
    { key: 'support', label: 'Support', icon: 'support', onPress: onSupport, variant: 'surface' },
    {
      key: 'emergency',
      label: 'Emergency',
      icon: 'emergency',
      onPress: onEmergency,
      variant: 'danger',
    },
    { key: 'alerts', label: 'Alerts', icon: 'megaphone', onPress: onAlerts, variant: 'soft' },
    { key: 'help', label: 'Help Center', icon: 'help', onPress: onHelp, variant: 'soft' },
  ];

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <GIcon name="bolt" size={18} color={theme.colors.primary} />
        <GText variant="bodyBold">Quick actions</GText>
      </View>

      <View style={styles.grid}>
        {actions.map((action) => {
          const isDanger = action.variant === 'danger';
          const bg =
            action.variant === 'danger'
              ? theme.colors.danger
              : action.variant === 'soft'
                ? theme.colors.accentSoft
                : theme.colors.surface;
          const fg = isDanger ? theme.colors.textInverse : theme.colors.primary;

          return (
            <Pressable
              key={action.key}
              accessibilityRole="button"
              accessibilityLabel={action.label}
              onPress={action.onPress}
              style={[
                styles.card,
                { backgroundColor: bg },
                action.variant === 'surface' ? theme.shadows.sm : null,
              ]}
            >
              <GIcon name={action.icon} size={22} color={fg} />
              <GText variant="bodyBold" color={fg}>
                {action.label}
              </GText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: theme.spacing[3],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[3],
  },
  card: {
    width: '47%',
    flexGrow: 1,
    minHeight: 72,
    borderRadius: 16,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
});
