import { StyleSheet, Switch, View } from 'react-native';

import { theme } from '../theme';
import { GText } from './GText';

export type GSwitchProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  description?: string;
};

export function GSwitch({
  label,
  value,
  onValueChange,
  disabled = false,
  description,
}: GSwitchProps) {
  return (
    <View style={[styles.row, disabled && styles.disabled]}>
      <View style={styles.textCol}>
        <GText variant="bodyBold">{label}</GText>
        {description ? (
          <GText variant="caption" color={theme.colors.textSecondary}>
            {description}
          </GText>
        ) : null}
      </View>
      <Switch
        accessibilityLabel={label}
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: theme.components.minTouchTarget,
    gap: theme.spacing[3],
    paddingVertical: theme.spacing[2],
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  disabled: {
    opacity: 0.5,
  },
});
