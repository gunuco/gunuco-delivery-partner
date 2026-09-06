import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { theme } from '../theme';
import { GText } from './GText';

export type GSectionHeaderProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export function GSectionHeader({ title, subtitle, action }: GSectionHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.textCol}>
        <GText variant="title" accessibilityRole="header">
          {title}
        </GText>
        {subtitle ? (
          <GText variant="caption" color={theme.colors.textSecondary}>
            {subtitle}
          </GText>
        ) : null}
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing[2],
    gap: theme.spacing[3],
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
});
