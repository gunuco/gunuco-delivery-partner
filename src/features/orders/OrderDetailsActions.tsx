import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GButton, GIcon, theme } from '@/src/design-system';

export type OrderDetailsActionsProps = {
  primaryLabel?: string | null;
  primaryLoading?: boolean;
  onPrimary?: () => void;
  onCallCustomer: () => void;
  onNavigate: () => void;
  onOpenHub: () => void;
  onReportIssue: () => void;
};

export function OrderDetailsActions({
  primaryLabel,
  primaryLoading = false,
  onPrimary,
  onCallCustomer,
  onNavigate,
  onOpenHub,
  onReportIssue,
}: OrderDetailsActionsProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.root,
        { paddingBottom: Math.max(insets.bottom, theme.spacing[3]) },
      ]}
    >
      <View style={styles.row}>
        <GButton
          title="Call customer"
          variant="secondary"
          onPress={onCallCustomer}
          leftIcon={<GIcon name="phone" size={16} color={theme.colors.primary} />}
          style={[styles.flex, styles.callBtn]}
        />
        <GButton
          title="Navigate"
          variant="outline"
          onPress={onNavigate}
          leftIcon={<GIcon name="navigation" size={16} color={theme.colors.primary} />}
          style={styles.flex}
        />
      </View>

      <GButton title="Open delivery hub" variant="outline" fullWidth onPress={onOpenHub} />

      {primaryLabel && onPrimary ? (
        <GButton
          title={primaryLabel}
          size="lg"
          fullWidth
          loading={primaryLoading}
          onPress={onPrimary}
        />
      ) : null}

      <GButton title="Report issue" variant="primary" fullWidth onPress={onReportIssue} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[3],
    backgroundColor: theme.colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing[2],
  },
  flex: {
    flex: 1,
  },
  callBtn: {
    backgroundColor: theme.colors.accentSoft,
    borderColor: theme.colors.accentSoft,
  },
});
