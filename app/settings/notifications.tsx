import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { GHeader, GSwitch, theme } from '@/src/design-system';

export default function SettingsNotificationsScreen() {
  const [orders, setOrders] = useState(true);
  const [earnings, setEarnings] = useState(true);
  const [incentives, setIncentives] = useState(true);
  const [shifts, setShifts] = useState(true);
  const [support, setSupport] = useState(true);
  const [marketing, setMarketing] = useState(false);

  return (
    <View style={styles.screen}>
      <GHeader
        title="Notification preferences"
        subtitle="Choose what reaches you"
        showBack
        onBack={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <GSwitch
          label="Order alerts"
          description="New assignments and delivery updates"
          value={orders}
          onValueChange={setOrders}
        />
        <GSwitch
          label="Earnings & payouts"
          description="Settlement and credit updates"
          value={earnings}
          onValueChange={setEarnings}
        />
        <GSwitch
          label="Incentives"
          description="Progress and bonus unlocks"
          value={incentives}
          onValueChange={setIncentives}
        />
        <GSwitch
          label="Shift reminders"
          description="Upcoming booked slots"
          value={shifts}
          onValueChange={setShifts}
        />
        <GSwitch
          label="Support replies"
          description="Ticket message notifications"
          value={support}
          onValueChange={setSupport}
        />
        <GSwitch
          label="Tips & campaigns"
          description="Optional product updates"
          value={marketing}
          onValueChange={setMarketing}
        />
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
    gap: theme.spacing[2],
    paddingBottom: theme.spacing[8],
  },
});
