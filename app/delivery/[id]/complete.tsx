import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import {
  GButton,
  GCard,
  GErrorState,
  GHeader,
  GIcon,
  GLoader,
  GText,
  theme,
} from '@/src/design-system';
import { formatOrderEarnings } from '@/src/features/orders/orderFormat';
import { useOrder } from '@/src/hooks';

export default function DeliveryCompleteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderId = typeof id === 'string' ? id : undefined;
  const { order, isLoading, error, refetch } = useOrder(orderId);

  if (isLoading) {
    return (
      <View style={styles.root}>
        <GHeader title="Complete" showBack onBack={() => router.replace('/(tabs)/home')} />
        <GLoader label="Loading…" />
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={styles.root}>
        <GHeader title="Complete" showBack onBack={() => router.replace('/(tabs)/home')} />
        <GErrorState
          title="Order unavailable"
          onRetry={() => {
            void refetch();
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <GHeader title="Delivered" showBack onBack={() => router.replace('/(tabs)/home')} />
      <View style={styles.body}>
        <View style={styles.iconWrap}>
          <GIcon name="checkCircle" size={48} color={theme.colors.success} />
        </View>
        <GText variant="h2" center>
          Delivery complete
        </GText>
        <GText variant="body" color={theme.colors.textSecondary} center>
          #{order.orderNumber} reached {order.customerName}
        </GText>
        <GCard padding="lg" style={styles.earn}>
          <GText variant="label" color={theme.colors.textSecondary} center>
            You earned
          </GText>
          <GText variant="display" color={theme.colors.success} center>
            {formatOrderEarnings(order)}
          </GText>
        </GCard>
        <GButton
          title="Back to home"
          size="lg"
          fullWidth
          onPress={() => router.replace('/(tabs)/home')}
        />
        <GButton
          title="View orders"
          variant="outline"
          size="lg"
          fullWidth
          onPress={() => router.replace('/(tabs)/orders')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  body: {
    flex: 1,
    padding: theme.spacing[5],
    gap: theme.spacing[3],
    justifyContent: 'center',
  },
  iconWrap: {
    alignSelf: 'center',
    width: 88,
    height: 88,
    borderRadius: theme.radius.full,
    backgroundColor: '#E3F2EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[2],
  },
  earn: {
    marginVertical: theme.spacing[3],
  },
});
