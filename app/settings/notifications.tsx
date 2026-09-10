import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { GSwitch, GText, theme } from '@/src/design-system';
import {
  ProfileHeroCard,
  ProfileScreenShell,
} from '@/src/features/profile/ProfileScreenShell';

export default function SettingsNotificationsScreen() {
  const [orders, setOrders] = useState(true);
  const [earnings, setEarnings] = useState(true);
  const [incentives, setIncentives] = useState(true);
  const [shifts, setShifts] = useState(true);
  const [support, setSupport] = useState(true);
  const [marketing, setMarketing] = useState(false);

  return (
    <ProfileScreenShell
      title="Notification preferences"
      subtitle="Choose what reaches you"
      onBack={() => router.back()}
    >
      <ProfileHeroCard
        icon="notification"
        eyebrow="Preferences"
        title="Stay in the loop"
        body="Pick which alerts you want while delivering with GUNUCO."
      />

      <GText variant="bodyBold" style={styles.section}>
        Alerts
      </GText>

      <View style={styles.card}>
        <GSwitch
          label="Order alerts"
          description="New assignments and delivery updates"
          value={orders}
          onValueChange={setOrders}
        />
      </View>
      <View style={styles.card}>
        <GSwitch
          label="Earnings & payouts"
          description="Settlement and credit updates"
          value={earnings}
          onValueChange={setEarnings}
        />
      </View>
      <View style={styles.card}>
        <GSwitch
          label="Incentives"
          description="Progress and bonus unlocks"
          value={incentives}
          onValueChange={setIncentives}
        />
      </View>
      <View style={styles.card}>
        <GSwitch
          label="Shift reminders"
          description="Upcoming booked slots"
          value={shifts}
          onValueChange={setShifts}
        />
      </View>
      <View style={styles.card}>
        <GSwitch
          label="Support replies"
          description="Ticket message notifications"
          value={support}
          onValueChange={setSupport}
        />
      </View>
      <View style={styles.card}>
        <GSwitch
          label="Tips & campaigns"
          description="Optional product updates"
          value={marketing}
          onValueChange={setMarketing}
        />
      </View>
    </ProfileScreenShell>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: theme.spacing[1],
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    ...theme.shadows.sm,
  },
});
