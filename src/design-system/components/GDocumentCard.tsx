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
    <GCard onPress={onPress} padding="md" elevated style={styles.card}>
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <GIcon name="document" size={20} color={theme.colors.primary} />
        </View>
        <View style={styles.content}>
          <GText variant="bodyBold" numberOfLines={1}>
            {type}
          </GText>
          {expiry ? (
            <GText variant="caption" color={theme.colors.textSecondary}>
              Expires {expiry}
            </GText>
          ) : (
            <GText variant="caption" color={theme.colors.textMuted}>
              No expiry on file
            </GText>
          )}
        </View>
        <GStatusBadge status={status} kind="partner" />
        <GIcon name="chevronRight" size={18} color={theme.colors.textMuted} />
      </View>
    </GCard>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 0,
    borderRadius: theme.radius.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
});
