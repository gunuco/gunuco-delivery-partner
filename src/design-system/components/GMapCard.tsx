import { StyleSheet, View } from 'react-native';

import { GIcon } from '../icons/GIcon';
import { theme } from '../theme';
import { GButton } from './GButton';
import { GCard } from './GCard';
import { GText } from './GText';

export type GMapCardProps = {
  destinationLabel: string;
  distance: string;
  eta: string;
  onNavigate?: () => void;
};

export function GMapCard({
  destinationLabel,
  distance,
  eta,
  onNavigate,
}: GMapCardProps) {
  return (
    <GCard padding="md" style={styles.card}>
      <View style={styles.top}>
        <View style={styles.pin}>
          <GIcon name="navigation" size={22} color={theme.colors.accent} />
        </View>
        <View style={styles.copy}>
          <GText variant="label" color={theme.colors.textSecondary}>
            Destination
          </GText>
          <GText variant="bodyBold" numberOfLines={2}>
            {destinationLabel}
          </GText>
        </View>
      </View>
      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <GText variant="caption" color={theme.colors.textMuted}>
            Distance
          </GText>
          <GText variant="bodyBold">{distance}</GText>
        </View>
        <View style={styles.metaItem}>
          <GText variant="caption" color={theme.colors.textMuted}>
            ETA
          </GText>
          <GText variant="bodyBold">{eta}</GText>
        </View>
      </View>
      {onNavigate ? (
        <GButton
          title="Navigate"
          fullWidth
          leftIcon={<GIcon name="navigationFilled" size={18} color={theme.colors.textInverse} />}
          onPress={onNavigate}
          style={styles.cta}
        />
      ) : null}
    </GCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing[3],
  },
  top: {
    flexDirection: 'row',
    gap: theme.spacing[3],
    alignItems: 'center',
  },
  pin: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    backgroundColor: '#F8E8EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  meta: {
    flexDirection: 'row',
    gap: theme.spacing[6],
  },
  metaItem: {
    gap: 2,
  },
  cta: {
    marginTop: theme.spacing[1],
  },
});
