import { StyleSheet, View } from 'react-native';

import { GIcon } from '../icons/GIcon';
import { theme } from '../theme';
import { GCard } from './GCard';
import { GStatusBadge } from './GStatusBadge';
import { GText } from './GText';

export type GDocumentCardProps = {
  type: string;
  status: string;
  expiry?: string;
  onPress?: () => void;
};

export function GDocumentCard({ type, status, expiry, onPress }: GDocumentCardProps) {
  return (
    <GCard onPress={onPress} padding="md">
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <GIcon name="document" size={22} color={theme.colors.primary} />
        </View>
        <View style={styles.content}>
          <GText variant="bodyBold" numberOfLines={1}>
            {type}
          </GText>
          {expiry ? (
            <GText variant="caption" color={theme.colors.textSecondary}>
              Expires {expiry}
            </GText>
          ) : null}
        </View>
        <GStatusBadge status={status} kind="partner" />
      </View>
    </GCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
});
