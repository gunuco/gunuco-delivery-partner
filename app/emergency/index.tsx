import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import {
  GButton,
  GCard,
  GHeader,
  GIcon,
  GSectionHeader,
  GText,
  theme,
} from '@/src/design-system';
import { useOrders } from '@/src/hooks';
import {
  EMERGENCY_NUMBER,
  GUNUCO_SUPPORT_NUMBER,
} from '@/src/constants/support';
import { callPhone } from '@/src/services/linking';
import { getErrorMessage } from '@/src/utils/errors';

const SAFETY_STEPS = [
  'Move to a well-lit, public place if it is safe to do so.',
  'Do not confront anyone. Your safety comes before the order.',
  'Call emergency services immediately if you or others are in danger.',
  'After you are safe, call GUNUCO support and share your order ID if you have one.',
  'Never share OTPs, customer addresses, or personal documents over unknown calls.',
] as const;

export default function EmergencyScreen() {
  const { activeOrder } = useOrders();

  const dial = async (number: string, label: string) => {
    try {
      await callPhone(number);
    } catch (err) {
      Alert.alert(`Couldn’t open ${label}`, getErrorMessage(err));
    }
  };

  return (
    <View style={styles.screen}>
      <GHeader
        title="Emergency"
        subtitle="Help is one tap away"
        showBack
        onBack={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <GCard padding="lg" style={styles.alertCard}>
          <View style={styles.alertRow}>
            <GIcon name="emergency" size={28} color={theme.colors.danger} />
            <View style={styles.flex}>
              <GText variant="h3">Partner safety first</GText>
              <GText variant="body" color={theme.colors.textSecondary}>
                Use these options only when you need immediate help. GUNUCO does
                not silently track your location from this screen.
              </GText>
            </View>
          </View>
        </GCard>

        <GButton
          title={`Emergency call (${EMERGENCY_NUMBER})`}
          variant="danger"
          size="lg"
          fullWidth
          leftIcon={<GIcon name="phone" size={20} color={theme.colors.textInverse} />}
          onPress={() => {
            void dial(EMERGENCY_NUMBER, 'emergency dialer');
          }}
        />
        <GButton
          title={`GUNUCO support (${GUNUCO_SUPPORT_NUMBER})`}
          variant="outline"
          size="lg"
          fullWidth
          leftIcon={<GIcon name="phone" size={20} color={theme.colors.primary} />}
          onPress={() => {
            void dial(GUNUCO_SUPPORT_NUMBER, 'support dialer');
          }}
        />

        {activeOrder ? (
          <GCard padding="md" style={styles.orderCard}>
            <GText variant="label" color={theme.colors.textMuted}>
              Active order context
            </GText>
            <GText variant="bodyBold">
              {activeOrder.orderNumber ?? activeOrder.id}
            </GText>
            <GText variant="caption" color={theme.colors.textSecondary}>
              Status: {activeOrder.status.replace(/_/g, ' ')}
              {activeOrder.customerArea
                ? ` · ${activeOrder.customerArea}`
                : ''}
            </GText>
            <GText variant="caption" color={theme.colors.textMuted}>
              Share this order ID with emergency services or GUNUCO support if
              asked. No background tracking is started from here.
            </GText>
          </GCard>
        ) : (
          <GCard padding="md">
            <GText variant="body" color={theme.colors.textSecondary}>
              No active order right now. You can still call emergency services or
              GUNUCO support.
            </GText>
          </GCard>
        )}

        <GSectionHeader title="Safety instructions" />
        {SAFETY_STEPS.map((step, index) => (
          <View key={step} style={styles.step}>
            <View style={styles.stepBadge}>
              <GText variant="label" color={theme.colors.primary}>
                {index + 1}
              </GText>
            </View>
            <GText variant="body" style={styles.flex}>
              {step}
            </GText>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing[4],
    gap: theme.spacing[3],
    paddingBottom: theme.spacing[10],
  },
  alertCard: {
    borderColor: theme.colors.danger,
  },
  alertRow: {
    flexDirection: 'row',
    gap: theme.spacing[3],
    alignItems: 'flex-start',
  },
  flex: {
    flex: 1,
  },
  orderCard: {
    gap: theme.spacing[1],
  },
  step: {
    flexDirection: 'row',
    gap: theme.spacing[3],
    alignItems: 'flex-start',
    paddingVertical: theme.spacing[1],
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
